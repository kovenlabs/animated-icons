"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    package: "drop" | "seal" | "rock"
  }
}

/** 2 colors: box (primary), packing tape (accent). */
export const Package = createAnimatedIcon({
  name: "package",
  category: "commerce",
  keywords: ["box", "parcel", "delivery", "shipping", "cardboard", "equipment", "inventory", "supplies"],
  slots: { primary: "box", accent: "packing tape" },
  defaultVariant: "drop",
  variants: {
    // set down from a small height: it lands with a squash
    drop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=box]",
          { y: [0, -3, 0, 0], scaleY: [1, 1.03, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
    // the tape comes off and is pressed back on across the lid and down the side, then the box gives
    // a small pop; the tape hides while it is too short to read
    seal: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tape]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=tape]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.75, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=box]",
            { scale: [1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.7, 0.85, 1], ease: "easeOut" },
          ),
        ]),
    },
    // tipped onto its bottom corner and rocked back upright
    rock: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=box]",
          { rotate: [0, -9, 6, -3, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="box" style={pivot("50% 100%")}>
      {/* a cube seen from above a corner: a hexagon, with the lid's two near edges and the front edge */}
      {/* every edge ends where it meets the others, so no line runs into another's rounded corner */}
      <path d="M3 7l9-5 9 5" />
      <path d="M3 7v10l9 5M21 7v10l-9 5" />
      <path d="M3 7l9 5M21 7l-9 5M12 12v10" />
      {/* tape across the middle of the lid and halfway down the side */}
      <path data-part="tape" d="M7.5 4.5l9 5V14" stroke={slot.accent} style={pivot("0% 0%")} />
    </g>
  ),
})
