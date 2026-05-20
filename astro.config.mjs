// @ts-check
import { defineConfig } from 'astro/config';

// Programmatic SEO build for namore.app — 11K per-name pages under /names/[slug].
//
// Architecture lock 2026-05-20: data comes from the Supabase `names` table
// at build time via the service role key (server-side only). The CSV at
// Documents/Projects/Namore/baby-names-production.csv is backup-only and
// must NOT feed this build. See [[bugs#Architectural locks (2026-05-20)]].
//
// For local dev without Supabase access, set USE_MOCK_DATA=1 to read from
// src/fixtures/names-mock.json. The CI build on Vercel uses the real
// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars.
//
// Sitemap generation is handled by a custom postbuild script
// (`scripts/generate-sitemap.mjs`) rather than @astrojs/sitemap, because
// that integration crashes on `.reduce()` of undefined in its
// astro:build:done hook against Astro 4.16+ (known incompat at time of
// writing 2026-05-20, no clean version-pin available). The custom script
// walks `dist/names/` after the build and emits a sitemap-index plus
// chunked sitemaps capped at 2K URLs each — same output shape as
// @astrojs/sitemap would produce, fewer moving parts.
export default defineConfig({
  site: 'https://www.namore.app',
  // Per-name pages live at /names/<slug>. The existing namore-landing project
  // continues to serve /, /privacy.html, etc. Vercel routes /names/* to this
  // project.
  base: '/',
  trailingSlash: 'never',
  build: {
    // Directory format — output is `dist/names/olivia/index.html`, URL is
    // `/names/olivia` (no extension, no trailing slash). Cleaner SEO and
    // matches what the internal links in [slug].astro already emit.
    format: 'directory',
  },
});
