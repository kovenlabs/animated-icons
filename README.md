<p align="center">
  <img src="apps/web/public/logo.svg" alt="Animated Icons" width="96" height="96" />
</p>

# Animated Icons

Animated icons with 1–3 color slots, read from your shadcn/ui tokens. Each icon has its own animation
variants. Configure them globally, per subtree or per instance.

```tsx
<BellIcon />                                       // theme colors, plays on hover
<BellIcon variant="shake" trigger="auto" interval={2000} />
<BellIcon colors={{ accent: "destructive" }} />    // a token name or any CSS color
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

## Repo

Turborepo + pnpm.

| Path                         | What                                                                     |
| ---------------------------- | ------------------------------------------------------------------------ |
| `packages/animated-icons`    | The library (`@kovenlabs/animated-icons`), its `registry.json` and `STYLE.md` |
| `apps/web`                   | The site: landing (`/`), catalog (`/icons`), docs (`/docs`, Fumadocs), brand (`/brand`). Serves the registry at `/r/*.json` |
| `packages/typescript-config` | Shared tsconfig                                                           |

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
