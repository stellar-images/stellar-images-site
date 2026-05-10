# Owner Integration Handoff

Use this when replacing temporary integrations with owner-controlled accounts before public launch.

## Goal

The site is already deployed and production-tested. The final handoff is complete only when the owner controls:

- the Calendly event used on the contact page
- the Google Calendar connected to that Calendly event
- the inbox that receives order form submissions
- the Resend sender or verified sending domain
- GitHub access for CMS edits
- the domain registrar account, once a custom domain is added

## Current Temporary Production Values

Temporary production values may exist in CMS content and Vercel Environment Variables. Do not document account emails, API keys, OAuth secrets, or temporary maintainer URLs in this public repo.

Do not commit real API keys or `.env` files. Production secrets belong in Vercel Environment Variables only.

## Owner Setup Checklist

1. Create or confirm the owner's Calendly account.
2. Connect Calendly to the Google Calendar she wants bookings to land on.
3. Create the final real estate photography event type.
4. Set the Calendly event duration, availability, buffers, notifications, and cancellation/reschedule policy.
5. Use a public event URL that can be embedded on the contact page.
6. Create or confirm the owner inquiry inbox.
7. Create or confirm the Resend account.
8. Prefer a verified business/domain sender before launch, for example `bookings@example.com`.
9. Confirm owner GitHub access remains active.
10. Keep maintainer collaborator access for support.

## GitHub And Vercel Ownership State

GitHub is owner-ready:

- GitHub org: `stellar-images`
- Repo: `stellar-images/stellar-images-site`
- Owner and maintainer accounts currently have admin access.

Vercel is still maintainer-managed on Hobby:

- Attempted owner invite on May 8, 2026.
- Vercel rejected the invite because team members are not permitted on Hobby.
- CMS edits still work without owner Vercel access because Decap writes to GitHub and Vercel auto-deploys from `main`.
- For owner Vercel access, either upgrade the current Vercel team to Pro, transfer/recreate the project under the owner's Vercel account, or intentionally keep Vercel maintainer-managed.

## Swap Calendly

The Calendly URL is content, not a secret.

CMS path:

1. Open `/admin/`.
2. Open `Site Basics & Launch`.
3. Open `Site Basics, Contact & Launch`.
4. Open `Booking Link`.
5. Replace `Public Calendly Event URL` with the owner event URL.
6. Publish.
7. Wait for Vercel to redeploy.

Repo file if editing by hand:

- `src/content/site.json`
- key: `booking.calendlyUrl`

After publishing, run:

```sh
npm run verify:prod -- --calendly-url "https://calendly.com/OWNER/EVENT"
```

Then do one real booking through the live `/contact` page and confirm it appears on the owner's Google Calendar.

## Swap Email Delivery

Vercel production env vars control intake email delivery:

- `RESEND_API_KEY`
- `INTAKE_TO_EMAIL`
- `INTAKE_FROM_EMAIL`

Recommended final values:

- `INTAKE_TO_EMAIL`: the owner inquiry inbox
- `INTAKE_FROM_EMAIL`: a verified sender address controlled by the business
- `RESEND_API_KEY`: an API key from the owner-controlled Resend account

Use Vercel CLI from the repo root:

```sh
npx --yes vercel@latest env add INTAKE_TO_EMAIL production --value "owner@example.com" --yes --no-sensitive --force

npx --yes vercel@latest env add INTAKE_FROM_EMAIL production --value "bookings@example.com" --yes --no-sensitive --force

npx --yes vercel@latest env add RESEND_API_KEY production --value "<RESEND_API_KEY>" --yes --force
```

Notes:

- Use `--no-sensitive` only for non-secret email addresses.
- Keep `RESEND_API_KEY` sensitive.
- `--force` intentionally overwrites the previous temporary production value.

Redeploy after env changes:

```sh
npx --yes vercel@latest deploy --prod --yes --archive=tgz
```

Then run:

```sh
npm run verify:prod:intake
```

That command sends a real test inquiry email to the current production recipient.

## Final Production Proof

Run this full sequence after swapping both Calendly and Resend to owner-owned values:

```sh
npm run verify
npm run verify:prod -- --calendly-url "https://calendly.com/OWNER/EVENT"
npm run verify:prod:intake -- --calendly-url "https://calendly.com/OWNER/EVENT"
```

Then manually verify:

1. Open the live `/contact` page.
2. Submit the order form.
3. Confirm the owner inbox receives the inquiry.
4. Book a dummy Calendly appointment.
5. Confirm the booking appears on the owner's Google Calendar.
6. Cancel the dummy booking.
7. Confirm the cancellation appears in Calendly and Google Calendar.

## Launch Blockers

Do not publicly launch until these are true:

- owner-controlled Calendly URL is live
- owner-controlled email intake is live
- owner inbox receives test inquiries
- owner Google Calendar receives test bookings
- placeholder photos are replaced or explicitly accepted
- placeholder testimonials are replaced or removed
- final domain is set in `Site Basics & Launch -> Site Basics, Contact & Launch -> Launch & Search Settings -> Site URL`
- `Site Basics & Launch -> Site Basics, Contact & Launch -> Launch & Search Settings -> Keep Site Hidden From Google Until Launch` is turned off
- `robots.txt` allows crawling on the final domain

## Rollback

If the owner integrations fail during setup:

1. Revert the Calendly URL in CMS to the last known working URL.
2. Restore the previous Vercel env values if needed.
3. Redeploy production.
4. Re-run `npm run verify:prod`.

Do not leave a partially swapped state live without documenting ownership in private handoff notes.
