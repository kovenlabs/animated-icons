"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "zoom-in": "magnify" | "turn" | "plus"
  }
}

/** 2 colors: lens and handle (primary), plus sign (accent). */
export const ZoomIn = createAnimatedIcon({
  name: "zoom-in",
  family: "zoom",
  category: "actions",
  keywords: ["magnify", "enlarge", "zoom", "magnifying glass", "scale up", "closer", "bigger"],
  slots: { primary: "lens + handle", accent: "plus sign" },
  defaultVariant: "magnify",
  variants: {
    // the glass dips, then rushes toward you (drifting to the middle, so the lens stays in frame) and
    // settles; the plus pops out of it with a quarter turn
    magnify: {
      duration: 950,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glass]",
            { scale: [1, 0.9, 1.15, 0.97, 1], x: [0, 0, 0.4, 0, 0], y: [0, 0.5, 0.4, 0.2, 0] },
            { duration: seconds, times: [0, 0.2, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          // a plus looks the same a quarter turn back, so it starts there and lands at 0
          animate(
            "[data-part=plus]",
            { scale: [1, 0.4, 1.3, 1], rotate: [-90, -90, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.65, 1], ease: ["easeIn", ease.overshoot, "easeOut"] },
          ),
        ]),
    },
    // the magnifier turns right round on its vertical axis, lifting toward you as it goes
    turn: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=magnifier]",
          { scaleX: [1, -1, 1], scale: [1, 1.08, 1], y: [0, -1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the plus shrinks to a point and springs back bigger with a half spin; the glass bumps with it
    plus: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plus]",
            { scale: [1, 0.2, 1.3, 1], rotate: [-180, -180, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: ["easeIn", ease.overshoot, "easeOut"] },
          ),
          animate(
            "[data-part=glass]",
            { scale: [1, 1, 1.08, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="magnifier" style={pivot("50% 50%")}>
      {/* the same glass as search: it magnifies about the centre of its lens (10, 10) */}
      <g data-part="glass" style={pivot("40% 40%")}>
        {/* a lens is round, so it gets a true circle */}
        <circle cx="10" cy="10" r="7" />
        <path d="M15 15l5.5 5.5" />
        <path data-part="plus" d="M10 7v6M7 10h6" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
