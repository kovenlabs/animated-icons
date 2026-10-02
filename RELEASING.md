# Releasing

`@kovenlabs/animated-icons` is versioned with [Changesets](https://github.com/changesets/changesets) and is in
**alpha prerelease mode** (`.changeset/pre.json`): versions come out as `0.x.y-alpha.n` under the `alpha` npm tag.

## Every change

```bash
pnpm changeset        # pick the bump, describe the change; commit the generated .changeset/*.md
```

## Publishing

On `main`, the Release workflow keeps a **"Version packages"** PR open with the next version and changelog.
Merging it publishes to npm with provenance (trusted publishing, no token). Always publish with **pnpm**:
`publishConfig` swaps `exports` from `src` to `dist`, and plain `npm publish` would ship the TypeScript source.

## The very first publish (once, by hand)

npm's trusted publishing is configured per package, so the package has to exist first:

```bash
npm login                                   # your account, 2FA
pnpm --filter @kovenlabs/animated-icons build
pnpm --filter @kovenlabs/animated-icons check:package
pnpm --filter @kovenlabs/animated-icons publish --tag alpha --access public
```

Then on npmjs.com → the package → Settings → **Trusted publishing**: add GitHub Actions, repo
`kovenlabs/animated-icons`, workflow `release.yml`. Finally, turn the workflow on (it's gated off until now, so
pushes don't fail trying to publish without npm access):

```bash
gh variable set RELEASE_ENABLED --body true --repo kovenlabs/animated-icons
```

Also enable *Settings → Actions → General → Allow GitHub Actions to create and approve pull requests*, so it can
open the version PR. From then on the workflow publishes.

Changesets v3 keeps prerelease state in `.changeset/pre.json` and applied changesets in `.changeset/pre/`. It pairs
with `changesets/action@v2`; v1 can't read that layout.

## Before every release

- `pnpm turbo run lint typecheck test build` and `pnpm --filter web e2e` are green (CI runs both).
- The site is deployed: the registry (`/r/*.json`) lives there, and items point at `apps/web/site.config.json`'s URL.

## Leaving alpha

`pnpm changeset pre exit`, then the next version PR produces a regular release on the `latest` tag.

## If a release is bad

Prefer `npm deprecate @kovenlabs/animated-icons@<version> "<why>"` and publish a fix. Unpublishing only works
within 72 hours and frees nothing for reuse.
