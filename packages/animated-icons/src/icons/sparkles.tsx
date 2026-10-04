"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sparkles: "twinkle" | "spin"
  }
}

/** 2 colors: large sparkle (primary), small sparkles (accent). */
export const Sparkles = createAnimatedIcon({
  name: "sparkles",
  category: "social",
  keywords: ["magic", "ai", "new", "shine", "stars", "special", "generate"],
  slots: { primary: "large sparkle", accent: "small sparkles" },
  defaultVariant: "twinkle",
  variants: {
    // each sparkle dims and flares in turn, largest first
    twinkle: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sparkle]",
          { scale: [1, 0.5, 1.15, 1] },
          { duration: seconds * 0.55, delay: stagger(seconds * 0.22), ease: "easeInOut" },
        ),
    },
    // the large sparkle turns a full circle and lands; the small ones pop as it settles
    spin: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-sparkle=large]", { rotate: [0, 360] }, { duration: seconds, ease: ease.inOut }),
          animate(
            "[data-sparkle=small]",
            { scale: [1, 1, 1.2, 1] },
            { duration: seconds, times: [0, 0.6, 0.8, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a four-pointed star: long arms on the axes, pinched in between */}
      <path
        data-part="sparkle"
        data-sparkle="large"
        d="M10 7l1.5 5.5L17 14l-5.5 1.5L10 21l-1.5-5.5L3 14l5.5-1.5Z"
        style={pivot("50% 50%")}
      />
      <path data-part="sparkle" data-sparkle="small" d="M18 3v6M15 6h6" stroke={slot.accent} style={pivot("50% 50%")} />
      <path
        data-part="sparkle"
        data-sparkle="small"
        d="M4.5 18 6 19.5 4.5 21 3 19.5Z"
        fill={slot.accent}
        stroke="none"
        style={pivot("50% 50%")}
      />
    </>
  ),
})
