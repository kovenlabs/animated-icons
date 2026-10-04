"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    armchair: "sit" | "rock" | "hop"
  }
}

/** 2 colors: chair (primary), seat cushion (accent). */
export const Armchair = createAnimatedIcon({
  name: "armchair",
  category: "navigation",
  keywords: ["chair", "seat", "furniture", "lounge", "sofa", "waiting room", "comfort"],
  slots: { primary: "chair", accent: "seat cushion" },
  defaultVariant: "sit",
  variants: {
    // someone sits down: the cushion sinks between the arms and springs back
    sit: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=seat]",
          { y: [0, 1.5, -0.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the chair rocks back and forth on its legs
    rock: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=chair]", { rotate: [0, -7, 5, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // scooted along: it hops and lands with a little squash
    hop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chair]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.03, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <g data-part="chair" style={pivot("50% 100%")}>
      {/* the backrest rises from the middle of each arm's top */}
      <path d="M5 9V4h14v5" />
      {/* both arms and the base in one stroke, opening onto the seat */}
      <path d="M7 13V9H3v9h18V9h-4v4" />
      <path d="M5 18v3M19 18v3" />
      <path data-part="seat" d="M7 13h10" stroke={slot.accent} />
    </g>
  ),
})
