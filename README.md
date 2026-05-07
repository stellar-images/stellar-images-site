# Stellar Images Site

Astro site for a real estate photography business. The project is structured around:

- `Astro` for the frontend
- `Vercel` for hosting
- `Decap CMS` for owner-editable content
- `Calendly` for scheduling once the real event URL is available
- email-only intake delivery once production email env vars are added

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`
- `npx vercel dev` for local testing that includes Vercel `/api` functions

## Project Structure

```text
/
├── public/
│   ├── admin/
│   └── images/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── BASE44_REFERENCE.md
├── BUILD_BRIEF.md
├── EDITOR_GUIDE.md
└── HANDOFF.md
```

## Content Editing

The site content is designed to be edited through Decap CMS at `/admin`.

For local Astro dev, open `http://127.0.0.1:4321/admin/index.html`. Production serves the shorter `/admin/` path correctly through Vercel.

Current Decap status:

- the admin UI and collection config are live
- GitHub OAuth production login is configured through Vercel Functions
- `local_backend: true` remains enabled for local development
- the production Git backend points at `stellar-images/stellar-images-site`
- Vercel is connected to the GitHub repo for automatic deploys from `main`
- a CMS publish test was completed and verified against GitHub/Vercel

Important:

- OAuth secrets must live in Vercel Environment Variables, not in the public Decap config
- owner/editor accounts need GitHub write access before they can publish CMS edits
- page copy, service content, portfolio content, and form labels are CMS-managed files under `src/content`

## Current Gaps

- the intake form submission needs production email env vars before it can send real messages
- the real Calendly URL still needs to be added
- placeholder content and placeholder artwork need to be replaced
- the launch SEO flag should stay set to `noindex` until final launch

## Repo Visibility

The repository is public so Vercel Hobby can auto-deploy from the `stellar-images` organization repo. Keep secrets out of the repo:

- real `.env` files are ignored
- `.vercel/` is ignored
- `.env.example` contains placeholder variable names only
- production secrets belong in Vercel Environment Variables

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

- The design direction is based on the Base44 recording documented in [BASE44_REFERENCE.md](/Users/lylejens/Documents/Codex/2026-05-06/files-mentioned-by-the-user-3100/BASE44_REFERENCE.md).
- The implementation plan is documented in [BUILD_BRIEF.md](/Users/lylejens/Documents/Codex/2026-05-06/files-mentioned-by-the-user-3100/BUILD_BRIEF.md).
- The Decap production login setup is documented in [DECAP_AUTH_PLAN.md](/Users/lylejens/Documents/Codex/2026-05-06/files-mentioned-by-the-user-3100/DECAP_AUTH_PLAN.md).
- The owner editing flow is documented in [EDITOR_GUIDE.md](/Users/lylejens/Documents/Codex/2026-05-06/files-mentioned-by-the-user-3100/EDITOR_GUIDE.md).
