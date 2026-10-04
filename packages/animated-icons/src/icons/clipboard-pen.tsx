"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "clipboard-pen": "write" | "clip" | "tilt"
  }
}

/** 2 colors: board and clip (primary), pen (accent). */
export const ClipboardPen = createAnimatedIcon({
  name: "clipboard-pen",
  family: "clipboard",
  category: "files",
  keywords: ["edit form", "fill in", "survey", "sign", "write", "questionnaire", "notes", "exam"],
  slots: { primary: "board + clip", accent: "pen" },
  defaultVariant: "write",
  variants: {
    // the pen scribbles a short line across the corner of the board, pivoting on its nib
    write: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pen]",
          { x: [0, 1, -0.5, 1, 0], y: [0, -1, 0.5, -1, 0], rotate: [0, 3, -2, 3, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
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
    // held up and turned for a look, then set back square
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=board]",
          { rotate: [0, -10, -10, 3, 0], y: [0, -1.5, -1.5, 0, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="board" style={pivot("50% 100%")}>
      {/* clipboard-check's board, opened at the bottom-left: the left edge stops at y 10 and the bottom
          edge at x 13, each 2px clear of the pen */}
      <path d="M8 4H5v6" />
      <path d="M16 4h3v18h-6" />
      <path data-part="clip" d="M8 2h8v4H8z" style={pivot("50% 100%")} />
      {/* pencil's pen at a smaller scale, lying at 45° across the open corner with its nib out past it:
          a square end, a ferrule band, then the sharpened nib. It pivots on the nib */}
      <g data-part="pen" stroke={slot.accent} style={pivot("0% 100%")}>
        <path d="M5 17l6-6 3 3-6 6z" />
        <path d="M8 14l3 3" />
        <path d="M5 17l-1 4 4-1" />
      </g>
    </g>
  ),
})
