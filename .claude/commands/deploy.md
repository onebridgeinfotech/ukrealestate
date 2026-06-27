# /deploy — Build and Deploy to Hostinger

Builds the production bundle and pushes to GitHub. Hostinger auto-deploys from the `main` branch.

## Steps

1. Run `npm run build` and confirm it passes with zero errors
2. Stage all changed files (source + dist)
3. Create a descriptive commit message summarising what changed
4. Push to `origin main`

## Commands

```bash
npm run build
git add src/ dist/ public/ *.md *.json *.html *.ts *.tsx
git status   # verify what's being committed — never commit .env files
git commit -m "feat/fix/chore: <description>"
git push origin main
```

## Commit Message Format

```
feat: add sticky mobile CTA on listing detail page
fix: correct homepage search keyword not passing to URL
chore: update mock listings data with unique images
```

## Post-Deploy Checks

After pushing, verify on live site:
- `https://cornflowerblue-capybara-977113.hostingersite.com` loads correctly
- Test the specific feature/fix that was deployed
- Check browser console for errors
- Check on mobile viewport

## Notes

- **Never commit `.env` or `.env.local` files**
- Hostinger is LiteSpeed — `.htaccess` `AddType`/`ForceType` directives are ignored, use `RewriteRule [T=]` flags for MIME types
- The `dist/.htaccess` file handles SPA routing — all paths rewrite to `index.html`
- Build output: `dist/assets/index-*.js` and `dist/assets/index-*.css` (hashed filenames change on each build)
