# Decap Auth Plan

This site uses Decap CMS for owner-editable content. The `/admin` UI is static, but production editing needs GitHub authentication so Decap can commit content changes back to the repo.

## Recommended Ownership Model

- The durable repo lives under the `stellar-images` GitHub organization.
- You should remain a collaborator for maintenance.
- Vercel should be connected to that repo.
- Decap should authenticate editors through GitHub, then commit CMS edits to the same repo Vercel deploys from.
- The repo is public so Vercel Hobby can auto-deploy from the organization repo; all production secrets must stay in Vercel Environment Variables.

## Temporary Test Credentials

Using your own GitHub account or OAuth app for early testing is acceptable if it is treated as temporary.

Rules:

- Do not commit secrets to the repo.
- Use Vercel Environment Variables for any OAuth secrets.
- Test with a real deployed Vercel preview or production deployment, not only local mode.
- Before final handoff, replace temporary OAuth ownership with her account, a shared organization, or a durable project account.

## Vercel Environment Variables

Vercel supports environment variables during build and during Function execution. For Decap auth, secrets must only be read server-side, typically from a Vercel Function or an external OAuth provider.

Likely variables once the OAuth provider/function is selected:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `OAUTH_STATE_SECRET` or equivalent signing/CSRF secret if required by the provider
- `OAUTH_REDIRECT_URI`
- `GITHUB_OAUTH_SCOPE`

Current production state:

- `OAUTH_REDIRECT_URI` is set to `https://stellar-images-site.vercel.app/api/callback`
- `GITHUB_OAUTH_SCOPE` is set to `public_repo`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `OAUTH_STATE_SECRET` still need to be added
- Vercel Git auto-deploy is connected to `stellar-images/stellar-images-site`

Do not put `GITHUB_CLIENT_SECRET` in `public/admin/config.yml`. That file is served publicly.

## Decap Config Boundary

Safe in `public/admin/config.yml`:

- Git backend name
- repo path
- branch
- public auth endpoint URL
- media folder paths
- collection schema

Not safe in `public/admin/config.yml`:

- GitHub client secret
- personal access tokens
- long-lived editor tokens
- any private credentials

## Production Test Checklist

1. Deploy the site to Vercel.
2. Configure the real GitHub repo in `public/admin/config.yml`.
3. Configure Decap production auth with either a Vercel-hosted OAuth function or another reliable OAuth provider.
4. Add required secrets in Vercel Environment Variables.
5. Open `/admin` on the deployed site.
6. Log in with a GitHub account that has write access to the repo.
7. Edit a harmless content value, such as a testimonial or phone number.
8. Publish the edit.
9. Confirm a Git commit appears in the repo.
10. Confirm Vercel redeploys from that commit.
11. Confirm the live site shows the updated value.

## Current Repo State

- Decap UI is scaffolded.
- Decap collections are scaffolded.
- Local backend is enabled for local CMS testing.
- Vercel OAuth endpoints exist at `/api/auth` and `/api/callback`.
- Production GitHub OAuth still needs real env vars.
- `public/admin/config.yml` points at `stellar-images/stellar-images-site` and `https://stellar-images-site.vercel.app`.
- The GitHub repo is public for Vercel Hobby deploy compatibility; no production secrets are committed.
