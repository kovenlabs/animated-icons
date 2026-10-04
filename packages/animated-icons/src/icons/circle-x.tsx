"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-x": "shake" | "cross" | "pop"
  }
}

/** The two strokes of the cross, 3px each side of the centre: the first falls left to right, the second crosses it. */
const STROKES = [
  { part: "stroke-1", d: "M9 9l6 6" },
  { part: "stroke-2", d: "M15 9l-6 6" },
] as const

/** 2 colors: ring (primary), cross (accent). */
export const CircleX = createAnimatedIcon({
  name: "circle-x",
  family: "circle",
  category: "status",
  keywords: ["error", "close", "cancel", "remove", "failed", "delete", "invalid"],
  slots: { primary: "ring", accent: "cross" },
  defaultVariant: "shake",
  variants: {
    // a quick no-no shake on its centre
    shake: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=badge]",
          { rotate: [0, -12, 10, -7, 4, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the cross fades out and strikes again, one stroke after the other; each is hidden while too short to read
    cross: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all(
          STROKES.map(({ part }, i) => {
            const start = 0.2 + i * 0.35
            return Promise.all([
              animate(
                `[data-part=${part}]`,
                { opacity: [1, 0, 0, 1, 1] },
                { duration: seconds, times: [0, 0.15, start, start + 0.01, 1] },
              ),
              animate(
                `[data-part=${part}]`,
                { pathLength: [1, 1, 0, 1, 1] },
                { duration: seconds, times: [0, start - 0.01, start, start + 0.35, 1], ease: "easeOut" },
              ),
            ])
          }),
        ),
    },
    // the cross punches out from the middle and settles
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=cross]", { scale: [1, 1.2, 0.95, 1] }, { duration: seconds, ease: ease.out }),
    },
  },
  render: () => (
    <g data-part="badge" style={pivot("50% 50%")}>
      {/* a ring is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      <g data-part="cross" stroke={slot.accent} style={pivot("50% 50%")}>
        {STROKES.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} />
        ))}
      </g>
    </g>
  ),
})
