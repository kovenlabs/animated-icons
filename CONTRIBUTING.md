# Contributing

Thanks for helping. Most contributions are new icons or new variants, and this guide is mostly about
those. Bug fixes, docs and site improvements are welcome too: open an issue first for anything large.

## Setup

Requirements: Node 24 and pnpm 10.

```bash
git clone https://github.com/kovenlabs/animated-icons.git
cd animated-icons
pnpm install
pnpm --filter web dev          # the site: landing, /icons catalog, /docs
```

| Path | What's there |
| --- | --- |
| `packages/animated-icons` | the library: `src/icons/*.tsx` (one file per icon), `src/lib/` (factory, motion helpers), tests |
| `packages/animated-icons/STYLE.md` | **the icon style guide**: how icons are drawn and how they move |
| `apps/web` | the site (Next.js + Fumadocs): catalog, docs, shadcn registry, the browser motion test |

## Adding an icon

One icon is one file, `packages/animated-icons/src/icons/<name>.tsx`. The tests, the package exports,
the shadcn registry and the catalog all pick it up automatically.

1. **Read [`STYLE.md`](packages/animated-icons/STYLE.md)** in full. It's short, and every rule in it is
   either checked by the tests or reviewed by hand.
2. **Check it doesn't exist.** A new motion for an object we already have is a new variant of that
   icon, not a new icon.
3. **Name and group it.**
   - kebab-case, after the object (`piggy-bank`), base object first (`file-search`, not `search-file`).
   - `family`: set it when the name extends another icon's (`bell-off` → `bell`) or shares its first
     segment with another icon (`git-branch`, `git-merge`). The tests fail on unlinked siblings.
   - `category`: the closest existing one in `src/lib/types.ts`.
   - `keywords`: 6–8 real search terms.
4. **Draw it** on the 24px grid with straight segments and sharp corners. The library rounds corners
   at render time, so never hand-round them (no `rx`/`ry`, no curves standing in for corners). Pick
   slots: `primary` for the body, `accent` for the part that moves or means something, `secondary`
   only for a real third role.
5. **Animate it.** Give it 2–3 variants, each a different idea, and keep them calm. Animate only
   transforms and opacity, and end every track at rest. A part that travels 5px or more needs `clip`.
   The motion has to be visible at 40px: check it by eye, a variant that barely moves gets sent back.
6. **Copy the file structure** of a neighbour like `bell.tsx` or `filter.tsx`: `"use client"`, the
   `IconVariants` declaration, a `/** N colors: … */` comment, and one `createAnimatedIcon({ … })`
   export named `<PascalName>` (the package adds a `<PascalName>Icon` alias by itself).

[Lucide](https://lucide.dev) is a good reference for what an object should look like, but redraw it.
Don't copy its paths: they're curve-based, and ours are drawn from straight segments.

## Checking your work

```bash
cd packages/animated-icons
pnpm vitest run tests/icons.test.tsx -t "<name>"   # house style, metadata, corners, rest pose, clip, family
node scripts/generate.mjs                           # updates src/icons/index.ts, registry.json and catalog.json

cd ../..
pnpm turbo run lint typecheck test build
```

Then look at it. Open `/icons` on the dev site and check your icon at 16, 24 and 40px. Try round,
bevel and sharp corners, and play every variant. Icons that pass the tests but look off at small sizes
will get review comments.

## Pull requests

- Run `pnpm changeset`. Choose `minor` for new icons and `patch` for fixes, and describe the change
  for users. Commit the generated file.
- Commit the icon file(s) with the regenerated `src/icons/index.ts`, `registry.json` and `catalog.json`.
- Use [Conventional Commits](https://www.conventionalcommits.org) messages (`feat(icons): add piggy-bank`).
- CI runs lint, typecheck, unit tests, build and package checks. It must be
  green to merge. Releases are automated after merge, see [`RELEASING.md`](RELEASING.md).

## AI agents

If you're using an AI coding agent, the same checklist is packaged as the `new-icon` skill in
`.agents/skills/new-icon/` (also linked from `.claude/skills/`). The agent instructions are in
`AGENTS.md`.

By contributing you agree that your work is released under the [MIT License](LICENSE).
