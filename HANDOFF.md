# Handoff — Phase 0 scaffold ready for local verification

> Written 2026-05-20. The Astro project scaffold is complete and the code is reviewable; the sandbox couldn't complete `npm install` because of a Node-binary segfault during esbuild's postinstall verification step (sandbox quirk, not a code issue). To validate the scaffold + run a first mock build, run the steps below on your laptop.

## What's in this folder

- `package.json` — Astro 4 + @astrojs/sitemap + @supabase/supabase-js. Scripts: `dev`, `build`, `build:mock`, `build:test`, `check`, `preview`.
- `astro.config.mjs` — site URL, sitemap chunked at 2K URLs, `/names/*` filter.
- `tsconfig.json` — strict Astro config + `@/*` path alias.
- `.env.example` — env var template (USE_MOCK_DATA, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BUILD_LIMIT).
- `src/lib/types.ts` — `NameRow` interface mirroring the Supabase `names` table (i18n columns are optional and not consumed in v1).
- `src/lib/names.ts` — data layer. Reads from Supabase via service role key when env vars are set, falls back to mock fixture otherwise. Includes paginated fetch (1000 rows per range), slug collision detection, and `findRelatedNames()` for internal linking.
- `src/fixtures/names-mock.json` — 8 diverse mock rows (rising / popular / fading / reviving / classic_steady / stable trend labels, M/F genders, varied origins, full popularity_history arrays). English-only.
- `src/styles/global.css` — brand tokens copied from `namore-landing/index.html` `:root` block. Same palette, same fonts, same radii.
- `src/layouts/BaseLayout.astro` — shared `<head>` (title, OG, Twitter, JSON-LD slot, font preconnect) + top nav + footer.
- `src/components/PopularityChart.astro` — inline SVG sparkline that renders `popularity_history` arrays. Null-tolerant.
- `src/components/NameCardHero.astro` — the product card visual, faithfully mirroring `src/components/NameCard.tsx` from the app (trend pill + meta + flags + big serif name + mono pronunciation + meaning + popularity sparkline + nicknames + vibe pills).
- `src/pages/names/[slug].astro` — the page template. `getStaticPaths()` reads all names + computes related names. Body renders the card hero + three narrative sections (longevity, trend context, popularity narrative) + the related-names internal-linking block + the install CTA. Per-page JSON-LD as `DefinedTerm` in a `DefinedTermSet`.

## Validate locally (10-minute job)

```bash
cd /Users/julian/Documents/Namore/namore-landing-astro

# Clean any partial install state from the sandbox
rm -rf node_modules package-lock.json dist .astro

# Install (your machine; esbuild's postinstall will succeed here)
npm install

# Optional: typecheck
npm run check

# Build against the 8 mock names → produces 8 static HTML files in dist/
USE_MOCK_DATA=1 npm run build:mock

# Open one of them in a browser
open dist/names/theodora.html
# (or: open dist/names/olivia.html / penelope.html / etc.)
```

What you should see for each: brand nav at top, big serif name, the product card with the trend pill / meta / flags / pronunciation / meaning / popularity sparkline / nicknames / vibe pills, three narrative paragraphs below the card (longevity, cultural moment, popularity-over-time), an internal-linking block to ~5 related names, and the "Decide together" install CTA at the bottom.

## QA checklist for the mock build

- [ ] All 8 mock names produce an HTML file in `dist/names/`.
- [ ] Filename slug is the expected form: `theodora.html`, `olivia.html`, `bartholomew.html`, `zoe.html` (diacritic stripped), `aleksandr.html`, etc.
- [ ] Each page's `<title>` follows the pattern `<Name> — meaning, origin and popularity`.
- [ ] Each page has a canonical `<link>` pointing at `https://www.namore.app/names/<slug>`.
- [ ] OG image points at `https://www.namore.app/og-card.png` (the brand card, not the bare app icon).
- [ ] JSON-LD `<script type="application/ld+json">` is present and validates as a `DefinedTerm`.
- [ ] The popularity sparkline visually matches the data shape (rising for Theodora/Olivia/Theo/Cassia/Penelope, declining for Bartholomew/Aleksandr, flat for Zoë).
- [ ] Related names appear at the bottom with origin + meaning_short under each.
- [ ] Internal links between related names work — clicking "Olivia" from the Theodora page should load `dist/names/olivia.html`.
- [ ] Page renders cleanly on a 375px-wide mobile viewport (responsive).

## Go to Phase 2 (test batch on Vercel)

Once the local mock build looks right:

1. **Push to git.** Initialize this folder as its own repo (or as a subdirectory of `namore-landing`, your call).
2. **Create a Vercel project** pointed at this folder. Vercel auto-detects Astro and runs `npm run build`.
3. **Set env vars** in Vercel project settings:
   - `SUPABASE_URL` = same value as the app's `EXPO_PUBLIC_SUPABASE_URL`.
   - `SUPABASE_SERVICE_ROLE_KEY` = the `service_role` secret from Supabase → Settings → API. NEVER commit this to git. Server-side only — Vercel's build env never reaches a browser.
   - `BUILD_LIMIT` = `100` for the first deploy (test batch). Remove or raise once the 100 pages look right.
4. **Deploy.** Vercel runs the build against live Supabase, generates 100 real name pages, deploys to a preview URL.
5. **QA the test batch.** Open ~10 pages by hand. Confirm: real names render correctly, popularity charts look right against the actual SSA data, related-names internal links work, no rendering anomalies on long names (Bartholomew etc.) or short names (Theo etc.).
6. **Flip to full build.** Remove `BUILD_LIMIT` from Vercel env vars. Trigger a redeploy. ~11K static pages generated. Submit `sitemap-index.xml` to Google Search Console + Bing Webmaster.

## Auto-sync from Supabase

Two complementary triggers:

- **Weekly Vercel Cron.** Configure a Vercel deploy hook that fires every Sunday — picks up Supabase changes that have accumulated without explicit triggers.
- **Supabase webhook on `names` changes.** Supabase Database Webhooks → INSERT/UPDATE/DELETE on `public.names` → call the Vercel deploy hook URL. Single-row edits go live within minutes.

## Architectural locks honoured

- **Supabase as single source of truth** — build reads from Supabase, never from the CSV at `Documents/Projects/Namore/baby-names-production.csv`.
- **No Claude Haiku** for any enrichment — v1 ships template-only from existing structured columns. LLM enrichment is a v2 decision and Haiku is banned regardless.
- **English-only v1** — i18n columns are optional in the type and ignored by the build. Locale variants return as a separate decision if/when translation data quality improves.

See [[bugs#Architectural locks (2026-05-20)]] and [[programmatic-seo-runbook]] for the full record.
