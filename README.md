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

The `deploy` workflow builds the website and deploys it to Cloudflare Pages. It runs each day, and you can run it by hand from the Actions tab.

It needs these settings of the repository:

- Secret `CLOUDFLARE_API_TOKEN`: a Cloudflare API token with the "Cloudflare Pages: Edit" permission.
- Secret `CLOUDFLARE_ACCOUNT_ID`: the ID of the Cloudflare account.
- Variable `CLOUDFLARE_PAGES_PROJECT`: the name of the Cloudflare Pages project of api.adonisjs.com.

## Add a package

1. Add a `typedoc.json` to the repository of the package, with its `entryPoints`. See the `typedoc.json` of `@adonisjs/core`.
2. Release the package, so that its tag has the `typedoc.json`.
3. Add its npm name to `packages.json`.
