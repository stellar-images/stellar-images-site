# Security Notes

This repository is public. Treat every committed file as public information.

## Never Commit

- API keys, OAuth client secrets, personal access tokens, or long-lived editor tokens
- real `.env` files or Vercel project environment files
- private customer information, booking details, or inquiry payloads
- personal account emails or account-specific handoff notes
- temporary maintainer integration URLs that are not meant to be public launch configuration

## Where Secrets Belong

- Vercel Environment Variables for production and preview secrets
- local `.env` files for development-only secrets
- private handoff notes for account ownership details

The tracked `.env.example` file should contain variable names only, with blank or placeholder values.

## Public Files

`public/admin/config.yml` is served by the website and must not contain secrets. It may contain public CMS configuration such as the repo path, branch, media folders, and collection schema.

## If A Secret Is Exposed

1. Revoke or rotate the exposed secret immediately in the provider dashboard.
2. Replace the Vercel Environment Variable with the new value.
3. Redeploy production.
4. Remove the exposed value from the repo.
5. Treat git history as already public unless it has been formally rewritten and all clones are controlled.
