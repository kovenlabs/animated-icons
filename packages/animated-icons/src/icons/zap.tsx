"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    zap: "strike" | "flicker" | "pop"
  }
}

/** A flat-topped bolt from straight segments: a wide upper blade, a step, a long point down to the left. */
const BOLT = "M12 2h5l-4 8h6L9 22l2-9H5z"

/** Sparks in the four empty corners, each drawn from its inner end outward (the end it scales from). */
const SPARKS = [
  { d: "M5 5 3 3", origin: "100% 100%" },
  { d: "M19.5 4.5 21 3", origin: "0% 100%" },
  { d: "M19 19l2 2", origin: "0% 0%" },
  { d: "M4.5 19.5 3 21", origin: "100% 0%" },
]

/** 2 colors: bolt (primary), sparks (accent). */
export const Zap = createAnimatedIcon({
  name: "zap",
  category: "status",
  keywords: ["lightning", "bolt", "power", "energy", "electric", "flash", "fast", "charge"],
  slots: { primary: "bolt", accent: "sparks" },
  defaultVariant: "strike",
  variants: {
    // the bolt winds up and slams down; sparks burst from the corners on impact
    strike: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bolt]",
            { y: [0, -2, 1, 0], opacity: [1, 1, 0.4, 1] },
            { duration: seconds, times: [0, 0.35, 0.5, 1], ease: ["easeOut", ease.in, "easeOut"] },
          ),
          animate("[data-part=spark]", blink, { duration: seconds * 0.5, delay: seconds * 0.45, ease: "easeOut" }),
        ]),
    },
    // an unsteady current: the bolt stutters out twice and catches
    flicker: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bolt]",
          { opacity: [1, 0.2, 1, 0.6, 0.15, 1] },
          { duration: seconds, times: [0, 0.12, 0.3, 0.45, 0.6, 1], ease: "linear" },
        ),
    },
    // charged up: a squeeze, then a pop past full size
    pop: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate("[data-part=bolt]", { scale: [1, 0.85, 1.1, 1] }, { duration: seconds, ease: ease.out }),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {SPARKS.map(({ d, origin }) => (
          <path key={d} data-part="spark" d={d} style={flash(origin)} />
        ))}
      </g>
      <path data-part="bolt" d={BOLT} style={pivot("50% 50%")} />
    </>
  ),
})
