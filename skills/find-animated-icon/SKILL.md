---
name: find-animated-icon
description: Pick the right @kovenlabs/animated-icons icon for a UI use case, then its variant (which motion), trigger (what plays it) and colors, and write the JSX. Searches the live catalog of every icon with its variants, color slots and defaults. Use when adding or choosing an icon in a project that uses (or could use) @kovenlabs/animated-icons or its shadcn registry, when the user asks "which icon for X", "animate this icon", or wants to see an icon's variants.
---

# Find an animated icon

The catalog lists every icon with its variants, color slots, keywords and family. `scripts/find-icon.mjs`
(next to this file, Node 18+, no dependencies) searches it. It reads the project's installed package
first, so it only suggests icons that version has. Without the package, it fetches the site's catalog.

```bash
node <this skill>/scripts/find-icon.mjs unread notifications   # rank icons for a use case
node <this skill>/scripts/find-icon.mjs --show bell            # variants, slots, siblings, install, JSX
node <this skill>/scripts/find-icon.mjs --source bell          # the file: what each variant does
node <this skill>/scripts/find-icon.mjs --list                 # every icon on one line, to scan by meaning
```

Run it from the project root: it finds the installed package by walking up from the working directory.
Filters: `--category <c>`, `--colors <1|2|3>`, `--limit <n>`. Add `--json` to get structured output.
`--catalog <path|url>` reads another catalog, for example when offline.

## 1. How does the project use it?

Check this before you write any import:

| You find                                                        | Import                                               | Global defaults                |
| --------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------ |
| `@kovenlabs/animated-icons` in `package.json`                   | `import { Bell } from "@kovenlabs/animated-icons"`   | `<AnimatedIconsProvider>`      |
| `components/animated-icons/icons/*.tsx` (shadcn registry)       | the same path the project already imports from, e.g. `@/components/animated-icons/icons/bell` | `components/animated-icons/config.ts` |
| neither                                                         | ask which way to install before you install anything | –                              |

With the registry, an icon that isn't in `icons/` yet needs `npx shadcn add @kovenlabs/<name>`. If
`components.json` has no `@kovenlabs` registry, use the URL that `--show` prints instead.

## 2. Pick the icon

1. Name the **object** the icon would show, not the feature: for "unread notifications", search for a bell.
   For "save for later", search for a bookmark. Search 2–3 phrasings (meaning, object, synonym).
2. Read the top hits and choose by meaning. The ranking is lexical, so the first hit is not always
   the best one. If nothing fits, scan `--list`.
3. Check the **family** line. Siblings carry the state you might need: `bell-off` for muted,
   `message-text` and `messages` for variations of `message`. Pick the sibling that matches the state.
4. Check the **colors**: if the design needs one part highlighted (a badge, a fill), choose an icon whose
   `accent` slot paints that part.

## 3. Pick the variant

Variant names describe the motion (`ring`, `shake`, `jump`). Match the motion to what the moment *means*:

| The moment means                     | Look for                                   |
| ------------------------------------ | ------------------------------------------ |
| something arrived, something is new  | `ring`, `pop`, `bounce`, `hop`, `notify`   |
| an error, a warning, "look here"     | `shake`, `wiggle`, `wobble`, `flash`       |
| success, done, saved                 | `draw`, `check`, `fill`, `stamp`, `seal`   |
| waiting, working, live               | `spin`, `pulse`, `blink`, `type`           |
| go, send, move somewhere             | `slide`, `nudge`, `through`, `send`, `launch` |
| hover affordance on a control        | `tilt`, `lift`, `press`, `turn`            |

Icons also have variants named after their own action (`upload`, `unlock`, `toggle`, `reply`). When one
of those matches the use case, it usually beats a generic motion.

When two names could fit, run `--source <name>`. Each variant has its keyframes and usually a comment
above it that says what moves. Use the default variant unless another one clearly fits better. To watch
them play, the catalog is at `<site>/icons`.

## 4. Pick the trigger

The default is `hover`, which plays one cycle per pointer enter. Choose by where the icon sits:

| Context                                                     | Use                                                              |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| Icon inside a button, link or menu item                     | `trigger="manual"` + `ref.play()` on the **parent's** `onMouseEnter`, so the whole control plays it (snippet below) |
| Standalone icon button                                      | default `hover`                                                  |
| Feedback after an action (copied, liked, saved)             | `trigger="manual"`, then call `ref.current?.play()` when the action **succeeds** (not on click, which comes before the outcome) |
| A state that needs attention (unread, recording, live)      | controlled: `animate={hasUnread}` loops while true               |
| A loader or a pending state                                 | many already loop by default (check the `defaults` line); otherwise use `trigger="auto"` |
| Marketing page, feature grid, empty state                   | `trigger="inView"`, which loops while the icon is on screen      |
| Event from elsewhere (message received, upload finished)    | `trigger="manual"` + `ref.play()` in the handler                 |
| Plays once when it appears (toast, dialog, inline error)    | `trigger="manual"` + `ref.current?.play()` in a mount effect. `auto`, `inView` and `animate` all loop |
| Dense tables, long lists, print, a "reduce motion" setting  | `trigger="none"` (static), or keep `hover`                       |

`animate` (controlled) overrides `trigger`. Use `interval` (ms, default 1000) to set the rest between loops,
and `speed`/`duration` to change the timing. `play()` returns a promise that resolves when the cycle ends.
`reducedMotion` is respected by default, so don't add your own check.

```tsx
import { Bell, type AnimatedIconHandle } from "@kovenlabs/animated-icons"

const bell = useRef<AnimatedIconHandle>(null)

<Button onMouseEnter={() => bell.current?.play()}>
  <Bell ref={bell} trigger="manual" /> Notifications
</Button>
```

## 5. Colors and size

By default, slots read the theme (`--icon-primary`, `--icon-secondary`, `--icon-accent`). Override them
per instance with a shadcn token name or any CSS color. Use the slot meanings from `--show`:

```tsx
<Bell colors={{ accent: "destructive" }} />
<Heart colors={{ accent: "#e11d48" }} />
```

Size comes from `size` (px or any CSS length) or a `className` like `size-5`, which wins. An icon is
decorative (`aria-hidden`) unless you give it an `aria-label`. Give it a label when it is the only
content of a control.

## 6. Answer

Give the icon, the variant and the trigger, each with a one-line reason tied to the use case. Then write
the JSX in the project's own import style. Name a runner-up only if it was a close call. Don't pass
props that equal a default (`variant` = the default variant, `trigger="hover"`).

Example: *"`Bell`, variant `ring` (a ring reads as 'something arrived'), controlled with
`animate={unread > 0}` so it keeps ringing until the inbox is opened. `accent: "destructive"` paints
the clapper and sound waves red."*
