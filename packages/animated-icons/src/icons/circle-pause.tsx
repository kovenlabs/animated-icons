"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { stagger } from "motion/react"

declare module "../lib/types" {
  interface IconVariants {
    "circle-pause": "bounce" | "squeeze" | "pulse"
  }
}

/** The two bars, 2px apart between their strokes. */
const BARS = ["M10 9v6", "M14 9v6"]

/** 2 colors: ring (primary), bars (accent). */
export const CirclePause = createAnimatedIcon({
  name: "circle-pause",
  family: "circle",
  category: "media",
  keywords: ["pause", "hold", "maybe", "wait", "on hold", "suspend", "undecided"],
  slots: { primary: "ring", accent: "bars" },
  defaultVariant: "bounce",
  variants: {
    // the bars hop one after the other, like a beat of hesitation
    bounce: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bar]",
          { y: [0, -2.5, 0.5, 0] },
          {
            duration: seconds * 0.65,
            times: [0, 0.4, 0.75, 1],
            delay: stagger(seconds * 0.35),
            ease: "easeInOut",
          },
        ),
    },
    // both bars squash toward the middle and spring back
    squeeze: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bar]",
          { scaleY: [1, 0.6, 1.1, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ease.out },
        ),
    },
    // the whole badge breathes in and out once
    pulse: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { scale: [1, 1.12, 0.97, 1] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="badge" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      <g stroke={slot.accent}>
        {BARS.map((d) => (
          <path d={d} data-part="bar" key={d} style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
