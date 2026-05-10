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
npm run dev
```

Open:

- `http://localhost:4321/`
- `http://localhost:4321/contact`
- `http://localhost:4321/admin/`
- `http://localhost:4321/admin/#/collections/site_settings/entries/site`
- `http://localhost:4321/admin/#/collections/page_content/entries/pages`

`npm run dev` starts both Astro and the Decap local editing proxy. If the admin stays on "Loading configuration..." locally, confirm the proxy is running on port `8081` or run `npm run cms:proxy` in a second terminal.

## Production Verification

After pushing to `main`, confirm Vercel deploys successfully:

```sh
npx --yes vercel@latest ls stellar-images-site --scope <VERCEL_SCOPE>
```

Then check:

```sh
npm run verify:prod
```

To verify the live intake email path, run:

```sh
npm run verify:prod:intake
```

This sends a real production test inquiry email to the currently configured `INTAKE_TO_EMAIL` recipient.

After owner integration swap, also run:

```sh
npm run verify:prod -- --calendly-url "https://calendly.com/OWNER/EVENT"
npm run verify:prod:intake -- --calendly-url "https://calendly.com/OWNER/EVENT"
```

Manual checks still required for full handoff:

- submit the live order form and confirm the owner inbox receives it
- book one dummy Calendly slot from the live contact page
- confirm the booking appears on the owner's Google Calendar
- cancel the dummy booking and confirm cancellation propagation

## CMS Safety

- If adding fields to a JSON file, add matching Decap fields in `public/admin/config.yml`.
- If removing fields, verify every page/component still builds without that field.
- Use clear CMS labels and hints for non-technical editors.
- Keep `noIndex` enabled until final launch.
