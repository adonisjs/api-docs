# AdonisJS API docs

The API reference of the AdonisJS packages, published at https://api.adonisjs.com.

TypeDoc builds one website from the packages in `packages.json`. Each package is built from the git tag of its latest version on npm, with the `typedoc.json` of its own repository.

## Build locally

```sh
npm install
npm run clone
npm run build
npm run serve
```

## Deploy

The Cloudflare Worker `api-docs` serves the website as static assets (`wrangler.jsonc`). Workers Builds builds and deploys it on each push to `main`, with these build settings:

- Build command: `npm ci && npm run clone && npm run build`
- Deploy command: `npx wrangler deploy`

The `rebuild` workflow starts a build each day, so that new releases of the packages show on the website. It calls the deploy hook of the Worker, in the secret `CLOUDFLARE_DEPLOY_HOOK`. With no secret, it does nothing.

## Add a package

1. Add a `typedoc.json` to the repository of the package, with its `entryPoints`. See the `typedoc.json` of `@adonisjs/core`.
2. Release the package, so that its tag has the `typedoc.json`.
3. Add its npm name to `packages.json`.
