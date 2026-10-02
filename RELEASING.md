# Releasing

`@kovenlabs/animated-icons` is versioned with [Changesets](https://github.com/changesets/changesets) and is in
**alpha prerelease mode** (`.changeset/pre.json`): versions come out as `0.x.y-alpha.n` under the `alpha` npm tag.

## Every change

```bash
pnpm changeset        # pick the bump, describe the change; commit the generated .changeset/*.md
```

## Publishing

On `main`, the Release workflow keeps a **"Version packages"** PR open with the next version and changelog.
Merging it publishes to npm with provenance and creates the GitHub release. Always publish with **pnpm**:
`publishConfig` swaps `exports` from `src` to `dist`, and plain `npm publish` would ship the TypeScript source.

The workflow runs only while the `RELEASE_ENABLED` repo variable is `"true"`, and it needs
*Settings → Actions → General → Allow GitHub Actions to create and approve pull requests* for the version PR.

## npm authentication

The workflow publishes with a **granular access token** (write access to `@kovenlabs/animated-icons`, bypass 2FA)
stored as the `NPM_TOKEN` repo secret. npm caps how long write tokens live, so when releases start failing with
401/403, create a new token on npmjs.com and replace the secret (in your own terminal, so it never lands anywhere
else):

```bash
gh secret set NPM_TOKEN --repo kovenlabs/animated-icons    # paste the new token when prompted
```

Then revoke the old token on npmjs.com.

**Moving to token-free publishing later:** enable 2FA on the npm account, add a trusted publisher (npmjs.com → the
package → Settings → Trusted publishing → GitHub Actions, `kovenlabs/animated-icons`, `release.yml`, allow
`npm publish`), delete the `NPM_TOKEN` secret, and revoke the token. The workflow already has `id-token: write`.

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
