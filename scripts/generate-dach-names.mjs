#!/usr/bin/env node
/**
 * generate-dach-names.mjs — DACH-focused priority name list.
 *
 * WHY THIS EXISTS (2026-08-16). Search Console showed the /names corpus earning
 * 110K impressions in 3 months — but for "[name] meaning" queries out of the US,
 * India, Nigeria, the UK, Kenya and Ghana. Germany was 10th at 1,900 impressions.
 * The existing top-names.json sorts by `country_count` (how many countries a name
 * charts in), which structurally favours globally-broad names and is a large part
 * of why the crawl budget is being spent on the wrong market.
 *
 * The product strategy is to fight in German (no DE incumbent does couples
 * matching; the DE category leader has ~815 ratings). This list points crawl
 * budget at that market instead.
 *
 * SELECTION
 *   Tier 1 — charts in the German or Austrian national top-list (country_ranks
 *            has DE or AT). Sorted by best DACH rank. ~49 names.
 *   Tier 2 — region is Germanic or Central European AND trend_label is
 *            popular/rising AND a German meaning exists AND it is used in >= 3
 *            countries. The country_count >= 3 floor is what keeps out one-off
 *            regional spellings. ~162 names.
 *
 * KNOWN LIMITATION — READ BEFORE SHIPPING
 *   country_ranks only covers 41 DE + 21 AT names, so Tier 1 is thin and Tier 2
 *   is carrying most of the list on region tags alone. Region tagging is
 *   imperfect: the tail contains names that are Slovenian, Turkish or simply odd
 *   ("Winner", "Geralt", "Sirius", "Ziggy", "Dijar"). Roughly the first 60 are
 *   unambiguously right; quality decays after that. If you want a clean list,
 *   hand-prune the tail — it is ~200 rows, that is 20 minutes.
 *
 * NOT WIRED INTO THE BUILD. Generates src/data/dach-names.json only. To use it
 * for sitemap priority, point generate-sitemap.mjs at this file instead of
 * top-names.json. Do that deliberately, and re-check Search Console country
 * mix ~3 weeks later.
 *
 * Fail-safe: on missing env or any query error it leaves the existing file
 * untouched and exits 0.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = 'src/data/dach-names.json';

function loadEnv() {
  let url = process.env.SUPABASE_URL;
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if ((!url || !key) && existsSync('.env.local')) {
    for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const v = m[2].trim().replace(/^["']|["']$/g, '');
      if (m[1] === 'SUPABASE_URL' && !url) url = v;
      if (m[1] === 'SUPABASE_SERVICE_ROLE_KEY' && !key) key = v;
    }
  }
  return { url: url && url.replace(/\/$/, ''), key };
}

const POSITIVE = new Set(['popular', 'rising']);
const DACH_REGIONS = new Set(['Germanic', 'Central European']);

async function main() {
  const { url, key } = loadEnv();
  if (!url || !key) {
    console.warn(`[dach-names] no Supabase env — keeping existing ${OUT}`);
    return;
  }
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const rows = [];
  const page = 1000;
  let from = 0;
  const select = 'name,country_count,country_ranks,trend_label,region,meaning_short_de';
  while (true) {
    const res = await fetch(`${url}/rest/v1/names?select=${select}&catalog_status=eq.public`, {
      headers: { ...headers, Range: `${from}-${from + page - 1}`, 'Range-Unit': 'items' },
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}`);
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < page) break;
    from += page;
  }

  const scored = rows
    .map((r) => {
      const cr = r.country_ranks && typeof r.country_ranks === 'object' ? r.country_ranks : {};
      const de = Number(cr.DE);
      const at = Number(cr.AT);
      const dachRank = Number.isFinite(de) ? de : Number.isFinite(at) ? at : Infinity;
      const charting = Number.isFinite(dachRank);
      const tier2 =
        DACH_REGIONS.has(r.region) &&
        POSITIVE.has(r.trend_label) &&
        r.meaning_short_de != null &&
        (r.country_count || 0) >= 3;
      return { name: r.name, charting, dachRank, breadth: r.country_count || 0, keep: charting || tier2 };
    })
    .filter((r) => r.keep);

  scored.sort((a, b) => {
    if (a.charting !== b.charting) return a.charting ? -1 : 1;
    if (a.charting && a.dachRank !== b.dachRank) return a.dachRank - b.dachRank;
    if (b.breadth !== a.breadth) return b.breadth - a.breadth;
    return a.name.localeCompare(b.name, 'de');
  });

  const names = scored.map((r) => r.name);
  const charting = scored.filter((r) => r.charting).length;
  writeFileSync(OUT, JSON.stringify(names) + '\n', 'utf8');
  console.log(`[dach-names] wrote ${OUT} (${names.length} names; ${charting} DACH-charting + ${names.length - charting} Germanic/Central-European)`);
}

main().catch((e) => {
  console.warn(`[dach-names] failed (${e.message}) — keeping existing ${OUT}`);
  process.exit(0);
});
