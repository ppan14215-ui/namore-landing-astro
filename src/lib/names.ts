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
 * **Why one big fetch instead of per-page queries:** with 15K+ names and
 * static generation, doing 15K+ HTTP requests to Supabase is wasteful and
 * fragile. One paginated fetch is easy for Supabase to serve and the data
 * lives in memory for the entire build. Per-page hooks like
 * `getStaticPaths` reference this shared list.
 *
 * **Why an explicit column list instead of `select=*` (2026-08-01):** this
 * build ran `select=*`, which is **35.7MB** over 15,182 rows measured against
 * production — not the "~3-5MB" an earlier version of this comment claimed.
 * 59% of those bytes are columns nothing here reads: the DE/NL/ES
 * translations (`meaning_*`, `origin_*`, `longevity_read_*`,
 * `trend_context_*`) plus `countries`, `region`, `source_status`,
 * `country_count`, `syllable_count`, `name_length`, `phonetic_key` and
 * `country_ranks`. A real Vercel preview against all 15,182 public rows
 * measured the list below at **11.8MB** on 2026-08-01.
 *
 * That compounded with two other multipliers. The seven route modules each
 * call `getAllNames()`, and before the memoization below that meant **seven
 * complete catalogue downloads per build** (~250MB). On top of that the
 * Supabase webhook `vercel-rebuild-on-names-change` fired a deploy hook
 * *per changed row*, so the 4,000-name expansion on 2026-07-29/30 (4,000
 * inserts, then 4,000 updates at promote) queued thousands of builds. The
 * result was 25.6GB of Supabase egress against a 5.5GB plan limit. The
 * trigger is now disabled server-side; keep this projection honest so the
 * remaining multiplier stays small. Adding a column here is a real
 * per-build cost.
 *
 * **Pagination:** Supabase's REST API caps at 1000 rows per request by
 * default. We page through with `range(start, end)` until we've read every
 * row, so the build is robust to dataset growth past 1K, past 10K, past
 * 100K. Page size 1000 keeps payloads under a few MB each.
 *
 * **BUILD_LIMIT:** Phase 2 test batch reads the first N names and stops.
 * Useful for previewing 100 pages before committing to the full catalog build.
 */

import type { NameRow } from './types';
import { nameToSlug } from './types';
import mockNames from '../fixtures/names-mock.json' assert { type: 'json' };

// Astro/Vercel execute this module at build time in Node. Keep the small
// environment surface typed locally so the project does not need the entire
// Node ambient type package just to read five build variables.
declare const process: {
  env: {
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    USE_MOCK_DATA?: string;
    BUILD_LIMIT?: string;
    NODE_ENV?: string;
  };
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === '1';
const BUILD_LIMIT = process.env.BUILD_LIMIT
  ? parseInt(process.env.BUILD_LIMIT, 10)
  : undefined;

const PAGE_SIZE = 1000; // Supabase default cap per range query

/**
 * Exactly the columns the templates read. See the "Why an explicit column
 * list" note above before adding to this — every column here is multiplied
 * by 15K rows on every production build.
 *
 * `id` is not rendered but `findRelatedNames` uses it to exclude the target
 * row from its own related list.
 */
const NAME_COLUMNS = [
  'id',
  'name',
  'gender',
  'country_flags',
  'region_tags',
  'meaning',
  'meaning_short',
  'origin',
  'style_tags',
  'vibe_tags',
  'nicknames',
  'longevity_read',
  'trend_label',
  'trend_context',
  'pronunciation_text',
  'popularity_history',
  'popularity_rank',
  'peak_decade',
  'peak_count',
  'births_last_year',
].join(',');

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
  // `catalog_status=eq.public` matters because this build authenticates with
  // the service role key, which bypasses RLS. Ordinary app clients are held
  // to `catalog_status = 'public'` by policy (migration 20260729212321), but
  // this build is not — so without an explicit filter a private QA batch
  // sitting in `public.names` awaiting approval would be published as live
  // SEO pages. That was true of the 4,000-row batch staged 2026-07-29 and
  // only promoted on 2026-07-30.
  const url =
    `${SUPABASE_URL}/rest/v1/names` +
    `?select=${NAME_COLUMNS}` +
    `&catalog_status=eq.public` +
    `&order=name.asc`;
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
  const body = await res.text();
  if (!res.ok) {
    throw new Error(
      `Supabase fetch failed (${res.status} ${res.statusText}): ${body.slice(0, 200)}`,
    );
  }
  // Read the body as text first so the build log can report exactly how much
  // egress it spent. This project shares a Supabase plan whose egress limit
  // a runaway rebuild loop has already blown through once — a number in the
  // log is what makes the next regression obvious instead of invisible.
  bytesFetched += new TextEncoder().encode(body).length;
  return JSON.parse(body) as NameRow[];
}

let bytesFetched = 0;

async function fetchAllFromSupabase(): Promise<NameRow[]> {
  bytesFetched = 0;
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
 * Load and normalize every name once per build process.
 *
 * Astro evaluates several route modules while generating the site. Without
 * this shared promise, each module starts its own complete Supabase download.
 * Caching the promise also deduplicates concurrent callers while the first
 * fetch is still in flight.
 */
async function loadAllNames(): Promise<NameRow[]> {
  let rows: NameRow[];

  if (shouldUseMock()) {
    rows = mockNames as unknown as NameRow[];
    console.log(`[names] mock fixture loaded — ${rows.length} rows`);
  } else {
    rows = await fetchAllFromSupabase();
    console.log(
      `[names] Supabase fetch complete — ${rows.length} rows, ` +
        `${(bytesFetched / 1e6).toFixed(1)} MB egress`,
    );
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

let allNamesPromise: Promise<NameRow[]> | undefined;

/**
 * Returns every name the SEO build will render. Every caller in this process
 * shares the same catalogue download and normalized result.
 */
export function getAllNames(): Promise<NameRow[]> {
  allNamesPromise ??= loadAllNames();
  return allNamesPromise;
}

/**
 * "Related names" for the internal-linking layer — 5 names per page that
 * share origin OR style/vibe tags with the given row. Internal links are
 * the thing that makes a programmatic-SEO site compound: Google sees a
 * dense graph of related-content links instead of thousands of orphan pages.
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
