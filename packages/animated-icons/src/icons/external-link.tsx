"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "external-link": "nudge" | "launch"
  }
}

/** 2 colors: box (primary), arrow (accent). */
export const ExternalLink = createAnimatedIcon({
  name: "external-link",
  category: "navigation",
  keywords: ["open in new tab", "new window", "link out", "external", "leave site", "popout"],
  slots: { primary: "box", accent: "arrow" },
  defaultVariant: "nudge",
  variants: {
    // a short push out of the open corner that settles back; it only ever moves away from the box
    nudge: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 2, -0.5, 0], y: [0, -2, 0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // flies out through the top-right edge, then grows back out of its tail inside the box. It never
    // re-enters from the bottom-left: that path would cross the box stroke.
    launch: {
      clip: true,
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 7, 0, 0], y: [0, -7, 0, 0], scale: [1, 1, 0, 1], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.4, 0.45, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the top-right corner stays open for the arrow to leave through */}
      <path data-part="box" d="M10 6H3v15h15v-7" />
      {/* pivots on its tail, inside the box */}
      <g data-part="arrow" stroke={slot.accent} style={pivot("0% 100%")}>
        <path d="M10 14 20 4" />
        <path d="M14 3h7v7" />
      </g>
    </>
  ),
})
