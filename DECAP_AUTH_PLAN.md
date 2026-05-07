# Decap Auth Plan

This site uses Decap CMS for owner-editable content. The `/admin` UI is static, but production editing needs GitHub authentication so Decap can commit content changes back to the repo.

## Recommended Ownership Model

- The durable repo lives under the `stellar-images` GitHub organization.
- You should remain a collaborator for maintenance.
- Vercel should be connected to that repo.
- Decap should authenticate editors through GitHub, then commit CMS edits to the same repo Vercel deploys from.
- The repo is public so Vercel Hobby can auto-deploy from the organization repo; all production secrets must stay in Vercel Environment Variables.

## Credential Rules

- Do not commit secrets to the repo.
- Use Vercel Environment Variables for OAuth secrets.
- Test with a real deployed Vercel production or preview deployment, not only local mode.
- Before final handoff, make sure the OAuth app ownership and repo access model are durable for the business.

## Vercel Environment Variables

Configured variables:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `OAUTH_STATE_SECRET`
- `OAUTH_REDIRECT_URI`
- `GITHUB_OAUTH_SCOPE`

Current production state:

- `OAUTH_REDIRECT_URI` is set to `https://stellar-images-site.vercel.app/api/callback`
- `GITHUB_OAUTH_SCOPE` is set to `public_repo`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `OAUTH_STATE_SECRET` are set in Vercel Production
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

Completed:

1. Deployed the site to Vercel.
2. Configured the real GitHub repo in `public/admin/config.yml`.
3. Configured Decap production auth through Vercel-hosted OAuth functions.
4. Added required secrets in Vercel Environment Variables.
5. Opened `/admin` on the deployed site.
6. Logged in with a GitHub account that has write access to the repo.
7. Edited a harmless booking form label.
8. Published the edit.
9. Confirmed Git commit `51ec91e` appeared in the repo.
10. Confirmed Vercel redeployed from that commit.
11. Reverted the temporary label with commit `97b2cda` and confirmed the live site returned to the intended value.

## Current Repo State

- Decap UI is live.
- Decap collections are configured.
- Local backend is enabled for local CMS testing.
- Vercel OAuth endpoints exist at `/api/auth` and `/api/callback`.
- Production GitHub OAuth env vars are configured and tested.
- `public/admin/config.yml` points at `stellar-images/stellar-images-site` and `https://stellar-images-site.vercel.app`.
- The GitHub repo is public for Vercel Hobby deploy compatibility; no production secrets are committed.
