"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "clipboard-check": "check" | "clip" | "tilt"
  }
}

/** 2 colors: board and clip (primary), check (accent). */
export const ClipboardCheck = createAnimatedIcon({
  name: "clipboard-check",
  family: "clipboard",
  category: "files",
  keywords: ["task", "done", "checklist", "todo", "complete", "attendance", "approved", "review"],
  slots: { primary: "board + clip", accent: "check" },
  defaultVariant: "check",
  variants: {
    // the check fades out and redraws from its short leg (hidden while too short to read), and the
    // board gives a small nod as it lands
    check: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=check]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=check]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.8, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=board]",
            { scale: [1, 1, 1.05, 1] },
            { duration: seconds, times: [0, 0.6, 0.8, 1], ease: "easeOut" },
          ),
        ]),
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
      {/* the board's top edge stops at the clip on either side */}
      <path d="M8 4H5v18h14V4h-3" />
      <path data-part="clip" d="M8 2h8v4H8z" style={pivot("50% 100%")} />
      <path data-part="check" d="M9 14l2 2 4-4" stroke={slot.accent} style={pivot("40% 100%")} />
    </g>
  ),
})
