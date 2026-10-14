"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    soup: "steam" | "stir" | "boil"
  }
}

/** 2 colors: bowl and spoon (primary), steam (accent). */
export const Soup = createAnimatedIcon({
  name: "soup",
  category: "food",
  keywords: ["bowl", "stew", "broth", "ramen", "hot", "meal", "food", "lunch"],
  slots: { primary: "bowl + spoon", accent: "steam" },
  defaultVariant: "steam",
  variants: {
    // the bowl simmers with a squash, the steam stretches up and blows away, then fresh wisps draw up
    // out of the soup one after the other, curling as they rise
    steam: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dish]",
            { scaleY: [1, 0.88, 1.06, 0.96, 1, 1], scaleX: [1, 1.08, 0.97, 1.02, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.42, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=steam]",
            {
              y: [0, -3, 0, 0, 0, 0],
              scaleY: [1, 1.4, 1, 1, 1, 1],
              opacity: [1, 0, 0, 0, 1, 1],
              pathLength: [1, 1, 0, 0, 0.15, 1],
            },
            {
              duration: seconds * 0.9,
              times: [0, 0.2, 0.21, 0.45, 0.5, 1],
              ease: ["easeOut", snap, "linear", "linear", "easeOut"],
              delay: stagger(seconds * 0.1),
            },
          ),
          animate(
            "[data-part=steam]",
            { skewX: [0, 0, 20, -16, 8, 0] },
            {
              duration: seconds * 0.9,
              times: [0, 0.45, 0.62, 0.78, 0.9, 1],
              ease: "easeInOut",
              delay: stagger(seconds * 0.1),
            },
          ),
        ]),
    },
    // the spoon stirs a full circle round the bowl: it slides along the rim, its handle swinging upright
    // as it passes the front, leaning out the far side, and dimming as it comes back round the back;
    // the steam blows aside and draws back on once the stir is done
    stir: {
      duration: 1400,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=spoon]",
            {
              x: [0, -4, -8, -4, 0],
              scaleX: [1, 0, -1, 0, 1],
              opacity: [1, 1, 1, 0.45, 1],
            },
            { duration: seconds * 0.85, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=dish]",
            { rotate: [0, -3, 3, -2, 0] },
            { duration: seconds * 0.85, ease: "easeInOut" },
          ),
          animate(
            "[data-part=steam]",
            { x: [0, -2, 0, 0, 0], opacity: [1, 0, 0, 1, 1], pathLength: [1, 1, 0, 0.15, 1] },
            { duration: seconds, times: [0, 0.1, 0.8, 0.84, 1], ease: ["easeOut", snap, "linear", "easeOut"] },
          ),
        ]),
    },
    // boiling hot: the bowl rattles on the table and the steam shoots up in bursts, wobbling
    boil: {
      duration: 900,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dish]",
            { x: [0, -0.8, 0.8, -0.8, 0.8, -0.5, 0.5, 0], rotate: [0, -3, 3, -3, 3, -2, 2, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate(
            "[data-part=steam]",
            { scaleY: [1, 1.35, 0.9, 1.2, 1], skewX: [0, 12, -12, 8, 0] },
            { duration: seconds * 0.85, ease: "easeInOut", delay: stagger(seconds * 0.08) },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the dish's box runs 2..22 × 3..21: it squashes onto its base at 50% 100% */}
      <g data-part="dish" style={pivot("50% 100%")}>
        {/* a faceted bowl under a flat rim */}
        <path d="M2 11h20l-2 6-4 4H8l-4-4Z" />
        {/* the spoon leans on the rim, pivoting on its root for the stir */}
        <path data-part="spoon" d="M16 11l3-8" style={pivot("0% 100%")} />
      </g>
      <g stroke={slot.accent}>
        <path data-part="steam" d="M7.5 7 6 5.5 7.5 4 6 2.5" style={pivot("50% 100%")} />
        <path data-part="steam" d="M11.5 7 10 5.5 11.5 4 10 2.5" style={pivot("50% 100%")} />
      </g>
    </>
  ),
})
