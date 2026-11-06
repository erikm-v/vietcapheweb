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

- Contact email and the form backend are in `src/config.ts`. With `formEndpoint` empty, the contact form opens the visitor's email app with the message filled in. Set it to the Google Apps Script web app URL (script in `apps-script/Code.gs`) to have submissions emailed to you and logged in a Google Sheet. After editing the script, use **Deploy → Manage deployments → Edit → New version** so the same URL serves the new code.
- Each section of the page is a file in `src/sections/`.
