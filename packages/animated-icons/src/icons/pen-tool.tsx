"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "pen-tool": "tap" | "anchor" | "steer"
  }
}

/** 2 colors: nib and holder (primary), slit and anchor hole (accent). */
export const PenTool = createAnimatedIcon({
  name: "pen-tool",
  category: "design",
  keywords: ["vector", "bezier", "path", "anchor point", "illustrator", "nib", "draw"],
  slots: { primary: "nib + holder", accent: "slit + anchor hole" },
  defaultVariant: "tap",
  variants: {
    // lifts back off its tip and sets down twice, placing anchor points, the second lighter; the hole
    // answers each landing
    tap: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pen]",
            { x: [0, 1.5, 0, 1, 0, 0], y: [0, 1.5, 0, 1, 0, 0] },
            { duration: seconds, times: [0, 0.18, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=hole]",
            { scale: [1, 1, 1.3, 1, 1, 1.2, 1] },
            { duration: seconds, times: [0, 0.4, 0.5, 0.62, 0.8, 0.9, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the anchor hole pops and the slit, pulled back into it, runs out to the tip again
    anchor: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=hole]", { scale: [1, 0, 1.25, 1] }, { duration: seconds * 0.6, ease: ease.out }),
          animate(
            "[data-part=slit]",
            { scale: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the tip stays planted like an anchor while the pen swings about it, dragging out a curve handle
    steer: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=pen]", { rotate: [0, 7, -7, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    // pivots on the point of the nib, top-left
    <g data-part="pen" style={pivot("0% 0%")}>
      {/* a kite-shaped nib pointing up-left, its wide base set in a square holder */}
      <path d="M3 3l13 3 2 7-5 5-7-2Z" />
      <path d="M13 18l3 3 5-5-3-3" />
      <g stroke={slot.accent}>
        {/* the slit runs from the hole out to the tip */}
        <path data-part="slit" d="M9.5 9.5 4.5 4.5" style={pivot("100% 100%")} />
        <circle data-part="hole" cx="11" cy="11" r="2" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
