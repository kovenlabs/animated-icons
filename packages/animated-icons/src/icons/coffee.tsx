"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    coffee: "steam" | "turn" | "cheers"
  }
}

/**
 * The handle's orbit round the mug, which is a cylinder of radius 5: at angle θ its root sits at
 * x = 5·cos θ − 5 from rest and it is foreshortened to cos θ. It swings round the back (hidden behind
 * the mug from 50° to 130°) to the far side and back the same way, so it never crosses the mug's front.
 */
const ORBIT = {
  x: [0, -1.79, -5, -8.21, -10, -10, -8.21, -5, -1.79, 0],
  scaleX: [1, 0.64, 0, -0.64, -1, -1, -0.64, 0, 0.64, 1],
  opacity: [1, 0.3, 0, 0.3, 1, 1, 0.3, 0, 0.3, 1],
}

/** 2 colors: mug (primary), steam (accent). */
export const Coffee = createAnimatedIcon({
  name: "coffee",
  category: "commerce",
  keywords: ["cup", "mug", "tea", "espresso", "cafe", "drink", "break", "hot drink"],
  slots: { primary: "mug", accent: "steam" },
  defaultVariant: "steam",
  variants: {
    // the steam puffs away, the mug is lifted and set down with a squash, then fresh steam curls up out
    // of it, one wisp after the other
    steam: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mug]",
            {
              y: [0, -3, -3, 0, 0, 0, 0],
              scaleY: [1, 1.06, 1.06, 0.84, 1.06, 1, 1],
              scaleX: [1, 0.96, 0.96, 1.12, 0.97, 1, 1],
            },
            {
              duration: seconds,
              times: [0, 0.18, 0.28, 0.4, 0.5, 0.6, 1],
              ease: ["easeOut", "linear", ease.in, "easeOut", "easeInOut", "linear"],
            },
          ),
          // the old steam rises and fades before the rim comes near it, then draws back on from the cup
          // (hidden while it is too short to read)
          animate(
            "[data-part=steam]",
            {
              y: [0, -2, 0, 0, 0, 0],
              opacity: [1, 0, 0, 0, 1, 1],
              pathLength: [1, 1, 0, 0, 0.15, 1],
            },
            {
              duration: seconds * 0.9,
              times: [0, 0.12, 0.13, 0.5, 0.56, 1],
              ease: ["easeOut", snap, "linear", "linear", "easeOut"],
              delay: stagger(seconds * 0.1),
            },
          ),
          // and curls as it rises
          animate(
            "[data-part=steam]",
            { skewX: [0, 0, 18, -14, 6, 0] },
            {
              duration: seconds * 0.9,
              times: [0, 0.5, 0.65, 0.8, 0.9, 1],
              ease: "easeInOut",
              delay: stagger(seconds * 0.1),
            },
          ),
        ]),
    },
    // the mug turns on the spot: its handle swings round behind it to the far side and back, and the
    // steam sways with the turn
    turn: {
      duration: 1400,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=handle]", ORBIT, {
            duration: seconds,
            times: [0, 0.11, 0.2, 0.29, 0.4, 0.6, 0.71, 0.8, 0.89, 1],
            ease: ["easeIn", "linear", "linear", "easeOut", "linear", "easeIn", "linear", "linear", "easeOut"],
          }),
          animate(
            "[data-part=steam]",
            { skewX: [0, 16, 16, -16, -16, 0] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.75, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // raised for a toast: the mug tips up off its base, clinks, and settles; the steam blows off and
    // comes back
    cheers: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mug]",
            { y: [0, -2, -2, 0, 0], rotate: [0, -18, -12, 3, 0] },
            { duration: seconds, times: [0, 0.35, 0.5, 0.75, 1], ease: ["easeOut", ease.overshoot, "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=steam]",
            { opacity: [1, 0, 0, 1], x: [0, -2, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.7, 1], ease: ["easeOut", snap, "easeIn"] },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="mug" style={pivot("50% 100%")}>
        {/* a mug is round, so its rim and base are true ellipses: the rim seen from just above */}
        <ellipse cx="11" cy="13" rx="5" ry="2" />
        <path d="M6 13v6A5 2 0 0 0 16 19v-6" />
        {/* pivots on its root against the mug's side, for the orbit */}
        <path data-part="handle" d="M16 15h4v4h-4" style={pivot("0% 50%")} />
      </g>
      <g stroke={slot.accent}>
        <path data-part="steam" d="M9.5 7 8 5.5 9.5 4 8 2.5" style={pivot("50% 100%")} />
        <path data-part="steam" d="M13.5 7 12 5.5 13.5 4 12 2.5" style={pivot("50% 100%")} />
      </g>
    </>
  ),
})
