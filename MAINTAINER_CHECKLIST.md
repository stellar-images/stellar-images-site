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
npm run verify
```

This runs Astro checks, TypeScript checks, a production build, and `scripts/verify-admin-content.mjs`.

The admin/content verifier checks:

- every `src/content/*.json` file is represented in `public/admin/config.yml`
- JSON keys do not drift away from the Decap field model
- required booking workflow fields stay present and required
- service options in the booking form match service names
- referenced images exist under `public/images`
- built pages render the CMS-managed copy, form labels, image paths, alt text, portfolio IDs, service anchors, and admin page

Optional local browser check:

```sh
npm run dev -- --host 127.0.0.1 --port 4321
```

Open:

- `http://127.0.0.1:4321/`
- `http://127.0.0.1:4321/contact`
- `http://127.0.0.1:4321/admin/`
- `http://127.0.0.1:4321/admin/#/collections/site_settings/entries/site`
- `http://127.0.0.1:4321/admin/#/collections/page_content/entries/pages`

Astro dev and production both serve the CMS at `/admin/`.

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
