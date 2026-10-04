"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sidebar: "toggle" | "resize"
  }
}

/** 3 colors: window frame (primary), panel edge (secondary), toggle chevron (accent). */
export const SidebarIcon = createAnimatedIcon({
  name: "sidebar",
  category: "layout",
  keywords: ["panel", "drawer", "side panel", "navigation", "collapse", "expand", "layout"],
  slots: { primary: "window frame", secondary: "panel edge", accent: "toggle chevron" },
  defaultVariant: "toggle",
  variants: {
    // the panel slides shut against the left edge while the chevron turns to point "open", then the
    // panel slides back out and the chevron turns back
    toggle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=edge]",
            { x: [0, -4, -4, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: ["easeInOut", "linear", ease.out] },
          ),
          animate(
            "[data-part=chevron]",
            { scaleX: [1, -1, -1, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.9], ease: "easeInOut" },
          ),
        ]),
    },
    // the panel edge is dragged wider and springs back; the chevron is pushed along, never crossed
    resize: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=edge]",
            { x: [0, 3, -1, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=chevron]",
            { x: [0, 2, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <path data-part="edge" d="M9 4v16" stroke={slot.secondary} />
      {/* centred in the main area, pointing at the panel: "collapse" */}
      <path data-part="chevron" d="M16.5 9l-3 3 3 3" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
