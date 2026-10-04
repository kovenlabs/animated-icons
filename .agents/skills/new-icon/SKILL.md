---
name: new-icon
description: Add one or more animated icons to @kovenlabs/animated-icons (packages/animated-icons/src/icons). Use when asked to add, draw, or create a new icon or a batch of icons, or to add a variant to an existing icon. Covers naming, family, category, drawing in the house style, color slots, motion variants, the guard tests, the browser motion check, registry generation and the changeset.
---

# Adding an icon

Every icon is one file, `packages/animated-icons/src/icons/<name>.tsx`. Nothing else needs wiring: the
guard test, the barrel, the registry and the site's catalog all discover icon files by themselves.
`packages/animated-icons/STYLE.md` is the authority on how an icon looks and moves; read it in full
before drawing. This skill is the process around it.

## 1. Decide what you are adding
- **Check it doesn't exist.** `ls packages/animated-icons/src/icons/`. A new motion for an existing
  object is a new *variant* of that icon, not a new icon.
- **Name** in kebab-case after the object, the way people search for it (`piggy-bank`, `cloud-lightning`).
  Put the base object first so it lands in its family: `file-search`, not `search-file`.
- **Family.** If the name extends another icon's name (`bell-off` → `bell`) or shares its first segment
  with another icon (`git-branch`, `git-merge`, `trending-up`), set `family` to that segment; also add
  `family` to the existing sibling if it is missing. The guard test fails on unlinked siblings.
- **Category.** Use the closest `IconCategory` in `src/lib/types.ts`. Add a new category only for a
  group of several icons.
- **Inspiration.** `lucide-react` is installed (`node_modules/.pnpm/lucide-react@*/node_modules/lucide-react/dist/esm/icons/<name>.mjs`):
  use it for *what* to draw and the recognizable silhouette, then redraw in our style. Never copy its
  paths (curvy Béziers break "draw sharp") and never import it.

## 2. Draw it (STYLE.md → Drawing, Color slots)
- 24×24, inside 2..22, straight segments with sharp corners (the factory rounds them at render). No
  `rx`/`ry`, no `strokeLinecap`/`strokeLinejoin` on parts, true arcs only for genuinely round objects.
  Nothing smaller than 2px, no gap narrower than 2px.
- Slots: `primary` = body; `accent` = the moving or meaningful part; `secondary` only for a real third
  role. Mostly 2 colors; 1 is fine for line icons; 3 must earn it. Fills (`fill={slot.x}` +
  `stroke="none"`) for solid accents only.
- Every animated element gets a `data-part`. Reuse `src/lib/motion.ts` (`slot`, `pivot`, `flash`,
  `blink`, `ease`, `radial`) and `src/lib/parts.ts` (`bubble`, `dots`, `BADGE`, `badgeGlyph`, `SLASH`).

## 3. Animate it (STYLE.md → Motion)
- 2–3 variants, each a distinct idea that suits the object (ring vs shake vs jump), with a one-line
  comment above it saying what happens. One meaningful moving part per variant.
- Calm amplitudes (swing ≈ ±14°, hop 2–3px, pop 1.05–1.2), 400–900ms (loops ≤ ~1400ms), `easeInOut` /
  `easeOut`, `ease.overshoot` only for landings.
- **Every keyframe track ends at rest.** Motion-only accents use `flash()` and end invisible.
- **Animate transforms and opacity only** (`x`, `y`, `scale`, `scaleX/Y`, `rotate`, `skewX`, `opacity`,
  `pathLength`). Never tween `d`, `points` or other geometry: the factory rounds geometry at render,
  and a geometry tween would snap back to sharp corners mid-animation.
- A part that travels 5px or more declares `clip` on its variant (`true` when it exits the frame like
  through a window, `false` when it stays inside). Never pass a part through another part's stroke;
  parts that join at rest move together.
- **Visible at 40px.** CI fails any variant that changes fewer than ~25 pixels at 40px (single color).
  A 1–2px nudge of a 2px dot is not enough.
- `pathLength` draws need the dot hidden at length 0 (see `check.tsx` `draw`).

## 4. File shape
Copy the structure of a neighbour (`bell.tsx`, `filter.tsx`, `hourglass.tsx`):
`"use client"`; the `declare module "../lib/types"` `IconVariants` augmentation with the variant names;
a doc comment `/** N colors: body (primary), … (accent). */`; one export
`<PascalName>Icon = createAnimatedIcon({ name, family?, category, keywords (6–8 real search terms),
slots, defaultVariant, defaults?, variants, render })`.

## 5. Check it
From `packages/animated-icons`:
```bash
pnpm vitest run tests/icons.test.tsx -t "<name>"   # guard test: metadata, house style, corners, rest, clip, family
pnpm exec tsc --noEmit -p .
node scripts/generate.mjs                           # barrel (src/icons/index.ts) + registry.json
```
From the repo root:
```bash
pnpm turbo run lint typecheck test build
pnpm --filter web e2e                               # plays every variant in Chromium, fails if one doesn't visibly move
```
Then **look at it**: run the site (`pnpm --filter web dev`), open `/icons`, check the icon at 16, 24
and 40px in round, bevel and sharp corners, and play every variant. Fix anything cramped, off-grid,
unreadable small, or too subtle.

When several agents add icons at once: write each file in one complete write (every test run imports
all icon files), test only your own icons with `-t`, and leave `generate.mjs`, the barrel and the
registry to whoever integrates.

## 6. Ship it
- `pnpm changeset`: `minor` for new icons, `patch` for a fix to an existing one. Describe it from a
  user's point of view.
- Commit the icon files, the regenerated `src/icons/index.ts` and `registry.json`, and the changeset.
- CI (`check` + `motion`) must pass; the release job then updates the "Version packages" PR.
