<p align="center">
  <img src="https://raw.githubusercontent.com/kovenlabs/animated-icons/main/apps/web/public/logo.svg" alt="Animated Icons" width="88" height="88" />
</p>

# @kovenlabs/animated-icons

> **Alpha.** The API can still change between `0.x` releases. Feedback and bug reports are very welcome.

Animated React icons with one to three color slots that read from your shadcn/ui theme. Every icon has its own
animations, and you can configure them globally, per subtree or per instance.

```tsx
import { Bell } from "@kovenlabs/animated-icons"

<Bell />                                       // theme colors, plays on hover
<Bell variant="shake" trigger="auto" />        // its own variants, typed per icon
<Bell colors={{ accent: "destructive" }} />    // a token name or any CSS color
<Bell corners="sharp" />                       // round (default), bevel or sharp geometry
<Bell trigger="none" />                        // static
```

## Install

```bash
pnpm add @kovenlabs/animated-icons@alpha motion
```

Then add the three color slots to your CSS (they fall back to `currentColor` without them):

```css
:root {
  --icon-primary: var(--foreground);
  --icon-secondary: var(--muted-foreground);
  --icon-accent: var(--primary);
}
```

Prefer owning the source? Every icon is also in a shadcn registry: `npx shadcn add @kovenlabs/bell`, or the whole
set with `@kovenlabs/all`. The docs compare all the ways in: https://animated-icons-nu.vercel.app/docs/installation

## Highlights

- **Your theme's colors.** Three slots, read from CSS variables. Give one color and it paints the whole icon.
- **Per-icon variants.** A bell rings, shakes or jumps. Variant names are type-checked.
- **Five triggers, plus `none`.** Hover, click, auto, in view, manual (through a ref), or static.
- **Interruptible.** Re-trigger mid-animation and it continues from where it is, with no snap.
- **Corners as a prop.** The geometry itself is rounded, beveled or kept sharp, at any radius.
- **Tree-shaken, styling-agnostic.** Import one icon, ship one icon. No Tailwind or CSS framework required.
- **Reduced motion respected** by default.

Requires React 19 and `motion` 13.

## Links

- Docs and catalog: https://animated-icons-nu.vercel.app
- Issues: https://github.com/kovenlabs/animated-icons/issues

MIT
