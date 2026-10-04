---
"@kovenlabs/animated-icons": minor
---

70 new icons (207 in total), each with 2–3 animation variants, and a new `education` category:

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
