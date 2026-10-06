<p align="center">
  <img src="apps/web/public/logo.svg" alt="Animated Icons" width="96" height="96" />
</p>

# Animated Icons

Animated icons with 1–3 color slots, read from your shadcn/ui tokens. Each icon has its own animation
variants. Configure them globally, per subtree or per instance.

```tsx
<Bell />                                       // theme colors, plays on hover
<Bell variant="shake" trigger="auto" interval={2000} />
<Bell colors={{ accent: "destructive" }} />    // a token name or any CSS color
```

## Install

```bash
# shadcn registry: copies the source into your codebase
npx shadcn add @kovenlabs/bell        # one icon
npx shadcn add @kovenlabs/all         # every icon

# or the package: one dependency, tree-shaken
pnpm add @kovenlabs/animated-icons motion
```

All the ways, compared: `/docs/installation`.

## For AI agents

A skill teaches your coding agent to pick the icon, variant and trigger for a use case. It searches the
catalog (`@kovenlabs/animated-icons/catalog.json`, or `/icons.json` on the site):

```bash
npx skills add kovenlabs/animated-icons --skill find-animated-icon
```

## Repo

Turborepo + pnpm.

| Path                         | What                                                                     |
| ---------------------------- | ------------------------------------------------------------------------ |
| `packages/animated-icons`    | The library (`@kovenlabs/animated-icons`), its `registry.json` and `STYLE.md` |
| `apps/web`                   | The site: landing (`/`), catalog (`/icons`), docs (`/docs`, Fumadocs), brand (`/brand`). Serves the registry at `/r/*.json` |
| `packages/typescript-config` | Shared tsconfig                                                           |
| `skills/find-animated-icon`  | The agent skill for end users: search the catalog, pick variant and trigger |

```bash
pnpm install
pnpm dev              # http://localhost:3312 (landing, /icons, /docs, /brand)
pnpm test             # library tests (vitest)
pnpm lint && pnpm typecheck
pnpm build            # generates the barrel + registry, then builds the site
```

### Adding an icon

One file in `packages/animated-icons/src/icons/<name>.tsx`, drawn to [`STYLE.md`](packages/animated-icons/STYLE.md):
the tests, the exports, the registry and the catalog pick it up with no other wiring. The full process
(naming, family, category, motion, checks, changeset) is in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
