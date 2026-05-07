# Launch Checklist

Use this before pointing a real domain at the site or sharing it publicly.

## Required Before Launch

- Replace placeholder hero, portfolio, and about images.
- Replace placeholder business copy, testimonial names, and credential text with real approved copy.
- Add the real Calendly event URL in `Site Settings -> Booking -> Calendly URL`.
- Configure production email delivery for `/api/intake`.
- Submit one real end-to-end booking test: form submit, email received, Calendly booking created.
- Set the final domain in `Site Settings -> SEO -> Site URL`.
- Turn off `Site Settings -> SEO -> Hide From Search Engines Until Launch`.
- Confirm `https://final-domain.com/robots.txt` allows crawling after launch.

## Recommended Content QA

- Confirm pricing is accurate.
- Confirm service area is accurate.
- Confirm phone and email are correct.
- Confirm portfolio images have descriptive alt text.
- Confirm no placeholder text remains on public pages.
- Confirm mobile layout on a phone-sized screen.

## Account Ownership QA

- The owner controls the domain registrar account.
- The owner controls Calendly and the connected Google Calendar.
- The owner has GitHub access to publish CMS edits.
- The owner has Vercel access or knows who maintains Vercel.
- The email delivery account/sender is controlled by the owner or business.

## Post-Launch Smoke Test

1. Open the homepage.
2. Open portfolio, services, about, and contact pages.
3. Submit a real test inquiry.
4. Book a real test Calendly slot.
5. Confirm the email arrives in the owner inbox.
6. Confirm the Calendly booking appears on the owner calendar.
7. Publish a small CMS copy edit and confirm Vercel redeploys.
8. Revert that copy edit if it was only a test.
