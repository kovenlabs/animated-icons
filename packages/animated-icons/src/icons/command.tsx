"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    command: "flip" | "press" | "draw"
  }
}

/**
 * The ⌘ glyph in one continuous stroke: two uprights and two crossbars that cross into a square, each
 * running into a loop at a corner. The loops are round by nature, so they are true arcs; the stroke meets
 * every loop on its tangent, so the glyph has no corners to round.
 */
const GLYPH =
  "M9 18.5V5.5A3.5 3.5 0 1 0 5.5 9H18.5A3.5 3.5 0 1 0 15 5.5V18.5A3.5 3.5 0 1 0 18.5 15H5.5A3.5 3.5 0 1 0 9 18.5Z"

/** 1 color. */
export const Command = createAnimatedIcon({
  name: "command",
  category: "development",
  keywords: ["cmd", "command key", "keyboard shortcut", "hotkey", "mac", "modifier", "apple key", "shortcut"],
  slots: { primary: "glyph" },
  defaultVariant: "flip",
  variants: {
    // the glyph turns a full circle about its vertical axis, swelling as it stands edge-on, and pops
    // as it comes back round to face you
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glyph]",
            { scaleX: [1, 0, -1, 0, 1], scaleY: [1, 1.15, 1, 1.15, 1] },
            { duration: seconds * 0.8, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=key]",
            { scale: [1, 1, 1.15, 1] },
            { duration: seconds, times: [0, 0.7, 0.85, 1], ease: ["linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // pressed like a key: it sinks away from you, then springs back up past rest and settles
    press: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=key]",
          { scale: [1, 0.75, 1.18, 0.96, 1] },
          { duration: seconds, times: [0, 0.25, 0.55, 0.78, 1], ease: [ease.out, ease.out, "easeInOut", "easeInOut"] },
        ),
    },
    // traced in one stroke, loop by loop, the way you would write it
    draw: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glyph-line]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.08, 0.12, 1], ease: ["linear", "linear", "easeInOut"] },
          ),
          // hidden while it's too short to read, so its cap never shows as a dot
          animate(
            "[data-part=glyph-line]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.08, 0.13, 0.15, 1], ease: "linear" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="key" style={pivot("50% 50%")}>
      <g data-part="glyph" style={pivot("50% 50%")}>
        <path data-part="glyph-line" d={GLYPH} />
      </g>
    </g>
  ),
})
