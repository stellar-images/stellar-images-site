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
See `LAUNCH_CHECKLIST.md` before sharing the site publicly.
See `OWNER_INTEGRATION_HANDOFF.md` for the exact owner account swap and verification sequence.

## Admin: Site Basics & Launch

The first CMS section is `Site Basics & Launch`. It contains the business-wide settings that affect multiple pages:

- `Site Basics, Contact & Launch`: business name, homepage hero, about preview, contact details, service area, public Calendly URL, footer text, social sharing image, and launch/search settings.
- `Booking / Order Form`: the public property/order form intro text, submit button text, field labels, field requirements, dropdown options, and checkbox options.

The launch/search toggle is labeled `Keep Site Hidden From Google Until Launch`. Keep it on while placeholder photos/copy are still visible. Turn it off only when the real photos, copy, Calendly link, email delivery, and final domain are ready.

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

- owner-controlled Calendly event URL replacing the current maintainer test URL
- owner-controlled Resend sender domain and inquiry recipient replacing the current maintainer test email setup
- final photos and content
- custom domain
- launch SEO flag turned off after final content is ready
- final Vercel ownership/access decision: keep maintainer-managed, upgrade for team access, or move/recreate under the owner's Vercel account

Already configured:

- GitHub repo under `stellar-images`
- owner GitHub access is active
- Vercel production deployment
- Vercel GitHub integration for automatic deploys from `main`
- Vercel production env vars for Decap GitHub OAuth
- verified CMS login and publish path
- Vercel production env vars for test Resend delivery
- production-tested Calendly booking flow using the maintainer test event
- production-tested email intake flow using the maintainer Resend account

## Production Test Status

End-to-end production verification was completed on May 8, 2026 using temporary maintainer-owned integration values.

Verified:

- live `/contact` page rendered the Calendly iframe
- live form submission returned the success state
- live `/api/intake` returned `200 {"ok": true}`
- Resend delivered production test emails
- Calendly created a booking for the public event URL
- Google Calendar showed the booking
- the dummy booking was canceled afterward

Current temporary test values are intentionally not documented in this public repo.

Do not commit live account emails, API keys, OAuth client secrets, temporary maintainer URLs, or account-specific handoff details. Production secrets belong in Vercel Environment Variables, and public booking URLs are editable through CMS content.

Use `OWNER_INTEGRATION_HANDOFF.md` to replace these values. After the replacement, run `npm run verify`, `npm run verify:prod`, and `npm run verify:prod:intake`, then do one manual Calendly booking/cancellation test against the live contact page.

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

- `INTAKE_TO_EMAIL` is set in Vercel Production
- `INTAKE_FROM_EMAIL` is set in Vercel Production
- `RESEND_API_KEY` is set in Vercel Production as an encrypted secret

The sender address must be allowed by the email delivery account. For public launch, use a verified domain sender, then change `INTAKE_TO_EMAIL` to the owner's real inquiry inbox.

## Vercel Deployment

The current production deployment is live at:

- https://stellar-images-site.vercel.app

The project currently lives under a maintainer-controlled Vercel scope.

Vercel access note:

- Attempted owner invite on May 8, 2026.
- Vercel rejected the invite because team members are not permitted on the current Hobby plan.
- This does not block CMS editing or automatic deploys. The owner can update the website through `/admin/`, Decap commits to GitHub, and Vercel deploys from `main`.
- True owner Vercel access requires one of these paths: upgrade the current Vercel team to Pro, transfer/recreate the project under the owner's Vercel account, or keep Vercel maintainer-managed until launch needs justify the change.

Git auto-deploy is connected to:

- `stellar-images/stellar-images-site`
- branch: `main`

Manual production deploys are still possible from this folder if needed:

```sh
npx --yes vercel@latest deploy --prod --yes --archive=tgz
```

## Vercel Plan And Quota Notes

CMS publishes do not consume GitHub Actions minutes. Decap commits content changes to GitHub, and the Vercel Git integration builds/deploys those commits on Vercel infrastructure.

Current practical quota notes for Vercel Hobby, verified May 2026:

- build execution: 6,000 minutes per month
- deployments: 100 per day
- build rate limit: 32 builds per hour
- maximum build duration: 45 minutes per deployment
- fast data transfer: 100 GB per month
- function invocations: 1,000,000 per month
- static file upload limit: 100 MB per deployment

For this small Astro site, the main practical limit is deployment frequency from CMS publishing. Normal owner edits should be fine, but avoid repeatedly publishing tiny changes one at a time during heavy editing sessions.

Important business-use caveat: Vercel Hobby is intended for personal/non-commercial use. Since this is a business website, the cleaner long-term setup is Vercel Pro if the site is launched publicly for commercial use. Pro also avoids the private organization repo blocker and provides more headroom.

## Content Sources

- `src/content/site.json`
- `src/content/pages.json`
- `src/content/services.json`
- `src/content/portfolio.json`
- `src/content/testimonials.json`
- `src/content/credentials.json`
- `src/content/form-config.json`

These files are intended to be managed by Decap rather than edited by hand in normal use.

## Launch Search Setting

The site currently sets `noindex, nofollow` through `src/content/site.json` because it still contains placeholder content. In the CMS, this is:

- `Site Basics & Launch -> Site Basics, Contact & Launch -> Launch & Search Settings -> Keep Site Hidden From Google Until Launch`

Turn it off only after real content, photos, Calendly, email delivery, and domain setup are ready.

## Maintainer Notes

Use `MAINTAINER_CHECKLIST.md` for the current local and production verification flow. The main local gate is `npm run verify`. GitHub Actions are intentionally not configured yet to avoid burning CI minutes during frequent early iteration.
