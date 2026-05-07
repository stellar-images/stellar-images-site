# GitHub Org And Repo Setup

## Recommended Ownership

- GitHub organization owns the repository.
- Her GitHub account is an organization owner.
- `lylecodes` is an organization owner during setup, then can remain owner or be reduced to repo admin/maintainer.
- Vercel connects to the organization repository.
- Decap CMS points to the organization repository.

## Create The Organization

GitHub organization creation is a web UI flow.

1. Open GitHub.
2. Go to Settings.
3. Open Organizations.
4. Choose New organization.
5. Choose the free plan unless a paid plan is needed later.
6. Pick the organization slug carefully because it becomes part of the repo URL.
7. Invite `lylecodes` as an owner or admin-level collaborator for setup.

Suggested slug pattern:

- `allex-photography`
- `stellar-images-photo`
- her final business name in lowercase with hyphens

## Create And Push The Repo

After the organization exists and `lylecodes` has permission to create repos there, run:

```sh
gh repo create ORG_SLUG/stellar-images-site \
  --private \
  --source=. \
  --remote=origin \
  --push \
  --description "Real estate photography website"
```

Replace `ORG_SLUG` with the real organization slug.

## Decap Config After Push

Update `public/admin/config.yml`:

```yml
backend:
  name: github
  repo: ORG_SLUG/stellar-images-site
  branch: main
  base_url: https://YOUR-VERCEL-DOMAIN
  auth_endpoint: api/auth
```

Then commit and push that config update.

## Why The Org Setup Works

Decap's GitHub backend requires CMS users to have push access to the content repository. With an organization:

- she can log into Decap with her GitHub account if she has write/admin access
- you can log into Decap with `lylecodes` if that account has write/admin access
- Decap commits content edits as the logged-in GitHub user
- Vercel redeploys from those commits

No one needs to share GitHub passwords.
