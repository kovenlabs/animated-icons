# @kovenlabs/animated-icons

## 0.1.0-alpha.3

### Minor Changes

- 80e0870: Ship `catalog.json` (`@kovenlabs/animated-icons/catalog.json`): every icon's name, component, category, keywords, color slots, variants and family, for agents and tooling to search. The `find-animated-icon` skill (`npx skills add kovenlabs/animated-icons --skill find-animated-icon`) uses it to pick an icon, a variant and a trigger for a use case. Registry item descriptions no longer include source code from earlier comments in the icon file.

## 0.1.0-alpha.2

### Minor Changes

- 9a36d47: Icons are now exported by their plain name: `import { Bell } from "@kovenlabs/animated-icons"` and
  `<Bell />` (was `BellIcon`). The package root still exports every icon with the `Icon` suffix as an alias
  (`BellIcon === Bell`), for names that collide with something else in your code, like shadcn/ui's
  `Calendar` or next/link's `Link`; existing imports keep working. Files added with the shadcn registry
  export the plain name.
- 7db1b80: 70 new icons (207 in total), each with 2–3 animation variants, and a new `education` category:
  
  - School and scheduling: `graduation-cap`, `school`, `book-open`, `book-open-check`, `notebook`, `library`, `flask`, `bus`, `building`, `door-open`, `armchair`, `calendar-check`, `calendar-clock`, `calendar-cog`, `calendar-off`, `calendar-range`, `clipboard-check`, `clipboard-list`, `clipboard-pen`, `gantt-chart`, `history`, `route`
  - Status: `info`, `circle`, `circle-alert`, `circle-check`, `circle-dot`, `circle-plus`, `circle-slash`, `circle-x`, `check-check`, `badge-check`, `file-warning`
  - Arrows: `arrow-up`, `arrow-down`, `arrow-left`, `arrow-down-up`, `arrow-right-left`, `chevron-up`, `chevron-left`, `chevron-right`, `chevrons-left`, `chevrons-right`, `chevrons-up-down`, `repeat`, `undo`, `reply`
  - Interface: `minus`, `ellipsis`, `grip-vertical`, `maximize`, `sliders`, `table`, `hash`, `pin`, `pin-off`, `paperclip`, `eye-off`, `message-off`, `languages`, `pipette`, `scale`, `bot`
  - Files and goods: `file-archive`, `file-audio`, `file-code`, `file-cog`, `file-video`, `package`, `boxes`
  
  They join the `arrow`, `calendar`, `check`, `circle`, `clipboard`, `eye`, `file` and `message` families, and start
  `chevron` (with `chevron-down` and the `chevrons-*`), `book` and `pin`.
  
  `size` is now a global setting: set it in `config.ts`, on `<AnimatedIconsProvider size={20}>`, or per icon
  (`icons: { bell: { size: 16 } }`). It takes px or any CSS length; the `size` prop still wins, and a CSS size such
  as `className="size-6"` overrides it either way. A blank, negative or non-finite size is ignored.

## 0.1.0-alpha.1

### Minor Changes

- ea02ff0: 67 new icons (137 in total) and 10 new categories: charts, design, development, finance, gaming,
  layout, nature, social, text and transport. Among them `bar-chart`, `line-chart`, `pie-chart`, `gauge`,
  `code`, `terminal`, `git-branch`, `bug`, `cpu`, `server`, `database`, `palette`, `brush`, `layers`,
  `scissors`, `car`, `plane`, `ship`, `globe`, `compass`, `leaf`, `flame`, `snowflake`, `umbrella`,
  `wallet`, `coins`, `piggy-bank`, `receipt`, `trophy`, `thumbs-up`, `music`, `headphones` and
  `gamepad`, each with 2–3 animation variants. Related shapes are linked into families (`trending`,
  `git`, `arrow`, and `cloud-lightning` joins `cloud`).

### Patch Changes

- d584bfd: `FilterIcon` `drip` is easier to see: the funnel gives a small squeeze and the drop falls out through the bottom of the icon (the variant now clips to the 24px box) before a new one swells at the spout.

## 0.1.0-alpha.0

### Minor Changes

- First alpha: 70 animated icons with 1–3 theme color slots and per-icon variants; triggers (hover, click, auto, inView, manual, none); global, scoped and per-instance configuration; round, bevel and sharp corner geometry; interruptible playback; a shadcn registry (per icon or `@kovenlabs/all`).
