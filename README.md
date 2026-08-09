# Mastra documentation mirror

This branch deploys the latest documentation source from the official
[mastra-ai/mastra](https://github.com/mastra-ai/mastra) repository.

The documentation source is imported from upstream `main/docs` without old
release branches or a multi-version documentation setup. See [UPSTREAM.md](./UPSTREAM.md)
for the exact synced commit.

This is an independent deployment mirror and is not the official Mastra site.
The official documentation is available at [mastra.ai/docs](https://mastra.ai/docs).

## Development

Requires Node.js 22 or later and pnpm 11 or later.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Build the production site with:

```bash
pnpm build
```

The static output is written to `build/`.

## Sync the latest upstream docs

Keep the official clone at `../github/mastra`, commit a clean local working
tree, and run:

```bash
pnpm sync:upstream
```

Set `MASTRA_UPSTREAM_DIR` if the official clone is stored elsewhere. The sync
command follows only upstream `main`. It stops for manual review if upstream
changed files that contain this mirror's domain or analytics adaptations.

## Deployment environment

Set these values only on the production deployment:

```bash
DEPLOY_ENV=production
SITE_URL=https://mastra.zisheng.pro
GA_ID=G-XSL4QXVXDB
```

Google Search Console ownership is verified by
`static/googled29fba422c357ff8.html`.

## License

The imported Mastra documentation is distributed under the Apache License 2.0.
See [LICENSE.md](./LICENSE.md).
