# Stellar Images Site

Astro site for a real estate photography business. The project is structured around:

- `Astro` for the frontend
- `Vercel` for hosting
- `Decap CMS` for owner-editable content
- `Calendly` for scheduling
- `Resend` for email-only intake delivery

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`
- `npm run verify`
- `npm run verify:prod`
- `npm run verify:prod:intake` sends a real production test inquiry email
- `npx vercel dev` for local testing that includes Vercel `/api` functions

## Project Structure

```text
/
├── api/
├── public/
│   ├── admin/config.yml
│   └── images/
├── scripts/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── BASE44_REFERENCE.md
├── BUILD_BRIEF.md
├── EDITOR_GUIDE.md
├── HANDOFF.md
├── LAUNCH_CHECKLIST.md
├── MAINTAINER_CHECKLIST.md
├── SECURITY.md
└── OWNER_INTEGRATION_HANDOFF.md
```

## Content Editing

The site content is designed to be edited through Decap CMS at `/admin`.

For local Astro dev, open `http://127.0.0.1:4321/admin/`. Production uses the same `/admin/` path.

Current Decap status:

- the admin UI and collection config are live
- GitHub OAuth production login is configured through Vercel Functions
- `local_backend: true` remains enabled for local development
- the production Git backend points at `stellar-images/stellar-images-site`
- Vercel is connected to the GitHub repo for automatic deploys from `main`
- a CMS publish test was completed and verified against GitHub/Vercel
- owner/editor GitHub access is configured outside this public README
- Vercel team access depends on the active Vercel plan and should be handled in the Vercel dashboard or private handoff notes

Important:

- OAuth secrets must live in Vercel Environment Variables, not in the public Decap config
- owner/editor accounts need GitHub write access before they can publish CMS edits
- page copy, service content, portfolio content, and form labels are CMS-managed files under `src/content`

## Current Gaps

- final owner-controlled Calendly, Resend sender domain, and inquiry inbox must be confirmed before public launch
- placeholder content and placeholder artwork need to be replaced
- the launch SEO flag should stay set to `noindex` until final launch

## Current Integration Status

Production has been end-to-end tested with temporary integration values.

Verified on May 8, 2026:

- live form submission
- Resend delivery
- Calendly booking creation
- Google Calendar sync
- dummy booking cancellation

Do not document live account emails, API keys, OAuth client secrets, or temporary maintainer account details in this public repo. Use [OWNER_INTEGRATION_HANDOFF.md](OWNER_INTEGRATION_HANDOFF.md) for the safe swap and verification sequence.

## Repo Visibility

The repository is public so Vercel Hobby can auto-deploy from the `stellar-images` organization repo. Keep secrets out of the repo:

- real `.env` files are ignored
- `.vercel/` is ignored
- `.env.example` contains placeholder variable names only
- production secrets belong in Vercel Environment Variables
- operational account details belong in private handoff notes, not committed docs

If the repo is made private again while it remains under the organization, Vercel auto-deploys will require Vercel Pro or a move to a personal GitHub repo.

## Environment Variables

Copy the variable names from `.env.example` into Vercel project settings.

Email intake:

- `RESEND_API_KEY`
- `INTAKE_TO_EMAIL`
- `INTAKE_FROM_EMAIL`

Decap GitHub OAuth:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `OAUTH_STATE_SECRET`
- `OAUTH_REDIRECT_URI`
- `GITHUB_OAUTH_SCOPE`

Do not expose any secret with an `ASTRO_PUBLIC_` prefix.

## Content Sources

- `src/content/site.json`
- `src/content/pages.json`
- `src/content/services.json`
- `src/content/portfolio.json`
- `src/content/testimonials.json`
- `src/content/credentials.json`
- `src/content/form-config.json`

These files are intended to be managed by Decap rather than edited by hand in normal use.

## Notes

- The design direction is based on the Base44 recording documented in [BASE44_REFERENCE.md](BASE44_REFERENCE.md).
- The implementation plan is documented in [BUILD_BRIEF.md](BUILD_BRIEF.md).
- The Decap production login setup is documented in [DECAP_AUTH_PLAN.md](DECAP_AUTH_PLAN.md).
- The owner editing flow is documented in [EDITOR_GUIDE.md](EDITOR_GUIDE.md).
- The final integration handoff is documented in [OWNER_INTEGRATION_HANDOFF.md](OWNER_INTEGRATION_HANDOFF.md).
- Launch readiness is documented in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).
- Maintainer verification is documented in [MAINTAINER_CHECKLIST.md](MAINTAINER_CHECKLIST.md).
- Security expectations are documented in [SECURITY.md](SECURITY.md).
