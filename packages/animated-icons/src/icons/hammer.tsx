"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    hammer: "strike" | "tap" | "twirl"
  }
}

/**
 * Sparks fanning off the striking face (the head's lower-right end), each drawn from its inner end
 * outward (the end it scales from).
 */
const SPARKS = [
  { d: "M15.5 15.5v2", origin: "50% 0%" },
  { d: "M17.5 13.5l1.5 1.5", origin: "0% 0%" },
  { d: "M19.5 11.5h2", origin: "0% 50%" },
]

/** 2 colors: handle (primary), head and impact sparks (accent). */
export const Hammer = createAnimatedIcon({
  name: "hammer",
  category: "development",
  keywords: ["tool", "build", "construction", "repair", "fix", "diy", "nail", "craft"],
  slots: { primary: "handle", accent: "head + sparks" },
  defaultVariant: "strike",
  variants: {
    // wound back from the grip, brought down hard; sparks fly off the face on impact
    strike: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hammer]",
            { rotate: [0, -22, 3, 0] },
            { duration: seconds, times: [0, 0.45, 0.65, 1], ease: ["easeOut", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=spark]",
            { opacity: [0, 1, 0], scale: [0.6, 1, 1.1] },
            { duration: seconds * 0.38, delay: seconds * 0.6, ease: "easeOut" },
          ),
        ]),
    },
    // two quick, light knocks from the wrist, a flicker of sparks on each
    tap: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hammer]",
            { rotate: [0, -9, 0, -9, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=spark]",
            { opacity: [0, 0, 1, 0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.38, 0.45, 0.6, 0.78, 0.85, 1], ease: "linear" },
          ),
        ]),
    },
    // tossed into a full twirl about its middle and caught, drawn in a little so it stays in frame
    twirl: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=hammer-body]",
          { rotate: [0, 360], scale: [1, 0.85, 1] },
          { duration: seconds, ease: "easeInOut" },
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
      <g data-part="hammer-body" style={pivot("50% 50%")}>
        {/* swings from the end of the grip, its box's bottom-left corner */}
        <g data-part="hammer" style={pivot("0% 100%")}>
          {/* the handle starts under the head's edge, so its cap hides in the stroke */}
          <path d="M11 10 3 18" />
          {/* a block head across the handle; the face is its lower-right end */}
          <path d="M8 7l3-3 6 6-3 3Z" stroke={slot.accent} />
        </g>
      </g>
    </>
  ),
})
