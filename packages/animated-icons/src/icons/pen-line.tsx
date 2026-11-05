"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "pen-line": "write" | "wiggle" | "tap"
  }
}

/** 2 colors: pen (primary), written line (accent). */
export const PenLine = createAnimatedIcon({
  name: "pen-line",
  family: "pen",
  category: "actions",
  keywords: ["edit", "write", "compose", "sign", "rename", "modify", "pen", "annotate"],
  slots: { primary: "pen", accent: "written line" },
  defaultVariant: "write",
  variants: {
    // the line fades and is written again left to right while the pen glides along with it and
    // lifts back (1.5px: its far corner stays inside the frame)
    write: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pen]",
            { x: [0, 1.5, 1.5, 0], y: [0, 0, -1, 0] },
            { duration: seconds, times: [0, 0.6, 0.75, 1], ease: "easeInOut" },
          ),
          // hidden until it has length: a square cap paints a dot at pathLength 0
          animate(
            "[data-part=line]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.2, 0.21, 1] },
          ),
          animate(
            "[data-part=line]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.19, 0.2, 0.6, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the nib stays planted and the pen waggles about it
    wiggle: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=pen]", { rotate: [0, -7, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // two taps along its own axis, the second lighter
    tap: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pen]",
          { x: [0, 1.5, 0, 1, 0], y: [0, -1.5, 0, -1, 0] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the line it has written, along the foot of the frame, 2+ clear of the pen */}
      <path data-part="line" d="M13 21h8" stroke={slot.accent} style={pivot("0% 50%")} />
      {/* pivots on the nib, bottom-left */}
      <g data-part="pen" style={pivot("0% 100%")}>
        {/* pencil's 45° body drawn longer, corner to corner like Lucide's pen: a square end, then the nib */}
        <path d="M5 15 17 3l4 4L9 19z" />
        <path d="M5 15l-2 6 6-2" />
      </g>
    </>
  ),
})
