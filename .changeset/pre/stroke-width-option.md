---
"@kovenlabs/animated-icons": minor
---

`strokeWidth` is now a setting like `size`: set it globally in `config.ts`, per subtree on `<AnimatedIconsProvider>`, per icon under `icons`, or on the instance. It's in 24-grid units (default `2`), and variants receive it as `strokeWidth`, so `bold` thickens relative to your weight.
