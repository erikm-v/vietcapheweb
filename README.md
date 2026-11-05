# VietCaPhe website

Single-page site for VietCaPhe wholesale: a note to past customers and the green coffee offer for roasters.

Built with Vite, React, Tailwind CSS 4 and Motion.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Create a GitHub repo and push this folder to the `main` branch.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` builds and deploys through `.github/workflows/deploy.yml`.

To serve it on `www.vietcaphe.com.au`, add the domain under **Settings → Pages → Custom domain** and point a `CNAME` DNS record for `www` at `<your-github-username>.github.io`.

## Editing

- Contact email and the optional form backend are in `src/config.ts`. With `formEndpoint` empty, the contact form opens the visitor's email app with the message filled in. Paste a Formspree (or similar) endpoint there to receive submissions directly.
- Each section of the page is a file in `src/sections/`.
