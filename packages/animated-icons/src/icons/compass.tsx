"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    compass: "swing" | "spin"
  }
}

/** 3 colors: case (primary), south half of the needle (secondary), north half (accent). */
export const CompassIcon = createAnimatedIcon({
  name: "compass",
  category: "navigation",
  keywords: ["direction", "north", "explore", "navigate", "orientation", "bearing", "discover"],
  slots: { primary: "case", secondary: "needle south", accent: "needle north" },
  defaultVariant: "swing",
  variants: {
    // the needle is knocked off north, swings back past it and settles
    swing: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=needle]", { rotate: [0, -25, 16, -8, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // spins a full turn, overshoots and finds north again
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=needle]",
          { rotate: [0, 390, 348, 366, 360] },
          { duration: seconds, times: [0, 0.45, 0.7, 0.85, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the case is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      {/* the needle rests pointing north-east; it turns on the centre of the case */}
      <g transform="rotate(45 12 12)">
        <g data-part="needle" stroke="none" style={pivot("50% 50%")}>
          <path d="M12 4.5l3 7.5H9Z" fill={slot.accent} />
          <path d="M9 12h6l-3 7.5Z" fill={slot.secondary} />
        </g>
      </g>
    </>
  ),
})
