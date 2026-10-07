"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "test-tube": "fizz" | "shake" | "swirl"
  }
}

const STEPS = 16

/**
 * Swirled in a small flat circle, twice round: it swings side to side, grows on the near side and
 * shrinks on the far side (a circle seen from the front), leaning into each swing, while the liquid's
 * surface tilts against the lean a quarter turn behind.
 */
function swirl() {
  const angles = Array.from({ length: STEPS + 1 }, (_, i) => (4 * Math.PI * i) / STEPS)
  const fade = (i: number) => Math.sin((Math.PI * i) / STEPS)
  return {
    tube: {
      x: angles.map((a, i) => 2.5 * Math.sin(a) * fade(i)),
      scale: angles.map((a, i) => 1 + 0.1 * Math.cos(a) * fade(i)),
      rotate: angles.map((a, i) => 8 * Math.sin(a) * fade(i)),
    },
    liquid: { skewY: angles.map((a, i) => -14 * Math.sin(a - Math.PI / 2) * fade(i)) },
  }
}

/** 2 colors: glass (primary), liquid + bubbles (accent). The bubbles only exist in motion. */
export const TestTube = createAnimatedIcon({
  name: "test-tube",
  category: "education",
  keywords: ["lab", "chemistry", "experiment", "science", "sample", "laboratory", "biology", "vial"],
  slots: { primary: "glass", accent: "liquid + bubbles" },
  defaultVariant: "fizz",
  variants: {
    // the liquid surges up the tube and three bubbles rise out of it and pop at the mouth, while the
    // tube gives a little squash and stretch
    fizz: {
      duration: 1200,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=liquid]",
            { scaleY: [1, 1.35, 0.92, 1] },
            { duration: seconds * 0.7, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=tube]",
            { scaleY: [1, 0.95, 1.04, 1], scaleX: [1, 1.04, 0.97, 1] },
            { duration: seconds * 0.6, times: [0, 0.3, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bubble]",
            { y: [0, -4, -8, -10], opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 1.6] },
            { duration: seconds * 0.55, delay: stagger(seconds * 0.15, { startDelay: seconds * 0.1 }), ease: "easeOut" },
          ),
        ]),
    },
    // held by the mouth and shaken, the liquid keeping its surface level against each swing
    shake: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tube]",
            { rotate: [0, 16, -14, 10, -5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=liquid]",
            { skewY: [0, -16, 14, -10, 5, 0] },
            { duration: seconds, delay: seconds * 0.04, ease: "easeInOut" },
          ),
        ]),
    },
    // swirled round in a little circle, twice, to mix it
    swirl: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const { tube, liquid } = swirl()
        return Promise.all([
          animate("[data-part=tube]", tube, { duration: seconds, ease: "linear" }),
          animate("[data-part=liquid]", liquid, { duration: seconds, ease: "linear" }),
        ])
      },
    },
  },
  render: () => (
    <g data-part="tube" style={pivot("50% 0%")}>
      {/* the liquid fills the round bottom and reaches into the walls, so it meets the glass */}
      <path data-part="liquid" d="M9 12h6v6a3 3 0 0 1-6 0z" fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
      {/* the bubbles wait in the liquid (accent on accent, unseen), centred with 1 clear of either wall */}
      {[0, 1, 2].map((i) => (
        <rect key={i} data-part="bubble" x="11" y="12" width="2" height="2" fill={slot.accent} stroke="none" style={flash()} />
      ))}
      {/* straight walls with a flared lip, and a round bottom: the one genuinely round part */}
      <path d="M7 2h2v16a3 3 0 0 0 6 0V2h2" />
    </g>
  ),
})
