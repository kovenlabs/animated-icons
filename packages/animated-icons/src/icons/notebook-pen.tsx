"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "notebook-pen": "write" | "flip" | "click"
  }
}

/** Binding rings across the left edge, as in `notebook`. */
const RINGS = "M3 6h4M3 10h4M3 14h4M3 18h4"

/** 2 colors: cover and rings (primary), pen and the line it writes (accent). */
export const NotebookPen = createAnimatedIcon({
  name: "notebook-pen",
  family: "notebook",
  category: "education",
  keywords: ["notes", "journal", "write", "edit notes", "diary", "notepad", "compose", "minutes"],
  slots: { primary: "cover + rings", accent: "pen + written line" },
  defaultVariant: "write",
  variants: {
    // the pen swishes back and forth from its top end, scribbling a line onto the page that then fades
    write: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pen]",
            { rotate: [0, 6, -8, 4, -5, 0] },
            { duration: seconds * 0.85, times: [0, 0.2, 0.45, 0.65, 0.85, 1], ease: "easeInOut" },
          ),
          // hidden until it has length: a square cap paints a dot at pathLength 0
          animate(
            "[data-part=line]",
            { opacity: [0, 0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.2, 0.21, 0.8, 1] },
          ),
          animate(
            "[data-part=line]",
            { pathLength: [0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the cover swings open on its rings, edge-on in perspective, while the pen lifts out of the way
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cover]",
            { scaleX: [1, 0.15, 0.15, 1.04, 1], skewY: [0, -14, -14, 2, 0] },
            { duration: seconds, times: [0, 0.35, 0.55, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=pen]",
            { rotate: [0, 12, 12, -3, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // two hard clicks of the pen against the page, each one stamping a dash that grows from the tip
    click: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pen]",
            { x: [0, 0.5, -1, 0.5, -0.8, 0], y: [0, -0.5, 1, -0.5, 0.8, 0], rotate: [0, -4, 3, -3, 2, 0] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.5, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=line]",
            { opacity: [0, 0, 1, 1, 0], scaleX: [0, 0, 1.15, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="cover" style={pivot("0% 50%")}>
        {/* the cover, open at its top-right corner where the pen crosses it */}
        <path d="M14 2H5v20h15v-8" />
        <path d={RINGS} />
      </g>
      {/* the line the pen writes: only exists in motion */}
      <path data-part="line" d="M11 18h5" stroke={slot.accent} style={flash("0% 50%")} />
      {/* a slim 45° pen, pivoting on its top end */}
      <g data-part="pen" stroke={slot.accent} style={pivot("100% 0%")}>
        <path d="M13 9l6-6 2 2-6 6z" />
        <path d="M13 9l-1 3 3-1" />
      </g>
    </>
  ),
})
