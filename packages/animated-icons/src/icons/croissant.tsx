"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    croissant: "rise" | "toss" | "jiggle"
  }
}

/** 2 colors: pastry (primary), layer seams (accent). */
export const Croissant = createAnimatedIcon({
  name: "croissant",
  category: "commerce",
  keywords: ["pastry", "bakery", "breakfast", "bread", "french", "food", "brunch"],
  slots: { primary: "pastry", accent: "layer seams" },
  defaultVariant: "rise",
  variants: {
    // proves in the oven: the dough squashes flat, puffs up tall past its size and settles, and the
    // layers draw back on across the risen pastry
    rise: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=croissant]",
            { scaleY: [1, 0.72, 1.2, 0.92, 1.04, 1], scaleX: [1, 1.08, 0.92, 1.04, 0.98, 1] },
            {
              duration: seconds,
              times: [0, 0.22, 0.5, 0.68, 0.84, 1],
              ease: ["easeOut", ease.out, "easeInOut", "easeInOut", "easeInOut"],
            },
          ),
          // hidden while too short to read, so the square caps never dot the pastry
          animate(
            "[data-part=seams]",
            { opacity: [1, 0, 0, 1, 1], pathLength: [1, 1, 0, 0.15, 1] },
            { duration: seconds, times: [0, 0.18, 0.45, 0.5, 0.9], ease: ["easeOut", snap, "linear", "easeOut"] },
          ),
        ]),
    },
    // tossed off the plate: it crouches, springs up and flips over towards you (the horns point up
    // half-way through), then lands with a squash
    toss: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=croissant]",
            {
              y: [0, 0, -3, -3, 0, 0, 0],
              scaleY: [1, 0.82, 1.06, 1, 0.78, 1.05, 1],
              scaleX: [1, 1.08, 0.96, 1, 1.12, 0.98, 1],
            },
            {
              duration: seconds,
              times: [0, 0.14, 0.32, 0.62, 0.76, 0.88, 1],
              ease: ["easeOut", "easeOut", "easeInOut", ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=flip]",
            { scaleY: [1, 1, 0, -1, 0, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.22, 0.32, 0.42, 0.52, 0.62, 1],
              ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"],
            },
          ),
        ]),
    },
    // set down too hard: the flaky top wobbles over its horns like jelly and settles
    jiggle: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=croissant]",
            { skewX: [0, 16, -12, 7, -3, 0], scaleY: [1, 0.88, 1.06, 0.97, 1.01, 1] },
            { duration: seconds, times: [0, 0.18, 0.42, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=seams]",
            { opacity: [1, 0.4, 1, 0.6, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // the croissant's box runs 2..22 × 5..19: it squashes onto its horns at 50% 100%
    <g data-part="croissant" style={pivot("50% 100%")}>
      <g data-part="flip" style={pivot("50% 50%")}>
        {/* a faceted crescent: a square centre lobe, two side lobes, and two horns curling down */}
        <path d="M2 19 4 10l5-5h6l5 5 2 9-5-3.5-3-2.5h-4l-3 2.5Z" />
        <path data-part="seams" d="M9 5l1 8M15 5l-1 8M4 10l3 5.5M20 10l-3 5.5" stroke={slot.accent} />
      </g>
    </g>
  ),
})
