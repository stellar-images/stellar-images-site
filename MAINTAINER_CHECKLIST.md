# Maintainer Checklist

Use this when making code or content-model changes.

## Before Editing

- Run `git status --short --branch`.
- Confirm no unrelated user changes are being overwritten.
- Keep secrets out of committed files.
- Treat `src/content/*.json` and `public/admin/config.yml` as a matched pair when changing editable content.

## Local Verification

Run:

```sh
npm run typecheck
npm run build
node -e "import('yaml').then(({default:YAML})=>{const fs=require('fs'); YAML.parse(fs.readFileSync('public/admin/config.yml','utf8')); console.log('yaml ok')})"
node -e "for (const file of ['src/content/site.json','src/content/pages.json','src/content/services.json','src/content/portfolio.json','src/content/testimonials.json','src/content/credentials.json','src/content/form-config.json']) { JSON.parse(require('fs').readFileSync(file,'utf8')); } console.log('json ok')"
```

Optional local browser check:

```sh
npm run dev -- --host 127.0.0.1 --port 4321
```

Open:

- `http://127.0.0.1:4321/`
- `http://127.0.0.1:4321/contact`
- `http://127.0.0.1:4321/admin/index.html`

Astro dev serves the CMS at `/admin/index.html`; production serves `/admin/`.

## Production Verification

After pushing to `main`, confirm Vercel deploys successfully:

```sh
npx --yes vercel@latest ls stellar-images-site --scope lylej312s-projects
```

Then check:

```sh
curl -I https://stellar-images-site.vercel.app/admin/
curl -s -D - -o /dev/null https://stellar-images-site.vercel.app/api/auth
curl -fsSL https://stellar-images-site.vercel.app/robots.txt
curl -fsSL https://stellar-images-site.vercel.app/sitemap.xml
```

## CMS Safety

- If adding fields to a JSON file, add matching Decap fields in `public/admin/config.yml`.
- If removing fields, verify every page/component still builds without that field.
- Use clear CMS labels and hints for non-technical editors.
- Keep `noIndex` enabled until final launch.
