/**
 * FR_LIVE — the switch for the whole French cluster (/fr/blog/*).
 *
 * French is hidden in the app until the French name data is translated and
 * checked (Julian, 2026-09-27); these pages must not be indexed before the
 * French build and its store listing ship. While false:
 *   • every /fr/ page carries <meta name="robots" content="noindex, nofollow">
 *   • no page outside /fr/ links to it (footer, hreflang, ClusterFoot)
 *   • scripts/generate-sitemap.mjs does not walk dist/fr/blog
 *   • namore-landing's vercel.json has no /fr/blog rewrite
 *
 * GO-LIVE CHECKLIST (all of it, in one deploy):
 *   1. Supabase: meaning_fr / meaning_short_fr / origin_fr / longevity_read_fr /
 *      trend_context_fr populated for all 15,182 names (count, don't sample) —
 *      'name-depth', 'content-languages' and NAMORE_FR.names depend on it.
 *   2. App: FRENCH_ENABLED = true shipped, French store listings live.
 *   3. Set FR_LIVE = true here.
 *   4. generate-sitemap.mjs: add join(DIST, 'fr', 'blog') to BLOG_DIRS.
 *   5. BaseLayout footer + hub hreflang: add the French hub.
 *   6. namore-landing: /fr/ robots → index, vercel.json rewrite /fr/blog/:slug*,
 *      EN/DE/ES language menus + hreflang gain FR, llms.txt gains the French pages.
 *   7. Re-read every competitor listing in apps-fr.ts if VERIFIED is older than
 *      four weeks.
 */
// Switched on 2026-09-27 ~16:00 CEST, Julian: "Now" (French app update released to production the same hour).
export const FR_LIVE = true;
