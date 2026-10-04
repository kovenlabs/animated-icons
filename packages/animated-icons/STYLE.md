# Icon style guide

Icons are **drawn sharp and rendered round**: the geometry is authored from straight segments, and
the factory rounds (or bevels) every corner at render time. Every icon in the set must follow these rules; `tests/icons.test.tsx`
enforces the mechanical ones on every file in `src/icons/` automatically.

## Drawing

- **24 × 24 grid**, 2px stroke (the SVG root sets it), keep ~2px of padding: draw inside 2..22.
- **Draw sharp, render round.** Author every shape from straight segments with sharp corners. At
  render time the factory rounds each corner's geometry (`corners: "round"`, the default, with
  `cornerRadius`), or bevels it, or leaves it as drawn (`"sharp"`), and sets caps and joins to match.
  Never set `strokeLinecap` or `strokeLinejoin` on a part, or that part would ignore `corners`.
- **No hand-rounded corners.** No `rx`/`ry` on rects, no arcs used to soften a corner: rounding is
  applied for you, consistently, at whatever radius the user picks. Hand-rounded corners would round twice.
- **Polygonal first.** Build shapes from straight segments: a bell is a trapezoid, a heart is a
  faceted polygon, a dot is a small square. Use a curve only where the object itself is round (a
  loader ring, a lens), and then use a true arc or circle, not a blob.
- **Align to the grid.** Prefer integer or .5 coordinates so 2px strokes land crisply.
- Fills (`fill={slot.x}` with `stroke="none"`) are for solid accents: badges, levels, dots.
- Keep shapes legible at 16px: no detail smaller than 2px, no gaps narrower than 2px.

## Color slots

- `primary` is the main body (the SVG root strokes with it by default).
- 2-color icons use `primary` + `accent`; 3-color icons use all three. Never `primary` + `secondary` only.
- The accent marks the **moving or meaningful part**: the clapper, the badge, the level, the flame.
- Declare what each slot paints in `slots`, e.g. `{ primary: "body", accent: "clapper + waves" }`.

## Motion (calm, tiflot-level)

- One meaningful moving part per variant, plus at most a blink of accent.
- Amplitudes: swing about ±14°, hop 2–3px, nudge 2–3px, pop 1.05–1.2, slip-through out by ~7px.
- Durations 400–900ms (loops up to ~1400ms). `ease: "easeInOut"`/`"easeOut"`; `ease.overshoot` only
  for landings.
- **Every keyframe track ends at rest**, so a finished cycle leaves the icon still. It usually starts
  at rest too; an arrival (a badge popping in from `scale: 0`, a tick drawing on) may start from its
  entrance pose. Accents that only exist in motion use `style={flash()}` and the `blink` keyframes,
  and end invisible.
- **Square caps paint a dot at `pathLength: 0`.** When a stroke draws on, hide it with `opacity` until
  it starts moving (see `check.tsx` `draw`).
- Pivot with `pivot("x% y%")` relative to the part's own box (a swinging part pivots at its hinge).
- 2–3 variants per icon, each a distinct idea (ring vs shake vs hop), not the same motion at another speed.
- Animate only `[data-part=…]` selectors that exist in the drawing.
- **Never leave the frame by accident.** A part that slips out and back in (arrow `through`, mail
  `send`) sets `clip: true` on its variant, so it exits through the 24px box like through a window.
  Any variant that moves a part 5px or more must declare `clip` (`false` if it stays inside); the guard
  test enforces this. Never pass a part through another part's stroke (an item through a rim).
- **Parts that join at rest move together**, or at least never cross: a trailing part with a delay or
  an overshoot can overtake its leader and poke out (an arrow's shaft through its point). If a lag
  sells the motion, keep the follower's travel strictly inside the leader's at every moment.

## Metadata

`name` (= file name, kebab-case), `category` (see `IconCategory`), `keywords` (≥ 3 synonyms),
`slots`, `defaultVariant`, `variants`, and `defaults` only when the icon needs them to make sense
(a loader loops). Export exactly one component, named `<PascalName>` (`bell.tsx` → `Bell`). The
package barrel adds a `<PascalName>Icon` alias automatically, for users whose names collide; never
export it yourself.

- **Families link shape siblings.** An icon that extends another icon's name (`bell-off` → `bell`,
  `cloud-lightning` → `cloud`) or shares its first name segment with another icon (`git-branch`,
  `git-merge`) sets `family` to that segment; the base icon's family defaults to its own name. A plural
  joins its singular's family (`chevrons-left` → `chevron`). The
  catalog shows an icon's family together, and the guard test fails on an unlinked sibling. Name a new
  icon so it lands in the right family (`file-search`, not `search-file`); objects that only share a
  theme (`bar-chart`, `pie-chart`) are grouped by `category` instead.
- **Category.** Pick the closest existing `IconCategory`. Add a new one only for a group of several
  icons, in `src/lib/types.ts` (the catalog's filter picks it up by itself).
- **Don't duplicate.** Check `src/icons/` first: a new idea for an existing object is a new variant,
  not a new icon.
