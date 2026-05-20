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
 * Once we have 11K names this produces 6 chunks; for the 100-name test
 * batch it produces 1 chunk + the index.
 *
 * The script walks `dist/names/<slug>/index.html` and emits a `<url>`
 * entry per directory found. No database access needed — by the time we
 * run, Astro has already materialised every URL on disk.
 */

import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://www.namore.app';
const DIST = 'dist';
const NAMES_DIR = join(DIST, 'names');
const CHUNK_SIZE = 2000;
const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

if (!existsSync(NAMES_DIR)) {
  console.error(`[sitemap] ${NAMES_DIR} does not exist — did the build run?`);
  process.exit(1);
}

// Find every slug under dist/names/. Each entry is a directory containing
// an index.html (matches Astro's directory-format build output).
const slugs = readdirSync(NAMES_DIR)
  .filter((entry) => {
    const full = join(NAMES_DIR, entry);
    return (
      statSync(full).isDirectory() &&
      existsSync(join(full, 'index.html'))
    );
  })
  .sort(); // alphabetical for determinism — same input always produces same output

console.log(`[sitemap] found ${slugs.length} name pages under ${NAMES_DIR}`);

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
    <loc>${SITE}/names/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
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
${indexEntries}
</sitemapindex>
`;

writeFileSync(join(DIST, 'sitemap-index.xml'), indexXml, 'utf8');
console.log(`[sitemap] wrote ${join(DIST, 'sitemap-index.xml')} (${chunks.length} chunks)`);
console.log(`[sitemap] done — ${slugs.length} URLs across ${chunks.length} chunk(s)`);
