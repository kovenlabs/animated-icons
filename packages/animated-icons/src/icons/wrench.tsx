"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    wrench: "turn" | "wiggle"
  }
}

/**
 * An open-end spanner drawn lying flat (handle left, jaw opening right) and laid on the diagonal, so the
 * jaw points up-right. Its box is 2..20 × 7.5..16.5; the nut the jaw grips sits at (18, 12), 90% 50%.
 */
const WRENCH = "M2 10h8l2.5-2.5H20v2h-4v5h4v2h-7.5L10 14H2Z"

/** 1 color: wrench (primary). */
export const Wrench = createAnimatedIcon({
  name: "wrench",
  category: "development",
  keywords: ["tool", "repair", "fix", "spanner", "maintenance", "configure", "service"],
  slots: { primary: "wrench" },
  defaultVariant: "turn",
  variants: {
    // two ratchet strokes around the nut in its jaw, tightening it
    turn: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=wrench]",
          { rotate: [0, 14, 0, 14, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // worked side to side about its middle, feeling for a stuck nut
    wiggle: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=wrench-body]",
          { rotate: [0, -10, 8, -5, 3, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g transform="rotate(-45 12 12)">
      <g data-part="wrench-body" style={pivot("50% 50%")}>
        <path data-part="wrench" d={WRENCH} style={pivot("90% 50%")} />
      </g>
    </g>
  ),
})
