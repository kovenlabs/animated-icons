"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    archive: "open" | "drop" | "rattle"
  }
}

/** 2 colors: box (primary), lid and handle (accent). */
export const Archive = createAnimatedIcon({
  name: "archive",
  category: "files",
  keywords: ["archive box", "storage", "backup", "archived", "store away", "records", "box", "save for later"],
  slots: { primary: "box", accent: "lid + handle" },
  defaultVariant: "open",
  variants: {
    // the lid lifts and tips back on its left corner, holds, then drops shut
    open: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=lid]",
          { y: [0, -2, -2, 0], rotate: [0, -6, -6, 0] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // set down from a small height: the box lands with a squash
    drop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=archive]",
          { y: [0, -3, 0, 0], scaleY: [1, 1.03, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
    // the box is shaken side to side and the loose lid bounces on top
    rattle: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=archive]", { x: [0, -1, 1, -1, 1, 0] }, { duration: seconds, ease: "linear" }),
          animate(
            "[data-part=lid]",
            { y: [0, -1.5, 0, -1, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="archive" style={pivot("50% 100%")}>
      {/* the box, open on top: the lid's bottom edge closes it */}
      <path d="M4 9v12h16V9" />
      {/* a hand-hold cut-out, 2 below the lid */}
      <path d="M10 13h4" stroke={slot.accent} />
      {/* the lid overhangs the box by 2 each side; it hinges on its bottom-left corner */}
      <path data-part="lid" d="M2 4h20v5H2z" stroke={slot.accent} style={pivot("0% 100%")} />
    </g>
  ),
})
