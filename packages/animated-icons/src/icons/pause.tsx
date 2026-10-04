"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    pause: "bounce" | "squeeze" | "drain"
  }
}

/** Left edges of the two 5-wide bars: their strokes stand 2px apart. */
const BARS = [5, 14]

/** 2 colors: bar outlines (primary), bar fills (accent). */
export const Pause = createAnimatedIcon({
  name: "pause",
  category: "media",
  keywords: ["hold", "stop", "break", "player", "media", "suspend"],
  slots: { primary: "bar outlines", accent: "bar fills" },
  defaultVariant: "bounce",
  variants: {
    // the bars hop one after the other
    bounce: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bar]",
          { y: [0, -2.5, 0.5, 0] },
          { duration: seconds * 0.65, times: [0, 0.4, 0.75, 1], delay: stagger(seconds * 0.35), ease: "easeInOut" },
        ),
    },
    // both bars squash down the middle and spring back
    squeeze: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bar]",
          { scaleY: [1, 0.75, 1.06, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ease.out },
        ),
    },
    // the fills empty to the floor and refill, one bar after the other
    drain: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=level]",
          { scaleY: [1, 0, 1] },
          { duration: seconds * 0.75, times: [0, 0.35, 1], delay: stagger(seconds * 0.25), ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {BARS.map((x) => (
        <g key={x} data-part="bar" style={pivot("50% 50%")}>
          <rect data-part="level" x={x} y="4" width="5" height="16" fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
          <rect x={x} y="4" width="5" height="16" />
        </g>
      ))}
    </>
  ),
})
