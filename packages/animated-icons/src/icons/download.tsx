"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    download: "drop" | "nudge" | "draw"
  }
}

/** 2 colors: tray (primary), arrow (accent). */
export const Download = createAnimatedIcon({
  name: "download",
  category: "actions",
  keywords: ["save", "export", "fetch", "get", "arrow down", "install"],
  slots: { primary: "tray", accent: "arrow" },
  defaultVariant: "drop",
  variants: {
    // the arrow sinks to the tray floor (never through it), drops back in from the top edge; the tray takes the weight
    drop: {
      clip: true,
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arrow]",
            { y: [0, 5, -7, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.4, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=tray]",
            { y: [0, 1.5, 0, 0] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a downward nudge that settles with a small bounce
    nudge: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, 3, -0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the arrow retracts up into its tail and grows back down, head and shaft as one piece
    // (hidden at zero, so the square cap never leaves a stray dot)
    draw: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { scaleY: [1, 0, 1], opacity: [1, 0, 1] },
          { duration: seconds, times: [0, 0.4, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <path data-part="tray" d="M3 15v6h18v-6" />
      <g data-part="arrow" stroke={slot.accent} style={pivot("50% 0%")}>
        <path d="M12 3v11" />
        <path d="M7 10l5 5 5-5" />
      </g>
    </>
  ),
})
