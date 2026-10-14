"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "tree-palm": "sway" | "gust" | "spin"
  }
}

/** Four fronds fan out from the crown at (12, 8): two arch up and over, two droop out to the sides. */
const FRONDS = [
  { part: "frond-lt", d: "M12 8 8 3 3 4", origin: "100% 100%" },
  { part: "frond-rt", d: "M12 8l4-5 5 1", origin: "0% 100%" },
  { part: "frond-ll", d: "M12 8H6l-3 4", origin: "100% 0%" },
  { part: "frond-rl", d: "M12 8h6l3 4", origin: "0% 0%" },
] as const

const ALL_FRONDS = FRONDS.map(({ part }) => `[data-part=${part}]`).join(", ")

/** 2 colors: trunk and ground (primary), fronds (accent). */
export const TreePalm = createAnimatedIcon({
  name: "tree-palm",
  family: "tree",
  category: "nature",
  keywords: ["palm tree", "beach", "tropical", "island", "vacation", "summer", "coconut", "holiday"],
  slots: { primary: "trunk + ground", accent: "fronds" },
  defaultVariant: "sway",
  variants: {
    // the trunk bends in a lazy breeze, the crown lagging behind it, and the fronds flutter one after another
    sway: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=palm]",
            { skewX: [0, -9, 7, -4, 1.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=crown]",
            { rotate: [0, 0, 9, -8, 4, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            ALL_FRONDS,
            { rotate: [0, 10, -8, 5, 0] },
            { duration: seconds * 0.8, delay: stagger(seconds * 0.06), ease: "easeInOut" },
          ),
        ]),
    },
    // a gust hits from the left: the trunk bows hard, every frond is flung downwind and whips there,
    // then the tree springs back past upright and settles
    gust: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=palm]",
            { skewX: [0, -16, -13, -16, 6, -2, 0] },
            {
              duration: seconds,
              times: [0, 0.2, 0.32, 0.46, 0.66, 0.84, 1],
              ease: [ease.out, "easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeInOut"],
            },
          ),
          animate(
            ALL_FRONDS,
            { rotate: [0, 16, 9, 16, -7, 2, 0] },
            {
              duration: seconds * 0.9,
              times: [0, 0.2, 0.32, 0.46, 0.66, 0.84, 1],
              delay: stagger(seconds * 0.025),
              ease: "easeInOut",
            },
          ),
        ]),
    },
    // the whole palm turns round on its trunk, going edge-on and coming back mirrored, then the fronds
    // bounce from the stop
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=palm]",
            { scaleX: [1, -1, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=crown]",
            { scaleY: [1, 1, 0.8, 1.12, 1] },
            { duration: seconds, times: [0, 0.6, 0.72, 0.86, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=frond-ll], [data-part=frond-lt]",
            { rotate: [0, 0, 16, -6, 0] },
            { duration: seconds, times: [0, 0.62, 0.76, 0.9, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=frond-rl], [data-part=frond-rt]",
            { rotate: [0, 0, -16, 6, 0] },
            { duration: seconds, times: [0, 0.62, 0.76, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path d="M4 21h16" />
      <g data-part="palm" style={pivot("50% 100%")}>
        {/* a trunk that leans gently left as it rises from the sand to the crown */}
        <path d="M9 21l2-5 1-4V8" />
        {/* the crown's box is x 3..21, y 3..12, so the point the fronds grow from is at 50% / 55.6% */}
        <g data-part="crown" stroke={slot.accent} style={pivot("50% 55.6%")}>
          {FRONDS.map(({ part, d, origin }) => (
            <path key={part} data-part={part} d={d} style={pivot(origin)} />
          ))}
        </g>
      </g>
    </>
  ),
})
