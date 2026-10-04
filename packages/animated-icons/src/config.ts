import type { IconConfig } from "./lib/types"

/**
 * App-wide defaults for every animated icon.
 *
 * Installed through the shadcn registry, this file lives in your codebase: edit
 * it directly. Installed from npm, pass the same shape to <AnimatedIconsProvider>
 * at your root instead.
 *
 * Colors are not here on purpose: they live in CSS (--icon-primary,
 * --icon-secondary, --icon-accent in globals.css) so they follow your theme and
 * dark mode without JavaScript.
 */
export function defineIconConfig(config: IconConfig): IconConfig {
  return config
}

export default defineIconConfig({
  trigger: "hover",
  interval: 1000,
  speed: 1,
  reducedMotion: "respect",
  // the shapes' corners: "round" (curved), "bevel" (cut) or "sharp" (as drawn)
  corners: "round",
  cornerRadius: 2,
  // the icon box: px as a number or any CSS length ("1.25em"); a className size still wins
  size: 24,
  // Per-icon overrides. They beat each icon's own defaults (the loader loops,
  // the message bubble types while in view...) and lose only to props.
  icons: {
    // bell: { variant: "shake" },
    // loader: { trigger: "hover" },
    // rocket: { speed: 0.75, colors: { accent: "chart-1" } },
  },
})
