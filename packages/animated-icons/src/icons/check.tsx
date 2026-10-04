"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    check: "draw" | "pop" | "stamp"
  }
}

/** A short burst in the empty top-left corner, aimed at the tick's elbow. */
const RAYS = ["M9 3v2", "M4.5 4.5 6 6", "M3 9h2"]

/** 1 color. The rays only exist in motion. */
export const Check = createAnimatedIcon({
  name: "check",
  category: "status",
  keywords: ["done", "success", "complete", "confirm", "tick", "ok", "valid"],
  slots: { primary: "tick + rays" },
  defaultVariant: "draw",
  variants: {
    // fades out, then redraws from the short leg; hidden while the stroke is too short to read
    draw: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tick]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=tick]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.8, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
          animate("[data-part=ray]", blink, {
            duration: seconds * 0.5,
            delay: stagger(seconds * 0.06, { startDelay: seconds * 0.55 }),
            ease: "easeOut",
          }),
        ]),
    },
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=tick]", { scale: [1, 1.15, 0.97, 1] }, { duration: seconds, ease: ease.out }),
          animate("[data-part=ray]", blink, { duration: seconds, delay: stagger(seconds * 0.05), ease: "easeOut" }),
        ]),
    },
    // lifts, then stamps down with a little squash
    stamp: {
      duration: 600,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tick]",
            { y: [0, -3, 0, 0], scaleY: [1, 1.04, 0.9, 1] },
            { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
          ),
          animate("[data-part=ray]", blink, { duration: seconds * 0.4, delay: seconds * 0.6, ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      {RAYS.map((d) => (
        <path key={d} data-part="ray" d={d} style={flash("50% 50%")} />
      ))}
      {/* a short 45° leg and a long, steeper one meeting in a hard mitered elbow */}
      <path data-part="tick" d="M3.5 12.5 9 18 20.5 5.5" style={pivot("40% 100%")} />
    </>
  ),
})
