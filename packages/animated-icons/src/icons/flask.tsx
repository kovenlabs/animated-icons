"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    flask: "bubble" | "swirl" | "fill"
  }
}

/** 2 colors: glass (primary), liquid + bubbles (accent). The bubbles only exist in motion. */
export const Flask = createAnimatedIcon({
  name: "flask",
  category: "education",
  keywords: ["lab", "chemistry", "science", "experiment", "beaker", "erlenmeyer", "physics", "laboratory"],
  slots: { primary: "glass", accent: "liquid + bubbles" },
  defaultVariant: "bubble",
  variants: {
    // the liquid surges and two bubbles break from its surface, rising up into the neck
    bubble: {
      clip: false,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=liquid]",
            { scaleY: [1, 1.25, 0.95, 1] },
            { duration: seconds * 0.7, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bubble]",
            { opacity: [0, 1, 1, 0], y: [0, -3, -6, -8] },
            { duration: seconds * 0.6, delay: stagger(seconds * 0.3), ease: "easeOut" },
          ),
        ]),
    },
    // the flask is swirled on its base, the way a mixture is stirred
    swirl: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=flask]", { rotate: [0, -8, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the liquid drains away and is poured back in
    fill: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=liquid]",
          { scaleY: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.4, 0.5, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="flask" style={pivot("50% 100%")}>
      {/* a conical flask: a lipped neck, straight sloping shoulders and a short upright foot */}
      <path d="M7 2h10M9 2v6l-6 10v4h18v-4l-6-10V2" />
      {/* the liquid keeps 2px clear of the glass all round */}
      <path data-part="liquid" d="M9.5 13h5l3 5v1h-11v-1z" fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
      {/* the bubbles wait just under the liquid's surface (accent on accent, so unseen) and rise from it,
          centred in the neck with 1 clear of either wall */}
      {[0, 1].map((i) => (
        <rect key={i} data-part="bubble" x="11" y="13.5" width="2" height="2" fill={slot.accent} stroke="none" style={flash()} />
      ))}
    </g>
  ),
})
