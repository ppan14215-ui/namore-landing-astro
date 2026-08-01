#!/usr/bin/env node
/**
 * Custom sitemap generator — runs as a postbuild step after `astro build`.
 *
 * Why custom: `@astrojs/sitemap` 3.2.x crashes against Astro 4.16+ in its
 * `astro:build:done` hook (`Cannot read properties of undefined (reading
 * 'reduce')`). Rather than wait for a fix, we generate the sitemap by
 * walking the `dist/names/` directory after the build completes.
 *
 * Output shape (matches what @astrojs/sitemap would have produced):
 *   - `dist/sitemap-index.xml`   ← references each chunk
 *   - `dist/sitemap-0.xml`       ← first 2K URLs
 *   - `dist/sitemap-1.xml`       ← next 2K URLs
 *   - ... etc.
 *
 * Why 2K-URL chunks: Google accepts up to 50K URLs per sitemap file but
 * smaller chunks make Search Console monitoring + re-submission painless.
 * At 15K+ names this produces 8 chunks; a 100-name test batch produces
 * 1 chunk + the index.
 *
 * The script walks `dist/names/<slug>/index.html` and emits a `<url>`
 * entry per directory found. No database access needed — by the time we
 * run, Astro has already materialised every URL on disk.
 */

import { readdirSync, statSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SITE = 'https://www.namore.app';
const DIST = 'dist';
const NAMES_DIR = join(DIST, 'names');
const CHUNK_SIZE = 2000;
const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// --- Priority weighting -----------------------------------------------------
// Google discovered thousands of URLs but crawls almost none ("Discovered –
// currently not indexed"). Priority is a hint, not a command, but it helps a
// rationed crawl budget focus on the pages worth indexing. We load a curated
// list of the most globally popular names and give them (and the hub pages)
// high priority; the long tail gets low priority. We also emit a focused
// sitemap-top.xml so the signal isn't drowned in the full firehose.
function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
let topSlugs = new Set();
try {
  const topNames = JSON.parse(readFileSync('src/data/top-names.json', 'utf8'));
  topSlugs = new Set(topNames.map(slugify));
  console.log(`[sitemap] loaded ${topSlugs.size} top-name slugs for prioritisation`);
} catch (e) {
  console.warn(`[sitemap] no top-names.json (${e.message}) — using flat priority`);
}
function isHub(slug) {
  return slug === '' || slug === 'girls' || slug === 'boys' || slug === 'popular'
    || slug.startsWith('starting-with/') || slug.startsWith('origin/');
}
function priorityFor(slug) {
  if (isHub(slug) || topSlugs.has(slug)) return '0.9';
  return '0.4';
}
function changefreqFor(slug) {
  return (isHub(slug) || topSlugs.has(slug)) ? 'weekly' : 'monthly';
}

if (!existsSync(NAMES_DIR)) {
  console.error(`[sitemap] ${NAMES_DIR} does not exist — did the build run?`);
  process.exit(1);
}

// Recursively find every page under dist/names/. A "page" is any directory
// containing an index.html (Astro directory-format output). This covers the
// per-name pages AND the hub pages (the /names index, /names/girls,
// /names/boys, /names/starting-with/<letter>, /names/origin/<slug>). Returns
// URL paths relative to /names — '' is the /names index page itself.
function findPagePaths(dir) {
  const out = [];
  if (existsSync(join(dir, 'index.html'))) {
    out.push(relative(NAMES_DIR, dir).split(sep).join('/')); // '' for NAMES_DIR
  }
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...findPagePaths(full));
  }
  return out;
}

const slugs = findPagePaths(NAMES_DIR).sort(); // deterministic ordering

console.log(`[sitemap] found ${slugs.length} pages under ${NAMES_DIR}`);

if (slugs.length === 0) {
  console.warn('[sitemap] no pages to index — skipping sitemap generation');
  process.exit(0);
}

// Split into chunks of CHUNK_SIZE URLs each.
const chunks = [];
for (let i = 0; i < slugs.length; i += CHUNK_SIZE) {
  chunks.push(slugs.slice(i, i + CHUNK_SIZE));
}

// Write per-chunk sitemap-N.xml files.
chunks.forEach((chunk, idx) => {
  const urls = chunk
    .map(
      (slug) => `  <url>
    <loc>${SITE}/names${slug ? '/' + slug : ''}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreqFor(slug)}</changefreq>
    <priority>${priorityFor(slug)}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  const file = join(DIST, `sitemap-${idx}.xml`);
  writeFileSync(file, xml, 'utf8');
  console.log(`[sitemap] wrote ${file} (${chunk.length} URLs)`);
});

// Focused top-names sitemap — only the curated popular names that actually
// built to disk. Submit this separately in Search Console; a short, curated
// sitemap gets crawled far more aggressively than the full-catalog firehose.
const topOnDisk = slugs.filter((slug) => topSlugs.has(slug));
let extraIndexEntry = '';
if (topOnDisk.length > 0) {
  const topUrls = topOnDisk
    .map(
      (slug) => `  <url>
    <loc>${SITE}/names/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
    )
    .join('\n');
  const topXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${topUrls}
</urlset>
`;
  writeFileSync(join(DIST, 'sitemap-top.xml'), topXml, 'utf8');
  console.log(`[sitemap] wrote ${join(DIST, 'sitemap-top.xml')} (${topOnDisk.length} top URLs)`);
  extraIndexEntry = `  <sitemap>
    <loc>${SITE}/sitemap-top.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
`;
}

// Write the sitemap index pointing at every chunk.
const indexEntries = chunks
  .map(
    (_, idx) => `  <sitemap>
    <loc>${SITE}/sitemap-${idx}.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`,
  )
  .join('\n');

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${extraIndexEntry}${indexEntries}
</sitemapindex>
`;

writeFileSync(join(DIST, 'sitemap-index.xml'), indexXml, 'utf8');
console.log(`[sitemap] wrote ${join(DIST, 'sitemap-index.xml')} (${chunks.length} chunks)`);
console.log(`[sitemap] done — ${slugs.length} URLs across ${chunks.length} chunk(s)`);
