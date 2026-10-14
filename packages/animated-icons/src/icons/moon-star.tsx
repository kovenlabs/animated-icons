"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "moon-star": "twinkle" | "shoot" | "rock"
  }
}

/**
 * The crescent of the moon family: three quarters of a circle round (12, 12), then back through the
 * bite, a true arc round (15, 9) through the same two horns.
 */
const CRESCENT = "M12 3A9 9 0 1 0 21 12A6.708 6.708 0 1 1 12 3Z"

/** One big four-pointed star in the open sky above the bite, 3.5 from its centre (18, 6) to each point. */
const STAR = "M18 2.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"

/** 2 colors: moon (primary), star (accent). */
export const MoonStar = createAnimatedIcon({
  name: "moon-star",
  family: "moon",
  category: "weather",
  keywords: ["night", "clear night", "dark mode", "crescent", "star", "evening", "sleep", "bedtime"],
  slots: { primary: "moon", accent: "star" },
  defaultVariant: "twinkle",
  variants: {
    // the star twinkles: it pinches down to a spark, then flares big while wheeling a full turn and
    // settles, and the moon shrinks back away from the glare
    twinkle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=star]",
            { scale: [1, 0.3, 1.25, 1], rotate: [0, 0, 360, 360], opacity: [1, 0.5, 1, 1] },
            { duration: seconds, times: [0, 0.25, 0.7, 1], ease: [ease.in, ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=moon]",
            { scale: [1, 1, 0.9, 1], x: [0, 0, -0.5, 0], y: [0, 0, 0.5, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: ["linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // a shooting star: the moon winds back and flings it out through the top right corner, shrinking
    // as it goes, and a new one pops back into its place
    shoot: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=star]",
            {
              x: [0, -0.5, 8, 0, 0],
              y: [0, 0.5, -8, 0, 0],
              scale: [1, 1.1, 0.5, 0, 1],
              opacity: [1, 1, 0, 0, 1],
            },
            {
              duration: seconds,
              times: [0, 0.15, 0.45, 0.46, 1],
              ease: ["easeOut", ease.in, snap, ease.overshoot],
            },
          ),
          animate(
            "[data-part=moon]",
            { rotate: [0, 8, -6, 2, 0] },
            { duration: seconds * 0.8, times: [0, 0.15, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the moon rocks like a cradle and half turns away and back, as if seen in depth, while the star
    // hops the other way and twinkles
    rock: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=moon]",
            { rotate: [0, -10, 8, -4, 0], scaleX: [1, 0.82, 1, 0.92, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=star]",
            { y: [0, -1.5, 0.5, -0.5, 0], scale: [1, 0.8, 1.15, 0.95, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="moon" d={CRESCENT} style={pivot("50% 50%")} />
      <path data-part="star" d={STAR} fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </>
  ),
})
