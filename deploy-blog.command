#!/bin/zsh
cd "$(dirname "$0")"
echo "== Vercel login (confirm in the browser) =="
npx --yes vercel@latest whoami >/dev/null 2>&1 || npx --yes vercel@latest login
echo "== Deploying namore-landing-astro (blog + names) to production =="
npx --yes vercel@latest --prod --yes 2>&1 | tee deploy-blog.log
echo "== done =="
