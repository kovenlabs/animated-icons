"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "bug-play": "run" | "flip" | "startle"
  }
}

/**
 * The bug's legs, each pivoting where it meets the body. The play button takes the lower right, so
 * the right side keeps only its front leg; the two groups swing in opposite tripods.
 */
const LEGS = [
  { group: "outer", d: "M4 11 2 9", origin: "100% 100%" },
  { group: "middle", d: "M4 15H2", origin: "100% 50%" },
  { group: "outer", d: "M6 17l-2.5 2.5", origin: "100% 0%" },
  { group: "middle", d: "M14 11l2-2", origin: "0% 100%" },
] as const

/** 2 colors: bug (primary), play button (accent). */
export const BugPlay = createAnimatedIcon({
  name: "bug-play",
  family: "bug",
  category: "development",
  keywords: ["debug", "run debugger", "start debugging", "bug", "play", "launch", "test run"],
  slots: { primary: "bug", accent: "play button" },
  defaultVariant: "run",
  variants: {
    // the play button is pressed in and springs back, and the bug bursts into a scuttle, bobbing on
    // its legs
    run: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const times = [0, 0.25, 0.4, 0.55, 0.7, 0.85, 1]
        const legs = { duration: seconds, times, ease: "easeInOut" as const }
        return Promise.all([
          animate(
            "[data-part=play]",
            { scale: [1, 0.65, 1.15, 1] },
            { duration: seconds * 0.45, times: [0, 0.35, 0.7, 1], ease: ["easeIn", "easeOut", "easeInOut"] },
          ),
          animate("[data-part=outer]", { rotate: [0, 0, 22, -22, 22, -22, 0] }, legs),
          animate("[data-part=middle]", { rotate: [0, 0, -22, 22, -22, 22, 0] }, legs),
          animate("[data-part=bug]", { y: [0, 0, -1, 0, -1, 0, 0] }, legs),
        ])
      },
    },
    // the play button turns over like a card, leaning into the turn, while the antennae flick after it
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds * 0.8, ease: "easeInOut" as const }
        return Promise.all([
          animate(
            "[data-part=play]",
            { scaleX: [1, -1, 1], skewY: [0, 15, 0, -15, 0], scale: [1, 1.15, 1] },
            timing,
          ),
          animate("[data-part=antenna-left]", { rotate: [0, -30, 10, -20, 0] }, { ...timing, delay: seconds * 0.15 }),
          animate("[data-part=antenna-right]", { rotate: [0, 30, -10, 20, 0] }, { ...timing, delay: seconds * 0.2 }),
        ])
      },
    },
    // the bug jumps out of its skin: it leaps up a hair and wobbles on its feet, antennae flung wide,
    // while the play button shrinks back in alarm and pops out again
    startle: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bug]",
            { y: [0, -1, 0, 0, 0, 0], skewX: [0, 0, -8, 7, -4, 0], scaleY: [1, 1.04, 0.92, 1, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.3, 0.5, 0.7, 0.9], ease: "easeInOut" },
          ),
          animate("[data-part=antenna-left]", { rotate: [0, -35, -35, 0] }, { duration: seconds, times: [0, 0.15, 0.55, 1] }),
          animate("[data-part=antenna-right]", { rotate: [0, 35, 35, 0] }, { duration: seconds, times: [0, 0.15, 0.55, 1] }),
          animate(
            "[data-part=play]",
            { scale: [1, 0.55, 0.55, 1.15, 1] },
            { duration: seconds, times: [0, 0.15, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="bug" style={pivot("50% 100%")}>
        {/* a shield body split by its wing seam, under a solid head */}
        <path d="M4 11l2-2h6l2 2v4l-4 4H8l-4-4Z" />
        <path d="M9 9v7" />
        <path d="M6.5 9l1-3h3l1 3Z" fill={slot.primary} />
        <path data-part="antenna-left" d="M7.5 6 5.5 3" style={pivot("100% 100%")} />
        <path data-part="antenna-right" d="M10.5 6l2-3" style={pivot("0% 100%")} />
        {LEGS.map(({ group, d, origin }) => (
          <path key={d} data-part={group} d={d} style={pivot(origin)} />
        ))}
      </g>
      {/* a solid play triangle in the lower-right corner */}
      <path data-part="play" d="M17 13.5v8l5-4Z" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </>
  ),
})
