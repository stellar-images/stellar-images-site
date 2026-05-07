# Stellar Images Site

Astro site scaffold for a real estate photography business. The project is structured around:

- `Astro` for the frontend
- `Vercel` for hosting
- `Decap CMS` for owner-editable content
- `Calendly` for scheduling
- email-only intake handling to be wired with the final production service

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
└── HANDOFF.md
```

## Content Editing

The site content is designed to be edited through Decap CMS at `/admin`.

Current Decap status:

- the admin UI and collection config are scaffolded
- `local_backend: true` is enabled for local development
- the production Git backend points at `stellar-images/stellar-images-site`
- Vercel is connected to the GitHub repo for automatic deploys from `main`

Important:

- Decap on Vercel still needs production authentication wired to the Git backend
- OAuth secrets must live in Vercel Environment Variables or another server-side auth provider, not in the public Decap config
- the current scaffold does not pretend that auth is finished
- the site content model is compatible with that next step

## Current Gaps

- the intake form submission needs production email env vars before it can send real messages
- Decap production OAuth env vars still need to be added
- the real Calendly URL still needs to be added
- placeholder content and placeholder artwork need to be replaced

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

## Notes

- The design direction is based on the Base44 recording documented in [BASE44_REFERENCE.md](/Users/lylejens/Documents/Codex/2026-05-06/files-mentioned-by-the-user-3100/BASE44_REFERENCE.md).
- The implementation plan is documented in [BUILD_BRIEF.md](/Users/lylejens/Documents/Codex/2026-05-06/files-mentioned-by-the-user-3100/BUILD_BRIEF.md).
- The Decap production login plan is documented in [DECAP_AUTH_PLAN.md](/Users/lylejens/Documents/Codex/2026-05-06/files-mentioned-by-the-user-3100/DECAP_AUTH_PLAN.md).
