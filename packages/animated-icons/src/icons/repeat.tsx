"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    repeat: "cycle" | "spin" | "pop"
  }
}

/** 1 color: two square-cornered arrows looping round each other. */
export const Repeat = createAnimatedIcon({
  name: "repeat",
  category: "actions",
  keywords: ["loop", "cycle", "recurring", "again", "replay", "repeat all", "rotate"],
  slots: { primary: "arrows" },
  defaultVariant: "cycle",
  variants: {
    // each arrow pushes forward along its own track, top to the right and bottom to the left, then back
    cycle: {
      duration: 600,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=top]", { x: [0, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=bottom]", { x: [0, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the loop turns a full circle on its centre and lands
    spin: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=arrows]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // swells once from the middle and settles
    pop: {
      duration: 450,
      run: ({ animate, seconds }) =>
        animate("[data-part=arrows]", { scale: [1, 1.08, 0.98, 1] }, { duration: seconds, ease: ease.out }),
    },
  },
  render: () => (
    <g data-part="arrows" style={pivot("50% 50%")}>
      {/* each arrow is an L-shaped track ending 0.5 short of a right-angled head, whose miter makes the point */}
      <g data-part="top">
        <path d="M3 11V6h16.5" />
        <path d="M16 2l4 4-4 4" />
      </g>
      <g data-part="bottom">
        <path d="M21 13v5H4.5" />
        <path d="M8 22l-4-4 4-4" />
      </g>
    </g>
  ),
})
