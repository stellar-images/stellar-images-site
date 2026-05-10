# Owner Editing Guide

This guide is for non-technical content updates after the site is handed over.

## Editing The Site

1. Open `https://stellar-images-site.vercel.app/admin/`.
2. Log in with a GitHub account that has write access to `stellar-images/stellar-images-site`.
3. Choose the section you want to edit.
4. Make the change.
5. Click `Publish`.
6. Wait for Vercel to redeploy. Most edits should show on the live site within a minute or two.

Publishing creates a GitHub commit and a Vercel deployment. It does not use GitHub Actions minutes, but it does count against Vercel deployment/build quotas. When making several small edits, batch them into one publish when practical.

## What Can Be Edited

- `Site Basics & Launch`: business-wide details and launch settings.
- `Page Content`: hero copy, section headings, descriptions, and CTA button labels for the main pages.
- `Services`: service names, descriptions, features, starting prices, and pricing rows.
- `Portfolio`: portfolio cards, categories, images, locations, alt text, and featured status.
- `Testimonials`: quote text, name, role, and star rating.
- `Credentials`: trust/qualification cards.

## Site Basics & Launch

Use `Site Basics & Launch` for settings that affect the whole website.

`Site Basics, Contact & Launch` includes:

- business name
- homepage hero text and hero image
- about preview text and founder/about image
- public phone, email, business hours, and service area
- public Calendly event URL
- footer description
- browser title, link preview image, and launch/search settings

`Booking / Order Form` includes:

- intro text above the form
- Calendly note below the form
- submit button label
- field labels, placeholders, required toggles, dropdown options, and checkbox options

The launch toggle is `Keep Site Hidden From Google Until Launch`. When it is on, the site asks Google and other search engines not to list the site yet. Keep it on while placeholder content is still visible. Turn it off only at final launch.

## Adding Portfolio Photos

1. Open `Portfolio` in the CMS.
2. Add a new portfolio item or edit an existing one.
3. Upload the image in the image field.
4. Fill in title, category, location, and alt text.
5. Use `Featured` for items that should appear on the homepage.
6. Publish.

Recommended image prep:

- Use `.jpg` or `.webp` for real photography.
- Keep files reasonably compressed before upload.
- Prefer horizontal images for hero and portfolio cards.
- Use descriptive alt text such as `Bright kitchen with white cabinets in Beaufort listing`.

Where uploads go:

- CMS-uploaded images are stored in the repo under `public/images/uploads`.
- The site serves those images from `/images/uploads/...`.
- Publishing an image upload creates a Git commit and triggers a Vercel deploy, just like text edits.

## Updating Page Copy

Use `Page Content` for page-level wording:

- hero headings and descriptions
- section titles and descriptions
- CTA text
- button labels

Use `Site Basics & Launch` for business-wide details:

- business name
- homepage hero image
- contact details
- service area
- footer description
- Calendly URL
- SEO launch setting

## Launch Search Setting

`Site Basics & Launch -> Site Basics, Contact & Launch -> Launch & Search Settings -> Keep Site Hidden From Google Until Launch` is currently enabled because the site still has placeholder content. Turn it off only when the real photos, copy, Calendly link, email delivery, and domain are ready.

## What Not To Edit In The CMS

- Do not paste API keys, passwords, OAuth secrets, or calendar credentials into any CMS field.
- Do not use the CMS for private client notes or inquiry tracking. The site is static and repo-backed.
- Do not delete required form fields unless the booking workflow changes intentionally.
- Avoid changing fields labeled `Advanced` unless a maintainer asks you to. Those values are internal IDs, anchors, or input types the website depends on.

## If A Publish Does Not Show Up

1. Wait two minutes.
2. Refresh the page.
3. Check whether the edit appears in the GitHub repo commit history.
4. Check the Vercel deployment list for a failed build.
5. Ask the maintainer to run `npm run verify` locally if the deploy failed.
