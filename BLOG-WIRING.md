# Blog wiring — required before these pages are reachable

Two article pages were added to `namore-landing-astro`. Astro will build them, but
**nothing routes `/blog/*` to that project and nothing puts them in a sitemap.**
Three edits are needed. None are optional — without them the pages 404 and stay invisible.

---

## 1. `namore-landing/vercel.json` — route /blog to the Astro project

`/names/:slug*` is rewritten to the Astro deployment; `/blog` is not. Add two rewrites
**above** the existing `/names` line, and one header block.

```diff
   "rewrites": [
     { "source": "/join/:code", "destination": "/join.html" },
     { "source": "/auth/callback", "destination": "/auth-callback.html" },
     { "source": "/privacy", "destination": "/privacy.html" },
     { "source": "/terms", "destination": "/terms.html" },
     { "source": "/impressum", "destination": "/impressum.html" },
+    { "source": "/blog/:slug*", "destination": "https://namore-landing-astro.vercel.app/blog/:slug*" },
+    { "source": "/de/blog/:slug*", "destination": "https://namore-landing-astro.vercel.app/de/blog/:slug*" },
     { "source": "/names/:slug*", "destination": "https://namore-landing-astro.vercel.app/names/:slug*" },
```

```diff
   "headers": [
+    {
+      "source": "/blog/:slug*",
+      "headers": [{ "key": "X-Robots-Tag", "value": "all" }]
+    },
+    {
+      "source": "/de/blog/:slug*",
+      "headers": [{ "key": "X-Robots-Tag", "value": "all" }]
+    },
```

⚠️ `/de/` is currently served by `namore-landing` (static `de/index.html`). The
`/de/blog/:slug*` rewrite is more specific than any existing `/de` route, so it wins —
but verify `https://www.namore.app/de/` still serves the German landing page after deploy.

---

## 2. `namore-landing-astro/scripts/generate-sitemap.mjs` — include /blog

The script hard-codes `NAMES_DIR = join(DIST, 'names')` and walks only that. Blog pages
build to `dist/blog/` and `dist/de/blog/` and would be in **no sitemap at all**.

Minimal change — after the existing chunk/index writing, emit a `sitemap-blog.xml` and add
it to the index alongside `sitemap-top.xml`:

```js
// --- Blog pages -------------------------------------------------------------
// Walked separately from dist/names because findPagePaths() is rooted at NAMES_DIR.
const BLOG_DIRS = [join(DIST, 'blog'), join(DIST, 'de', 'blog')];
const blogUrls = [];
for (const dir of BLOG_DIRS) {
  if (!existsSync(dir)) continue;
  for (const entry of readdirSync(dir)) {
    if (existsSync(join(dir, entry, 'index.html'))) {
      blogUrls.push(`${SITE}/${relative(DIST, join(dir, entry)).split(sep).join('/')}`);
    }
  }
}
let blogIndexEntry = '';
if (blogUrls.length) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogUrls.map((u) => `  <url>
    <loc>${u}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>
`;
  writeFileSync(join(DIST, 'sitemap-blog.xml'), xml, 'utf8');
  blogIndexEntry = `  <sitemap>
    <loc>${SITE}/sitemap-blog.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
`;
  console.log(`[sitemap] wrote sitemap-blog.xml (${blogUrls.length} URLs)`);
}
```

Then include `blogIndexEntry` in the sitemap index template next to `extraIndexEntry`:

```diff
-${extraIndexEntry}${indexEntries}
+${extraIndexEntry}${blogIndexEntry}${indexEntries}
```

Also add `sitemap-blog.xml` to the `vercel.json` rewrites so it is served from the root
domain (the existing `sitemap-:n.xml` pattern only matches numeric names):

```diff
+    { "source": "/sitemap-blog.xml", "destination": "https://namore-landing-astro.vercel.app/sitemap-blog.xml" },
     { "source": "/sitemap-index.xml", "destination": "https://namore-landing-astro.vercel.app/sitemap-index.xml" },
```

---

## 3. Images

`namore-landing/blog-assets/` now holds the six editorial screens. The two used by the
articles were converted to WebP at 900 px wide (**3.5 MB → ~109 KB each**):

- `02-private-by-design.webp`
- `04-match-moment.webp`

The original 3.5 MB PNGs are still in that folder and are **not referenced** — delete them
or leave them; they will not be requested. Do not point the articles at the PNGs.

---

## 4. Before publishing

- [ ] **Humanizer pass on both articles** — required by the standing rule in `AGENTS.md`
      for all external-facing copy. Not yet done.
- [ ] Verify the German copy reads natively — it was written directly in German, not
      translated, but a native read-through is worth it before it becomes the page that
      defines the category in DE.
- [ ] `npm run build` locally and confirm `dist/blog/` and `dist/de/blog/` exist.
- [ ] After deploy: submit `sitemap-blog.xml` in Search Console.
- [ ] Add internal links from `/names` hub pages to the blog article — currently the
      articles link out to `/names` but nothing links in, so they have no internal PageRank.

## 5. Claims to re-check if anything changes

- **Kinder's matching mechanics are unverified.** The DE article credits it as the German
  swipe pioneer and does not claim it lacks couples matching. Do not sharpen that without
  installing it.
- **BabyName shipped swipe-matching in Dec 2014** (21,115 ratings). Both articles credit
  this explicitly. Per `channel-research-2026-08-13.md` the "we give you a decision, not a
  list" line is false in the English market — do not reintroduce it in the EN piece.
- **Catalog is 15,182 names.** The iOS listing still says "11,000+" and Play says
  "15,000+" — those should be reconciled to match.
