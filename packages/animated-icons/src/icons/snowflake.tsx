"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    snowflake: "spin" | "sparkle"
  }
}

/** Six arms, 60° apart, each turned into place from the one pointing up. */
const ARMS = [0, 60, 120, 180, 240, 300]

/** 2 colors: arms (primary), branch tips (accent). */
export const Snowflake = createAnimatedIcon({
  name: "snowflake",
  category: "weather",
  keywords: ["snow", "winter", "cold", "frost", "freeze", "ice", "christmas", "air conditioning"],
  slots: { primary: "arms", accent: "branch tips" },
  defaultVariant: "spin",
  variants: {
    // a third of a turn, easing in and out. The flake has six-fold symmetry, so the frame snaps back
    // to rest unseen at the end
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=flake]",
          { rotate: [0, 120, 0] },
          { duration: seconds, times: [0, 1, 1], ease: ["easeInOut", "linear"] },
        ),
    },
    // the branch tips flare one after another, round the flake
    sparkle: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=tip]",
          { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] },
          { duration: seconds * 0.5, delay: stagger(seconds * 0.1), ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="flake" style={pivot("50% 50%")}>
      {ARMS.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 12 12)`}>
          <path d="M12 12V3" />
          <path data-part="tip" d="M9.5 3.5 12 6l2.5-2.5" stroke={slot.accent} style={pivot("50% 100%")} />
        </g>
      ))}
    </g>
  ),
})
