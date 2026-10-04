"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    flame: "flicker" | "flare"
  }
}

/** A faceted flame: a leaning tip, a full round belly, and a small lick notched into its left side. */
const FLAME = "M12 2l4.5 5.5L19 12v4l-3 4-4 2-4-2-3-4v-4l2-3 2.5 2.5Z"

/** The hot core: a small solid flame sitting low in the belly, 2px clear of the outline. */
const CORE = "M12 12.5l2.5 3.5v1.5L12 19l-2.5-1.5V16Z"

/** 2 colors: flame (primary), core (accent). */
export const Flame = createAnimatedIcon({
  name: "flame",
  category: "nature",
  keywords: ["fire", "hot", "burn", "trending", "popular", "streak", "heat", "energy"],
  slots: { primary: "flame", accent: "core" },
  defaultVariant: "flicker",
  variants: {
    // the flame leans one way and the other on its base while the core licks up and down
    flicker: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=flame]", { skewX: [0, -5, 4, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=core]",
            { scaleY: [1, 1.3, 0.85, 1.15, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // it ducks, then flares up past its size, the core leaping highest
    flare: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flame]",
            { scale: [1, 0.9, 1.12, 1] },
            { duration: seconds, times: [0, 0.25, 0.55, 1], ease: ease.out },
          ),
          animate(
            "[data-part=core]",
            { scaleY: [1, 0.8, 1.35, 1] },
            { duration: seconds, times: [0, 0.25, 0.55, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="flame" style={pivot("50% 100%")}>
      <path d={FLAME} />
      <path data-part="core" d={CORE} fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
    </g>
  ),
})
