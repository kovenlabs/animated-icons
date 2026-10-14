"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    banana: "flip" | "boomerang" | "jelly"
  }
}

/**
 * The banana's box runs 3..20.5 × 2..21.5, so it scales about its centre (11.75, 11.75); a squash that
 * keeps the tip on the ground lifts it by 9.75 · (1 − scaleY).
 */
const HALF = 9.75

/** 2 colors: peel (primary), stem (accent). */
export const Banana = createAnimatedIcon({
  name: "banana",
  category: "food",
  keywords: ["fruit", "food", "snack", "tropical", "peel", "healthy", "potassium"],
  slots: { primary: "peel", accent: "stem" },
  defaultVariant: "flip",
  variants: {
    // crouches, leaps away from you (it shrinks as it rises), turns a full somersault on its long axis
    // in the air, then lands with a squash while the stem flicks
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const scaleY = [1, 0.82, 0.85, 0.85, 0.8, 1.03, 1]
        return Promise.all([
          animate(
            "[data-part=banana]",
            {
              scaleY,
              scaleX: [1, 1.1, 0.85, 0.85, 1.15, 0.98, 1],
              y: [0, HALF * (1 - 0.82), -1.8, -1.8, HALF * (1 - 0.8), -0.3, 0],
            },
            {
              duration: seconds,
              times: [0, 0.15, 0.4, 0.62, 0.78, 0.9, 1],
              ease: ["easeOut", "easeOut", "easeInOut", ease.in, "easeOut", "easeInOut"],
            },
          ),
          // edge-on, then mirrored, then edge-on again: a full turn about its vertical axis
          animate(
            "[data-part=turn]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.25, 0.34, 0.45, 0.56, 0.67, 1],
              ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"],
            },
          ),
          animate(
            "[data-part=stem]",
            { rotate: [0, 0, -30, 24, -12, 0] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.78, 0.9, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
    // thrown like a boomerang: it spins off into the distance on a curve, swings round and comes back
    // to land in your hand
    boomerang: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=banana]",
            {
              scaleX: [1, 0.55, 0.45, 0.55, 1.1, 1],
              scaleY: [1, 0.55, 0.45, 0.55, 0.9, 1],
              x: [0, -4, 0, 4, 0, 0],
              y: [0, -2, -3, -1, 0, 0],
            },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 0.9, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=turn]",
            { rotate: [0, 720, 720] },
            { duration: seconds, times: [0, 0.85, 1], ease: [ease.inOut, "linear"] },
          ),
        ]),
    },
    // wobbles like a jelly on its tip: stretches tall and thin, squashes short and wide, and settles,
    // the stem flapping a beat behind
    jelly: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const scaleY = [1, 1.04, 0.85, 1.03, 0.97, 1]
        return Promise.all([
          animate(
            "[data-part=banana]",
            {
              scaleY,
              scaleX: [1, 0.92, 1.15, 0.96, 1.02, 1],
              y: scaleY.map((s) => HALF * (1 - s)),
              skewX: [0, -6, 5, -2, 1, 0],
            },
            { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=stem]",
            { rotate: [0, 22, -26, 14, -6, 0] },
            { duration: seconds, delay: seconds * 0.06, times: [0, 0.22, 0.44, 0.64, 0.82, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="banana" style={pivot("50% 50%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        {/* a faceted crescent: square stem end at the top, the belly curving down to a flat tip */}
        <path d="M17 4h2l1.5 5-1.5 6-4 4-6 2.5H3l4-3 4-2 3-3.5 2-4.5Z" />
        <path data-part="stem" d="M18 4V2h2" stroke={slot.accent} style={pivot("0% 100%")} />
      </g>
    </g>
  ),
})
