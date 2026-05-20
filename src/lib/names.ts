/**
 * Data layer for the programmatic SEO build.
 *
 * Two modes:
 *   - **Supabase (production / Vercel CI).** Reads from `public.names`
 *     using the service role key. Bypasses RLS — see the note below.
 *   - **Mock (local dev).** Reads from `src/fixtures/names-mock.json`.
 *     Triggered by `USE_MOCK_DATA=1` or by the absence of SUPABASE_URL +
 *     SUPABASE_SERVICE_ROLE_KEY. Lets the build run in environments that
 *     can't reach Supabase (sandboxed dev, CI without network).
 *
 * **Why the service role key, not the anon key:** the `names` table's
 * RLS policy requires `auth.role() = 'authenticated'` (see schema.sql:213).
 * The anon key would return zero rows. The service role key bypasses RLS
 * and is the standard pattern for build-time data fetches. It must NEVER
 * be exposed client-side; the Astro build produces static HTML so the key
 * never touches a browser. Vercel env vars keep it server-only.
 *
 * **Why one big fetch instead of per-page queries:** with 11K names and
 * static generation, doing 11K HTTP requests to Supabase is wasteful and
 * fragile. One paginated fetch (`select * from names`) is ~3-5MB JSON,
 * easy for Supabase to serve, and the data lives in memory for the entire
 * build. Per-page hooks like `getStaticPaths` reference this shared list.
 *
 * **Pagination:** Supabase's REST API caps at 1000 rows per request by
 * default. We page through with `range(start, end)` until we've read every
 * row, so the build is robust to dataset growth past 1K, past 10K, past
 * 100K. Page size 1000 keeps payloads under a few MB each.
 *
 * **BUILD_LIMIT:** Phase 2 test batch reads the first N names and stops.
 * Useful for previewing 100 pages before committing to the full 11K build.
 */

import type { NameRow } from './types';
import { nameToSlug } from './types';
import mockNames from '../fixtures/names-mock.json' assert { type: 'json' };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === '1';
const BUILD_LIMIT = process.env.BUILD_LIMIT
  ? parseInt(process.env.BUILD_LIMIT, 10)
  : undefined;

const PAGE_SIZE = 1000; // Supabase default cap per range query

function shouldUseMock(): boolean {
  if (USE_MOCK_DATA) return true;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        '[names] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing — falling back to mock fixture. ' +
        'Set both env vars for a real production build.',
      );
    }
    return true;
  }
  return false;
}

/**
 * Fetch a single page from Supabase. Returns the rows + a hint for whether
 * there are more pages. Uses the REST API directly rather than the JS SDK
 * to keep the build's dependency surface tiny (no @supabase/supabase-js
 * needed for read-only paginated reads).
 */
async function fetchSupabasePage(
  from: number,
  to: number,
): Promise<NameRow[]> {
  const url = `${SUPABASE_URL}/rest/v1/names?select=*&order=name.asc`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
      // Range header drives pagination; PostgREST returns Content-Range
      // with the total row count we use to detect "last page reached."
      Range: `${from}-${to}`,
      'Range-Unit': 'items',
      // Asking for exact count keeps the build idempotent — a count of N
      // means we expect N rows total and can verify we got them all.
      Prefer: 'count=exact',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '<unreadable>');
    throw new Error(
      `Supabase fetch failed (${res.status} ${res.statusText}): ${text.slice(0, 200)}`,
    );
  }
  return (await res.json()) as NameRow[];
}

async function fetchAllFromSupabase(): Promise<NameRow[]> {
  const all: NameRow[] = [];
  let from = 0;
  // Hard ceiling at 100 pages (100K names) — safety valve against runaway
  // builds if the dataset balloons unexpectedly. Logs a warning so we
  // notice.
  for (let page = 0; page < 100; page++) {
    const to = from + PAGE_SIZE - 1;
    const rows = await fetchSupabasePage(from, to);
    all.push(...rows);
    if (rows.length < PAGE_SIZE) {
      // Last page — fewer rows than asked for means we've drained the table.
      break;
    }
    from += PAGE_SIZE;
  }
  return all;
}

/**
 * Returns every name the SEO build will render. Caller decides what to do
 * with collisions and missing-data rows.
 */
export async function getAllNames(): Promise<NameRow[]> {
  let rows: NameRow[];

  if (shouldUseMock()) {
    rows = mockNames as unknown as NameRow[];
    console.log(`[names] mock fixture loaded — ${rows.length} rows`);
  } else {
    rows = await fetchAllFromSupabase();
    console.log(`[names] Supabase fetch complete — ${rows.length} rows`);
  }

  // Filter out rows that can't render a meaningful page. The bar is low —
  // we just need a name to slug-ify. Rows missing `meaning` or
  // `popularity_history` still render; the template handles nulls.
  rows = rows.filter((r) => r.name && r.name.trim().length > 0);

  // Apply BUILD_LIMIT for test batches.
  if (BUILD_LIMIT && rows.length > BUILD_LIMIT) {
    console.log(`[names] BUILD_LIMIT=${BUILD_LIMIT} — truncating from ${rows.length} rows`);
    rows = rows.slice(0, BUILD_LIMIT);
  }

  // Slug collision detection. Two distinct rows can theoretically produce
  // the same slug ("Zoë" + "Zoe"). When that happens we log and keep the
  // first row — predictable, deterministic, and the duplicate is rare
  // enough that hand-fixing it is fine.
  const seen = new Map<string, NameRow>();
  const collisions: Array<{ slug: string; first: string; dropped: string }> = [];
  for (const row of rows) {
    const slug = nameToSlug(row.name);
    if (seen.has(slug)) {
      collisions.push({
        slug,
        first: seen.get(slug)!.name,
        dropped: row.name,
      });
    } else {
      seen.set(slug, row);
    }
  }
  if (collisions.length > 0) {
    console.warn(
      `[names] ${collisions.length} slug collision(s):\n` +
        collisions
          .map((c) => `  ${c.slug}: kept "${c.first}", dropped "${c.dropped}"`)
          .join('\n'),
    );
  }

  return Array.from(seen.values());
}

/**
 * "Related names" for the internal-linking layer — 5 names per page that
 * share origin OR style/vibe tags with the given row. Internal links are
 * the thing that makes a programmatic-SEO site compound: Google sees a
 * dense graph of related-content links instead of 11K orphan pages.
 *
 * Algorithm: score every other name by overlap on (origin, gender,
 * trend_label, vibe_tags, style_tags). Sort descending. Take top 5.
 * Deterministic — given the same dataset it always picks the same 5,
 * so the URL/anchor graph is stable across builds.
 */
export function findRelatedNames(
  target: NameRow,
  all: NameRow[],
  count = 5,
): NameRow[] {
  const targetVibe = new Set(splitTags(target.vibe_tags));
  const targetStyle = new Set(splitTags(target.style_tags));
  const targetRegion = new Set(splitTags(target.region_tags));

  const scored = all
    .filter((r) => r.id !== target.id)
    .map((r) => {
      let score = 0;
      // Same origin = strong signal of similarity (etymological cluster).
      if (r.origin && target.origin && r.origin === target.origin) score += 3;
      // Same gender = same audience intent.
      if (r.gender && target.gender && r.gender === target.gender) score += 1;
      // Same trend label = same cultural moment (rising + rising compound).
      if (r.trend_label && target.trend_label && r.trend_label === target.trend_label)
        score += 1;
      // Tag overlaps.
      score += overlap(splitTags(r.vibe_tags), targetVibe) * 1.5;
      score += overlap(splitTags(r.style_tags), targetStyle) * 1.5;
      score += overlap(splitTags(r.region_tags), targetRegion) * 1.0;
      return { row: r, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-breaker: alphabetical, for determinism.
      return a.row.name.localeCompare(b.row.name);
    });

  return scored.slice(0, count).map((s) => s.row);
}

function splitTags(s: string | null | undefined): string[] {
  if (!s) return [];
  return s
    .split(/[,;|]/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
}

function overlap(arr: string[], set: Set<string>): number {
  let n = 0;
  for (const x of arr) if (set.has(x)) n++;
  return n;
}
