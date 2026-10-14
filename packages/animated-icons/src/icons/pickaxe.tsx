"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    pickaxe: "swing" | "toss" | "turn"
  }
}

/**
 * A faceted crescent head square to the handle, arched away from it and tapering to two points, at
 * (5, 3) and (19, 17). The handle runs from the grip (2, 20) to the head's inner middle corner.
 */
const HEAD = "M5 3 11.5 3.5 16 6 18.5 10.5 19 17 16 13 13 9 9 5Z"

/** Sparks fanning off the lower point, each drawn from its inner end outward. */
const SPARKS = [
  { d: "M16.5 18.5 15 20", origin: "100% 0%" },
  { d: "M19 19.5V22", origin: "50% 0%" },
  { d: "M20.5 18.5 22 20", origin: "0% 0%" },
]

/** 2 colors: handle (primary), head and sparks (accent). */
export const Pickaxe = createAnimatedIcon({
  name: "pickaxe",
  category: "tools",
  keywords: ["pick", "mining", "dig", "mine", "tool", "excavate", "rock", "craft"],
  slots: { primary: "handle", accent: "head + sparks" },
  defaultVariant: "swing",
  variants: {
    // raised back away from you, swung down hard toward you onto rock, sparks bursting off the point
    swing: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pickaxe]",
            { rotate: [0, -14, 4, -2, 0], scale: [1, 0.9, 1.02, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.4, 0.58, 0.78, 1],
              ease: ["easeOut", ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=spark]",
            { opacity: [0, 1, 0], scale: [0.4, 1.3, 1] },
            { duration: seconds * 0.35, delay: seconds * 0.55, ease: "easeOut" },
          ),
        ]),
    },
    // flipped up end over end, shrinking into the distance at the top, and caught with a squash
    toss: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pickaxe-body]",
          { y: [0, -4, 0, 0], rotate: [0, -180, -360, -360], scale: [1, 0.65, 1.06, 1] },
          { duration: seconds, times: [0, 0.45, 0.8, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
        ),
    },
    // turned about its upright axis, the head swinging round so its points trade places, then back
    turn: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pickaxe-body]",
          { scaleX: [1, -1, -1, 1], y: [0, -2, -2, 0], scale: [1, 0.92, 0.92, 1] },
          { duration: seconds, times: [0, 0.4, 0.6, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {SPARKS.map(({ d, origin }) => (
          <path key={d} data-part="spark" d={d} style={flash(origin)} />
        ))}
      </g>
      <g data-part="pickaxe-body" style={pivot("50% 50%")}>
        {/* swings from the grip, its box's bottom-left corner */}
        <g data-part="pickaxe" style={pivot("0% 100%")}>
          <path d="M2 20 13 9" />
          <path d={HEAD} stroke={slot.accent} />
        </g>
      </g>
    </>
  ),
})
