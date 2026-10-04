"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    pencil: "write" | "wiggle" | "tap"
  }
}

/** 2 colors: body (primary), tip and the line it writes (accent). */
export const Pencil = createAnimatedIcon({
  name: "pencil",
  category: "actions",
  keywords: ["edit", "write", "draw", "compose", "rename", "modify", "pen"],
  slots: { primary: "body", accent: "tip + written line" },
  defaultVariant: "write",
  variants: {
    // the tip glides right, drawing a short line under itself; the pencil lifts off and slides
    // back as the line fades (2.5px: its far corner stays inside the frame)
    write: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pencil]",
            { x: [0, 2.5, 2.5, 0], y: [0, 0, -1.5, 0] },
            { duration: seconds, times: [0, 0.5, 0.65, 1], ease: "easeInOut" },
          ),
          // hidden until it has length: a square cap paints a dot at pathLength 0
          animate(
            "[data-part=line]",
            { opacity: [0, 0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.04, 0.05, 0.6, 0.9] },
          ),
          animate(
            "[data-part=line]",
            { pathLength: [0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.04, 0.5, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the tip stays planted and the pencil waggles about it
    wiggle: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=pencil]", { rotate: [0, -7, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // two taps along its own axis, the second lighter
    tap: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pencil]",
          { x: [0, 1.5, 0, 1, 0], y: [0, -1.5, 0, -1, 0] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the stroke the tip leaves behind: only exists in motion */}
      <path data-part="line" d="M4 21h2.5" stroke={slot.accent} style={flash("0% 50%")} />
      {/* pivots on the point of the tip, bottom-left */}
      <g data-part="pencil" style={pivot("0% 100%")}>
        {/* a 45° body: square end, ferrule band, then the sharpened cone */}
        <path d="M6 14 16 4l4 4-10 10z" />
        <path d="M13 7l4 4" />
        <path d="M6 14l-2 6 6-2" stroke={slot.accent} />
      </g>
    </>
  ),
})
