"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    moon: "rock" | "twinkle" | "rise"
  }
}

/**
 * A crescent from two true arcs (a moon is round): three quarters of a circle round (12, 12), then
 * back through the bite, a circle round (15, 9) through the same two horns.
 */
const CRESCENT = "M12 3A9 9 0 1 0 21 12A6.708 6.708 0 1 1 12 3Z"

/** A four-pointed star in the bite, and a small diamond star above it, clear of both horns. */
const STARS = ["M17 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1z", "M20.5 2 22 3.5 20.5 5 19 3.5z"]

/** 2 colors: moon (primary), stars (accent). */
export const MoonIcon = createAnimatedIcon({
  name: "moon",
  category: "weather",
  keywords: ["night", "dark mode", "crescent", "sleep", "evening", "theme", "lunar"],
  slots: { primary: "moon", accent: "stars" },
  defaultVariant: "rock",
  variants: {
    // the crescent rocks on its centre like a cradle; the stars hold still
    rock: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=moon]", { rotate: [0, -10, 8, -4, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // each star dims, then flares a little past its size, one after the other
    twinkle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=star]",
          { scale: [1, 0.5, 1.2, 1], opacity: [1, 0.4, 1, 1] },
          { duration: seconds * 0.75, delay: stagger(seconds * 0.25), ease: "easeInOut" },
        ),
    },
    // the moon lifts 2px and settles back with a soft landing
    rise: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=moon]",
          { y: [0, -2, 0] },
          { duration: seconds, times: [0, 0.45, 1], ease: ["easeOut", ease.overshoot] },
        ),
    },
  },
  render: () => (
    <>
      <path data-part="moon" d={CRESCENT} style={pivot("50% 50%")} />
      <g fill={slot.accent} stroke="none">
        {STARS.map((d) => (
          <path key={d} data-part="star" d={d} style={pivot("50% 50%")} />
        ))}
      </g>
    </>
  ),
})
