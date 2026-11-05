"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    clipboard: "clip" | "tilt" | "drop"
  }
}

/** 2 colors: board (primary), clip (accent). */
export const Clipboard = createAnimatedIcon({
  name: "clipboard",
  category: "files",
  keywords: ["copy", "paste", "clipboard", "board", "notes", "form", "document"],
  slots: { primary: "board", accent: "clip" },
  defaultVariant: "clip",
  variants: {
    // the clip lifts off the board and snaps back down on it
    clip: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clip]",
          { y: [0, -1.5, 0.5, 0], scaleY: [1, 1, 0.85, 1] },
          { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // held up and turned for a look, then set back square (8°, so the wide board's corner stays in frame)
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=board]",
          { rotate: [0, -8, -8, 3, 0], y: [0, -1.5, -1.5, 0, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
    // set down from a small height: the board lands with a squash
    drop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=board]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.03, 0.95, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <g data-part="board" style={pivot("50% 100%")}>
      {/* clipboard-list's board: its top edge stops at the clip on either side */}
      <path d="M8 4H4v18h16V4h-4" />
      <path data-part="clip" d="M8 2h8v4H8z" stroke={slot.accent} style={pivot("50% 100%")} />
    </g>
  ),
})
