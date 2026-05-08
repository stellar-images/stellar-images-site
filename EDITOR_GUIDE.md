# Owner Editing Guide

This guide is for non-technical content updates after the site is handed over.

## Editing The Site

1. Open `https://stellar-images-site.vercel.app/admin/`.
2. Log in with a GitHub account that has write access to `stellar-images/stellar-images-site`.
3. Choose the section you want to edit.
4. Make the change.
5. Click `Publish`.
6. Wait for Vercel to redeploy. Most edits should show on the live site within a minute or two.

## What Can Be Edited

- `Site Settings`: business name, homepage hero, about preview, contact info, service area, footer, launch SEO flag, Calendly URL placeholder.
- `Page Content`: hero copy, section headings, descriptions, and CTA button labels for the main pages.
- `Services`: service names, descriptions, features, starting prices, and pricing rows.
- `Portfolio`: portfolio cards, categories, images, locations, alt text, and featured status.
- `Testimonials`: quote text, name, role, and star rating.
- `Credentials`: trust/qualification cards.
- `Booking Form`: labels, placeholders, field requirements, options, intro text, and submit label.

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

Use `Site Settings` for business-wide details:

- business name
- homepage hero image
- contact details
- service area
- footer description
- Calendly URL
- SEO launch setting

## Launch SEO Flag

`Site Settings -> SEO -> Hide From Search Engines Until Launch` is currently enabled because the site still has placeholder content. Turn it off only when the real photos, copy, Calendly link, email delivery, and domain are ready.

## What Not To Edit In The CMS

- Do not paste API keys, passwords, OAuth secrets, or calendar credentials into any CMS field.
- Do not use the CMS for private client notes or inquiry tracking. The site is static and repo-backed.
- Do not delete required form fields unless the booking workflow changes intentionally.

## If A Publish Does Not Show Up

1. Wait two minutes.
2. Refresh the page.
3. Check whether the edit appears in the GitHub repo commit history.
4. Check the Vercel deployment list for a failed build.
5. Ask the maintainer to run `npm run build` locally if the deploy failed.
