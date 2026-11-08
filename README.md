# VietCaPhe website

Site for VietCaPhe wholesale: a note to past customers, the green coffee offer for roasters, and the blog.

Built with Astro, React, Tailwind CSS 4, MDX and Motion. Every page is pre-rendered to static HTML, with React components hydrated where they need interaction.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
```

## Deploy to GitHub Pages

Every push to `main` builds and deploys through `.github/workflows/deploy.yml` (repo **Settings → Pages → Source** must be **GitHub Actions**). The custom domain is `www.vietcaphe.com.au`.

## Editing

- Contact email and the form backend are in `src/config.ts`. Submissions go to a Google Apps Script web app (`apps-script/Code.gs`) that emails them and logs them to a Google Sheet. After editing the script, use **Deploy → Manage deployments → Edit → New version** so the same URL serves the new code.
- Homepage sections are in `src/sections/`.
- Blog posts are MDX files in `src/content/blog/`. The URL is the file name. See `docs/blog/PLAYBOOK.md` for how posts are planned, written and optimised, and `docs/blog/IDEAS.md` for the backlog.
- Blog graphics live in `src/components/blog/`. Social share images for posts are generated at build time (`src/pages/og/`).
- SEO files are generated automatically: `sitemap-index.xml`, `rss.xml` and `llms.txt`. `public/robots.txt` allows search and AI crawlers.
