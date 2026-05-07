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

## How Content Updates Are Intended To Work

Target owner flow:

1. Open `/admin`
2. Log in
3. Edit text, pricing, services, portfolio items, or images
4. Save and publish
5. Let Vercel redeploy the site automatically

## Current State

Scaffolded now:

- five core pages
- reusable components
- structured content files
- Decap admin UI
- placeholder assets

Still needs final production setup:

- Decap production auth environment variables
- real Calendly URL
- Vercel email env vars for intake delivery
- final photos and content

## Decap Auth And Maintenance Access

The recommended long-term setup is:

- her account or a shared organization owns the GitHub repo
- you remain a collaborator for maintenance
- Vercel deploys from that repo
- Decap authenticates editors through GitHub
- Decap commits content edits back to the repo

Temporary testing with your GitHub account or OAuth app is fine, but secrets must stay in Vercel Environment Variables or another server-side auth provider. Do not commit GitHub OAuth secrets, personal access tokens, or long-lived editor tokens.

See `DECAP_AUTH_PLAN.md` for the production test checklist.

## Email Intake Delivery

The booking form posts to `/api/intake`. Production delivery uses Resend through Vercel Environment Variables.

Required variables:

- `RESEND_API_KEY`
- `INTAKE_TO_EMAIL`
- `INTAKE_FROM_EMAIL`

The sender address must be allowed by the Resend account. In production, use a verified domain sender rather than a personal Gmail address.

## Content Sources

- `src/content/site.json`
- `src/content/services.json`
- `src/content/portfolio.json`
- `src/content/testimonials.json`
- `src/content/credentials.json`
- `src/content/form-config.json`

These files are intended to be managed by Decap rather than edited by hand in normal use.
