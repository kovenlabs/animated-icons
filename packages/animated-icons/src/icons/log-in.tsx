"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "log-in": "enter" | "nudge"
  }
}

/** 2 colors: door frame (primary), arrow (accent). */
export const LogIn = createAnimatedIcon({
  name: "log-in",
  family: "log",
  category: "navigation",
  keywords: ["sign in", "login", "enter", "authenticate", "join", "access", "account"],
  slots: { primary: "door frame", accent: "arrow" },
  defaultVariant: "enter",
  variants: {
    // the arrow steps into the doorway and fades, then a fresh one slides in from the left edge;
    // even at its deepest the point stays 1px clear of the frame's back wall
    enter: {
      clip: true,
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 3, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.4, 0.5, 1], ease: "easeInOut" },
        ),
    },
    // knocks at the door twice, the second time softer; head and shaft move as one piece
    nudge: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 2.5, 0, 1.2, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* log-out's door frame, mirrored: open on the left, the arrow points into it */}
      <path d="M14 3h6v18h-6" />
      <g data-part="arrow" stroke={slot.accent} style={pivot("50% 50%")}>
        <path d="M4 12h10" />
        {/* a right-angled chevron: its miter makes the point, right at the doorway */}
        <path d="M9.5 7.5l4.5 4.5-4.5 4.5" />
      </g>
    </>
  ),
})
