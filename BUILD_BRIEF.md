# Build Brief

This document turns the Base44 reference and current decisions into a concrete implementation plan for the first version of the site.

## Project Goal

Build a polished, mobile-first real estate photography website that is:

- inexpensive to host
- easy to hand off later
- simple to update
- visually close to the Base44 direction
- able to handle booking via Calendly
- able to send intake submissions to email

## Locked Decisions

- Framework: `Astro`
- Hosting: `Vercel`
- Booking: `Calendly`
- Calendar source of truth: `Google Calendar`
- Intake delivery: email-only for v1
- Content approach: `Decap CMS` editing UI backed by repo content files and static assets
- Initial content: placeholders are acceptable
- Design source of truth: Base44 video
- Intake form source of truth: Base44 form unless later explicitly overridden
- Site type: multi-page brochure site
- Primary audience: real estate agents / property listing clients
- Priority device: mobile first

## Product Shape

The site should feel like a polished service business website, not a SaaS app and not a DIY template. It should make three things obvious quickly:

- what she offers
- why she is trustworthy
- how to book

## V1 User Stories

1. As a prospective client, I want to immediately understand the business and services so I can decide whether to continue.
2. As a prospective client, I want to see strong portfolio examples so I can evaluate the quality of work quickly.
3. As a prospective client, I want to review services and pricing so I can understand whether the offering fits my needs.
4. As a prospective client, I want a straightforward way to request/book a shoot so I do not have to chase down details manually.
5. As a prospective client, I want to provide the core property details needed for the shoot request.
6. As the business owner, I want booking to sync with Google Calendar through Calendly so availability stays accurate.
7. As the business owner, I want intake submissions sent to email so I can manage requests without learning a new system.
8. As the business owner, I want the content to be editable through a simple admin UI so I can update the site without touching code.
9. As the site maintainer, I want deployment to be tied to one repo and one hosting flow so updates and handoff stay simple.

## Sitemap

### 1. Home

Purpose:

- introduce the business
- establish visual quality
- preview services
- preview portfolio
- drive users toward booking

Expected sections:

- header / mobile nav
- hero
- about preview
- services overview
- featured portfolio
- testimonials
- trust / credentials preview
- CTA section
- footer

### 2. Portfolio

Purpose:

- show curated visual work
- let visitors browse by media type

Expected sections:

- page hero
- category filters
- gallery grid / stacked cards on mobile
- CTA to book

Categories:

- `All`
- `Interior`
- `Exterior`
- `Drone`
- `Video`

### 3. Services

Purpose:

- explain deliverables and pricing
- reduce basic sales questions

Expected sections:

- page hero
- services overview cards
- detailed service sections
- pricing presentation
- custom package CTA
- footer CTA / booking CTA

Service lineup:

- `Professional Listing Photos`
- `Drone Photography & Video`
- `Video Walkthroughs`

### 4. About

Purpose:

- build trust
- explain background and local market relevance

Expected sections:

- page hero
- founder story
- portrait/photo block
- credentials / qualifications
- service area context
- CTA to book

### 5. Contact / Book

Purpose:

- give direct contact info
- capture project details
- drive booking completion

Expected sections:

- page hero
- business contact details
- intake form
- Calendly booking section or embedded scheduler
- footer

## Booking / Intake Flow

This is the one area where implementation detail matters most.

Recommended v1 flow:

1. User lands on the `Contact / Book` page.
2. User sees contact info and the shoot request form.
3. User fills in basic property/request details.
4. User books through Calendly on the same page or immediately after the form section.
5. Form submission is emailed to the business inbox.

V1 principle:

- treat intake and booking as one unified workflow
- do not create two unrelated parallel paths unless the business explicitly asks for that later

Open implementation choice:

- `same-page flow`: form and Calendly both visible on the page
- `gated flow`: submit form first, then reveal or route to Calendly

Default recommendation:

- start with `same-page flow` for simplicity unless there is a strong reason to gate it

## Intake Form Fields

Base44-visible fields:

- `Full Name`
- `Email`
- `Phone`
- `Square Footage`
- `Property Address`
- `Services Needed`
- `Additional Details`

Service options shown:

- `Professional Listing Photos`
- `Drone Photography & Video`
- `Video Walkthroughs`

Suggested v1 field model:

- `fullName` required
- `email` required
- `phone` optional
- `squareFootageRange` optional
- `propertyAddress` required
- `servicesNeeded` required, multi-select
- `additionalDetails` optional

If needed later, this can expand to include:

- city
- state
- zip
- MLS number
- bedrooms
- bathrooms
- lot size

## CMS Strategy

Use `Decap CMS` for content editing.

What that means:

- the site remains an Astro site deployed on Vercel
- an `/admin` route provides the editing UI
- content edits are saved back into the repo
- Vercel redeploys automatically after edits

Why this is the preferred path:

- no separate database required
- low recurring cost
- owner can update content without editing JSON by hand
- content history remains versioned in Git
- future maintainers still work with plain files under the hood

Practical expectations:

- the editing experience is admin-form based, not drag-and-drop page building
- portfolio items, services, pricing, testimonials, and site settings should all be editable through CMS collections
- media uploads should go through the CMS media flow into repo-backed asset folders

## Content Model

Business content should not be scattered through components. Keep it in structured content files that are managed through Decap CMS.

Recommended content files:

### `src/content/pages.json`

- page hero copy
- section headings
- section descriptions
- CTA button labels

### `src/content/site.json`

- business name
- tagline
- SEO/social defaults
- launch `noindex` flag
- hero copy
- service area
- phone
- email
- hours
- social links
- footer description
- calendly url

### `src/content/services.json`

Per service:

- slug
- name
- short description
- long description
- starting price
- pricing rows
- feature bullets
- icon key

### `src/content/portfolio.json`

Per portfolio item:

- slug or id
- title
- category
- image path
- location
- featured boolean
- alt text

### `src/content/testimonials.json`

Per testimonial:

- quote
- name
- role or company
- stars

### `src/content/credentials.json`

Per credential:

- title
- short description
- icon key

### `src/content/form-config.json`

- intro text
- field list
- labels
- required flags
- placeholder text
- service checkbox options
- submit label

Recommended Decap collections:

- `site settings`
- `page content`
- `services`
- `portfolio`
- `testimonials`
- `credentials`
- `booking/contact settings`

## Asset Model

Recommended asset storage:

- store optimized images in the repo
- serve them as static assets from the site

Suggested directories:

- `public/images/hero/`
- `public/images/portfolio/`
- `public/images/about/`
- `public/images/services/`
- `public/images/branding/`

V1 expectation:

- placeholders can be used initially
- later content swaps should mostly happen through the CMS UI rather than direct file editing

## Design System Direction

Based on Base44, the visual system should lean:

- clean
- light
- elegant
- service-oriented
- trustworthy

Key traits:

- serif display headings
- simple sans-serif body text
- rounded buttons and cards
- soft blue as primary accent
- navy footer
- large photography-led hero moments
- editorial spacing
- strong mobile rhythm

Avoid:

- generic startup SaaS styling
- overly dark mood board styling
- crowded grids
- loud luxury clichés
- too many animation gimmicks

## Component List

Recommended components:

- `Layout`
- `Header`
- `MobileNav`
- `HeroSection`
- `SectionIntro`
- `ServiceCard`
- `ServiceDetail`
- `PortfolioCard`
- `PortfolioFilter`
- `TestimonialCard`
- `CredentialCard`
- `ContactInfoList`
- `BookingForm`
- `CalendlyEmbed`
- `CallToAction`
- `Footer`

## Route Structure

Recommended Astro routes:

- `src/pages/index.astro`
- `src/pages/portfolio.astro`
- `src/pages/services.astro`
- `src/pages/about.astro`
- `src/pages/contact.astro`
- `public/admin/index.html`
- `public/admin/config.yml`

Optional later routes:

- `src/pages/services/[slug].astro`
- `src/pages/thank-you.astro`

## Repo Layout

Recommended structure:

```text
/
  public/
    admin/
      index.html
      config.yml
    images/
      hero/
      portfolio/
      about/
      services/
      branding/
  src/
    components/
    content/
      site.json
      services.json
      portfolio.json
      testimonials.json
      credentials.json
      form-config.json
    layouts/
    pages/
      index.astro
      portfolio.astro
      services.astro
      about.astro
      contact.astro
    styles/
  README.md
  HANDOFF.md
```

## Form Delivery

V1 behavior:

- form submission goes to email only
- no database
- no custom admin panel for inquiry management

Benefits:

- lowest complexity
- easy handoff
- minimal cost

Limitation:

- not ideal for high-volume organization or status tracking

Upgrade path later:

- save to Google Sheets
- send to Airtable
- use structured backend storage

## Calendly Integration

V1 behavior:

- use Calendly rather than custom scheduling
- connect Calendly to the owner’s Google Calendar
- embed Calendly on the booking/contact page or link to it prominently

Benefits:

- avoids custom booking logic
- handles availability
- reduces double-booking risk
- easier to hand off

## Deployment Model

Recommended deployment flow:

1. Repo hosted in Git.
2. Vercel connected to the repo.
3. Pushes and CMS-authored content edits trigger automatic deploys.
4. Production domain points to Vercel.

## Ownership / Handoff Rules

To avoid messy transition later:

- domain should belong to her account
- Calendly should belong to her account
- Google Calendar should belong to her account
- email destination should be her inbox
- Vercel should be in her account or shared with admin access

Developer ownership should be limited to implementation, not long-term account lock-in.

## CMS Ownership / Access

For a clean handoff:

- the Git host should be in her account or shared with her
- Decap login/auth should be tied to an account she controls
- media and content commits should land in the repo used by Vercel
- she should receive a short editor guide for common updates

## Required Placeholder Content For Build Start

Enough to scaffold:

- temporary business name
- temporary tagline
- temporary hero image
- 6 to 12 placeholder portfolio images
- draft services and pricing
- draft about copy
- draft credentials
- placeholder phone/email/service area
- placeholder testimonials if needed
- placeholder Calendly URL slot

## Definition Of Done For V1

The first version is done when:

- all 5 core pages exist
- mobile layout is polished
- navigation works
- portfolio filtering works
- services and pricing are present
- about/trust content is present
- contact/book page works
- form submission email flow works
- Calendly integration works
- placeholder content can be replaced through the CMS UI
- Decap admin is configured and usable
- README and handoff instructions exist

## Open Questions

These do not block scaffolding, but should be resolved before final polish:

- Should pricing remain public?
- Should Calendly be embedded directly or linked out?
- Should the booking flow be gated by form submission or simply unified on one page?
- Will service pages remain one shared services page or later split into per-service routes?

## Immediate Next Build Phase

1. Scaffold the Astro project.
2. Create the route structure.
3. Create Decap-managed content files and admin config with placeholders.
4. Build the base layout and design tokens.
5. Implement the 5 core pages.
6. Wire the intake form and Calendly placeholder.
7. Configure Decap admin and test the editing flow.
8. Add handoff documentation.
