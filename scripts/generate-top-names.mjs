#!/usr/bin/env node
/**
 * generate-top-names.mjs — runs BEFORE `astro build`.
 *
 * Regenerates src/data/top-names.json from live Supabase data so the curated
 * "popular names" list (used for sitemap priority, sitemap-top.xml, and the
 * /names/popular hub) never goes stale.
 *
 * "Top" = a name with a real popularity signal:
 *   - it charts in a national top-list (country_ranks non-empty), OR
 *   - it carries a positive trend_label (popular / rising / classic_steady / reviving).
 * Charting names sort first (by country breadth, then best national rank); the
 * rest follow alphabetically.
 *
 * Fail-safe: on missing env or any network/query error it leaves the existing
 * file untouched and exits 0 — a deploy never breaks over this step.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = 'src/data/top-names.json';

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

async function main() {
  const { url, key } = loadEnv();
  if (!url || !key) {
    console.warn(`[top-names] no Supabase env — keeping existing ${OUT}`);
    return;
  }
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const rows = [];
  const page = 1000;
  let from = 0;
  while (true) {
    const res = await fetch(`${url}/rest/v1/names?select=name,country_count,country_ranks,trend_label`, {
      headers: { ...headers, Range: `${from}-${from + page - 1}`, 'Range-Unit': 'items' },
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}`);
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < page) break;
    from += page;
  }
  const POS = new Set(['popular', 'rising', 'classic_steady', 'reviving']);
  const scored = rows
    .map((r) => {
      const ranks = r.country_ranks && typeof r.country_ranks === 'object'
        ? Object.values(r.country_ranks).map(Number).filter((n) => !Number.isNaN(n)) : [];
      const charting = ranks.length > 0;
      return {
        name: r.name,
        charting,
        breadth: r.country_count || 0,
        best: charting ? Math.min(...ranks) : Infinity,
        positive: charting || POS.has(r.trend_label),
      };
    })
    .filter((r) => r.positive);
  scored.sort((a, b) => {
    if (a.charting !== b.charting) return a.charting ? -1 : 1;
    if (a.charting) {
      if (b.breadth !== a.breadth) return b.breadth - a.breadth;
      if (a.best !== b.best) return a.best - b.best;
    }
    return a.name.localeCompare(b.name);
  });
  const names = scored.map((r) => r.name);
  const charting = scored.filter((r) => r.charting).length;
  writeFileSync(OUT, JSON.stringify(names) + '\n', 'utf8');
  console.log(`[top-names] wrote ${OUT} (${names.length} names; ${charting} charting + ${names.length - charting} labelled)`);
}

main().catch((e) => {
  console.warn(`[top-names] failed (${e.message}) — keeping existing ${OUT}`);
  process.exit(0);
});
