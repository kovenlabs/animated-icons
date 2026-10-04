"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    upload: "lift" | "nudge" | "draw"
  }
}

/** 2 colors: tray (primary), arrow (accent). */
export const Upload = createAnimatedIcon({
  name: "upload",
  category: "actions",
  keywords: ["send", "import", "publish", "share", "arrow up", "attach"],
  slots: { primary: "tray", accent: "arrow" },
  defaultVariant: "lift",
  variants: {
    // the arrow leaves through the top of the frame, then rises back in from inside the tray (never
    // through its floor); the tray dips as it pushes off
    lift: {
      clip: true,
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arrow]",
            { y: [0, -7, 5, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.4, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=tray]",
            { y: [0, 1.5, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.45, 1], ease: "easeOut" },
          ),
        ]),
    },
    // an upward nudge that settles with a small bounce
    nudge: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, -3, 0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the arrow sinks into its tail and grows back up, head and shaft as one piece
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
      {/* download's tray, with its arrow turned around */}
      <path data-part="tray" d="M3 15v6h18v-6" />
      <g data-part="arrow" stroke={slot.accent} style={pivot("50% 100%")}>
        <path d="M12 15V4" />
        <path d="M7 8l5-5 5 5" />
      </g>
    </>
  ),
})
