Vercel deployment guide

This repository contains a monorepo-style project with:
- client: a Vite + React app inside `client/` (Vite `root` configured in `vite.config.ts`)
- server: an Express server in `server/`

Goal: deploy the frontend only to Vercel (no server changes). Vercel will build the client using the project's `vite.config.ts` which outputs static files to `dist/public`.

Steps (PowerShell)

1. Push this repo to GitHub (or another Git provider) and make sure today's changes are committed.

2. On Vercel:
   - Create a new project and import the GitHub repository.
   - Set the framework preset to "Other" (Vite) if prompted.
   - In Build Settings (if asked):
     - Build Command: npm run build-client
     - Output Directory: dist/public

3. Locally (to test the production build):

```powershell
# install dependencies
npm install

# build the client
npx vite build

# serve the static output locally with a simple server (optional)
# Install serve once globally if you don't have it: npm install -g serve
serve -s dist/public -l 5000
# or use Python's http.server in the directory:
# Set-Location dist/public; python -m http.server 5000
```

Notes
- The `.vercelignore` file excludes `server/` and other non-client files so Vercel only uploads the client build artifacts.
- Environmental variables: this deployment is static. If your client needs runtime env vars, use Vercel Environment Variables or embed them at build time.
- If later you want to deploy the server, use Railway/Render/Cloud Run and set it to run `npm run build` then `npm start`.

If you want I can also prepare a small GitHub Actions workflow to auto-deploy to Vercel or create a Vercel project config to use the Vercel CLI for deployments.
