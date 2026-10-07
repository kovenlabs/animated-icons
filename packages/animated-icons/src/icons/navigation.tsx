"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    navigation: "bank" | "go" | "recalculate"
  }
}

/** A heading arrow, symmetric about its spine (the line x + y = 24, from the notch to the tip). */
const ARROW = "M3 10.5 21 3l-7.5 18-2-8.5Z"
/** The lit facet: the half right of the spine. */
const FACET = "M21 3l-7.5 18-2-8.5Z"

/** 2 colors: arrow (primary), lit facet (accent). */
export const Navigation = createAnimatedIcon({
  name: "navigation",
  category: "navigation",
  keywords: ["gps", "location arrow", "heading", "direction", "current location", "compass", "route", "pointer"],
  slots: { primary: "arrow", accent: "lit facet" },
  defaultVariant: "bank",
  variants: {
    // surges forward and barrel-rolls round its spine, showing its other face, then settles back
    bank: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=roll]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.85, delay: seconds * 0.1, ease: "easeInOut" },
          ),
          animate(
            "[data-part=arrow]",
            { x: [0, 1.5, 1.5, 0], y: [0, -1.5, -1.5, 0], scale: [1, 1.12, 1.12, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // shoots off along its heading out of the top corner and swoops back in from the bottom one
    go: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, -1, 12, -12, 0], y: [0, 1, -12, 12, 0], opacity: [1, 1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.15, 0.45, 0.5, 1], ease: ["easeOut", ease.in, "linear", ease.out] },
        ),
    },
    // loses its bearing: shrinks, whips right round and swings past its heading before it locks back on
    recalculate: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { rotate: [0, -25, 380, 352, 360], scale: [1, 0.85, 0.9, 1.05, 1] },
          { duration: seconds, times: [0, 0.2, 0.65, 0.85, 1], ease: ["easeOut", "easeInOut", "easeInOut", "easeInOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="arrow" style={pivot("50% 50%")}>
      {/* turned onto the spine, so the roll squeezes across it */}
      <g transform="rotate(45 12 12)">
        <g data-part="roll" style={pivot("50% 50%")}>
          <g transform="rotate(-45 12 12)">
            <path d={FACET} fill={slot.accent} stroke="none" />
            <path d={ARROW} />
          </g>
        </g>
      </g>
    </g>
  ),
})
