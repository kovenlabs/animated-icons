"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    vote: "cast" | "tick" | "wave"
  }
}

/** 2 colors: ballot box (primary), ballot and tick (accent). */
export const Vote = createAnimatedIcon({
  name: "vote",
  category: "social",
  keywords: ["ballot", "election", "poll", "elect", "choice", "survey", "cast vote"],
  slots: { primary: "ballot box", accent: "ballot + tick" },
  defaultVariant: "cast",
  variants: {
    // the ballot plunges into the box, the box squashes as it swallows it, and a fresh ballot pops up
    cast: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ballot]",
            { y: [0, -0.5, 5, 5, 0, 0], opacity: [1, 1, 0, 0, 1, 1], scale: [1, 1, 1, 0.5, 1.1, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.6, 0.8, 1], ease: ["easeOut", ease.in, "linear", ease.overshoot, "easeOut"] },
          ),
          animate(
            "[data-part=box]",
            { scaleY: [1, 1, 0.88, 1.04, 1], scaleX: [1, 1, 1.03, 0.99, 1] },
            { duration: seconds * 0.6, times: [0, 0.5, 0.65, 0.82, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the ballot turns round in perspective and the tick draws itself on its face
    tick: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ballot]",
            { scaleX: [1, 0, 1, 1, 1], scale: [1, 1, 1, 1.08, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=tick]",
            { pathLength: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.13, 0.52, 0.82, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=tick]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.52, 0.53, 1], ease: "linear" },
          ),
        ]),
    },
    // held up and waved: the ballot sways from the slot like a raised hand, bending in perspective
    wave: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ballot]",
            {
              rotate: [0, -10, 9, -7, 4, 0],
              skewY: [0, 5, -5, 4, -2, 0],
              y: [0, 1, 1, 0.8, 0.4, 0],
            },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=box]",
            { scaleY: [1, 0.96, 1, 0.97, 1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* an open-topped ballot box */}
      <path data-part="box" d="M2 11v10h20V11" style={pivot("50% 100%")} />
      {/* the ballot, half into the box, swaying from where it enters */}
      <g data-part="ballot" stroke={slot.accent} style={pivot("50% 100%")}>
        <path d="M6 12V2.5h12V12" />
        <path data-part="tick" d="M9.5 8.5l1.5 1.5 3.5-3.5" />
      </g>
    </>
  ),
})
