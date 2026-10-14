"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "rocking-chair": "rock" | "doze" | "kick"
  }
}

/** 2 colors: chair (primary), rocker and z (accent). */
export const RockingChair = createAnimatedIcon({
  name: "rocking-chair",
  category: "navigation",
  keywords: ["chair", "rocker", "relax", "furniture", "porch", "rest", "nursery", "home"],
  slots: { primary: "chair", accent: "rocker + z" },
  defaultVariant: "rock",
  variants: {
    // rocks back and forth on its runner, each swing a little shorter. It turns about the runner's
    // centre of curve, so the runner rolls along the floor instead of lifting off it
    rock: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chair]",
          { rotate: [0, -12, 10, -6, 3, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // a slow, lulling rock while a z drifts up off the seat, growing as it floats toward you
    doze: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=chair]", { rotate: [0, -7, 5, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=z]",
            { opacity: [0, 1, 1, 0], scale: [0.4, 1, 1.2, 1.35], x: [0, 0.5, 1, 1.5], y: [0, -0.5, -1.5, -2] },
            { duration: seconds * 0.8, times: [0, 0.3, 0.75, 1], delay: seconds * 0.15, ease: "easeOut" },
          ),
        ]),
    },
    // kicked back hard: the chair squashes into the tilt, springs forward past upright with a stretch,
    // and wobbles to a stop
    kick: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chair]",
          {
            rotate: [0, -14, 12, -5, 2, 0],
            scaleY: [1, 0.92, 1.04, 0.98, 1, 1],
            scaleX: [1, 1.05, 0.97, 1.01, 1, 1],
          },
          { duration: seconds, times: [0, 0.2, 0.45, 0.68, 0.85, 1], ease: [ease.out, "easeInOut", "easeInOut", "easeInOut", "easeOut"] },
        ),
    },
  },
  render: () => (
    <>
      {/* a sleepy z floating above the seat */}
      <path data-part="z" d="M14 4h4l-4 4h4" stroke={slot.accent} style={flash("0% 100%")} />
      <g data-part="chair" style={pivot("50% 50%")}>
        {/* a raked backrest running into the seat, two splayed legs */}
        <path d="M5 3l3 10h10" />
        <path d="M9.5 13 8 21M14.5 13l1.5 8" />
        {/* the runner: a faceted bow, flat where it meets the floor */}
        <path d="M4 18l3 3h10l3-3" stroke={slot.accent} />
      </g>
    </>
  ),
})
