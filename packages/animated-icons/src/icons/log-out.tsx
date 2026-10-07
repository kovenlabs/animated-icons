"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "log-out": "leave" | "nudge"
  }
}

/** 2 colors: door frame (primary), arrow (accent). */
export const LogOut = createAnimatedIcon({
  name: "log-out",
  family: "log",
  category: "navigation",
  keywords: ["sign out", "logout", "exit", "leave", "quit", "disconnect"],
  slots: { primary: "door frame", accent: "arrow" },
  defaultVariant: "leave",
  variants: {
    // the arrow slips out to the right, then steps back out of the doorway from just inside it: its
    // tail stays 2px clear of the frame's back wall, so it never crosses a stroke
    leave: {
      clip: true,
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, 7, -2, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // knocks toward the exit twice, the second time softer; head and shaft move as one piece
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
      {/* the door frame, open on the right: the arrow leaves through the gap between its arms */}
      <path d="M10 3H4v18h6" />
      <g data-part="arrow" stroke={slot.accent} style={pivot("50% 50%")}>
        <path d="M10 12h10" />
        {/* a right-angled chevron: its miter makes the point, just past the shaft's end */}
        <path d="M16 7.5l4.5 4.5-4.5 4.5" />
      </g>
    </>
  ),
})
