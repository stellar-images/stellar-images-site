# Handoff Notes

## What This Repo Is

This repo contains the website source for the photography site. It is set up so the website can be:

- hosted on Vercel
- updated through Decap CMS
- expanded later without changing the overall architecture

Current production URL:

- https://stellar-images-site.vercel.app

Current GitHub repo:

- https://github.com/stellar-images/stellar-images-site

## What The Owner Should Control

- domain registration
- Vercel project access
- Git repository access
- Calendly account
- Google Calendar account
- email inbox that receives inquiries

## How Content Updates Work

Target owner flow:

1. Open `/admin`.
2. Log in.
3. Edit text, pricing, services, portfolio items, images, or form settings.
4. Publish.
5. Let Vercel redeploy the site automatically.

See `EDITOR_GUIDE.md` for the non-technical editing guide.

## Current State

Scaffolded and configured now:

- five core pages
- reusable components
- structured content files
- Decap admin UI
- Decap GitHub OAuth production login
- owner-editable page copy, services, portfolio, testimonials, credentials, site settings, and booking form settings
- placeholder assets

Still needs final production setup:

- real Calendly URL
- remaining Vercel email env vars for intake delivery
- final photos and content
- custom domain
- launch SEO flag turned off after final content is ready

Already configured:

- GitHub repo under `stellar-images`
- Vercel production deployment
- Vercel GitHub integration for automatic deploys from `main`
- Vercel production env vars for Decap GitHub OAuth
- verified CMS login and publish path

## Decap Auth And Maintenance Access

The recommended long-term setup is:

- her account or a shared organization owns the GitHub repo
- you remain a collaborator for maintenance
- Vercel deploys from that repo
- Decap authenticates editors through GitHub
- Decap commits content edits back to the repo

The current OAuth app is configured through Vercel Environment Variables. Do not commit GitHub OAuth secrets, personal access tokens, or long-lived editor tokens.

See `DECAP_AUTH_PLAN.md` for the production auth details.

## Repo Visibility

The GitHub repo is currently public so Vercel Hobby can deploy from the organization repo automatically. Vercel blocks private organization repositories on the Hobby plan.

Security boundary:

- no real `.env` files are committed
- `.vercel/` is ignored
- `.env.example` contains placeholder names only
- OAuth, Resend, and other secrets must stay in Vercel Environment Variables

Making the repo private again is possible in GitHub, but it would also bring back the Vercel Hobby private-organization-repo deploy blocker unless the Vercel project is upgraded to Pro or the repo is moved to a personal account.

## Email Intake Delivery

The booking form posts to `/api/intake`. Production delivery uses Resend through Vercel Environment Variables.

Required variables:

- `RESEND_API_KEY`
- `INTAKE_TO_EMAIL`
- `INTAKE_FROM_EMAIL`

Current production state:

- `INTAKE_TO_EMAIL` is set to `alexandra.v.maass@gmail.com`
- `RESEND_API_KEY` still needs to be added
- `INTAKE_FROM_EMAIL` still needs to be added after choosing a verified sender

The sender address must be allowed by the email delivery account. In production, use a verified domain sender rather than a personal Gmail address.

## Vercel Deployment

The current production deployment is live at:

- https://stellar-images-site.vercel.app

The project currently lives under the Vercel scope `lylej312s-projects`.

Git auto-deploy is connected to:

- `stellar-images/stellar-images-site`
- branch: `main`

Manual production deploys are still possible from this folder if needed:

```sh
npx --yes vercel@latest deploy --prod --yes --archive=tgz
```

## Content Sources

- `src/content/site.json`
- `src/content/pages.json`
- `src/content/services.json`
- `src/content/portfolio.json`
- `src/content/testimonials.json`
- `src/content/credentials.json`
- `src/content/form-config.json`

These files are intended to be managed by Decap rather than edited by hand in normal use.

## Launch SEO Flag

The site currently sets `noindex, nofollow` through `src/content/site.json` because it still contains placeholder content. In the CMS, this is:

- `Site Settings -> SEO -> Hide From Search Engines Until Launch`

Turn it off only after real content, photos, Calendly, email delivery, and domain setup are ready.
