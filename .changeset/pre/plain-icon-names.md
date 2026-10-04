---
"@kovenlabs/animated-icons": minor
---

Icons are now exported by their plain name: `import { Bell } from "@kovenlabs/animated-icons"` and
`<Bell />` (was `BellIcon`). The package root still exports every icon with the `Icon` suffix as an alias
(`BellIcon === Bell`), for names that collide with something else in your code, like shadcn/ui's
`Calendar` or next/link's `Link`; existing imports keep working. Files added with the shadcn registry
export the plain name.
