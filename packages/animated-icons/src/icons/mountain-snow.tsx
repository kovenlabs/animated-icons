"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "mountain-snow": "snowfall" | "rise" | "turn"
  }
}

/** A tall peak at (9, 3), a valley, then a lower peak at (16, 7), on a flat base. */
const RANGE = "M2 21 9 3l4 8 3-4 6 14z"

/**
 * The snow cap: the summit down to a jagged snowline, its sides lying on the peak's flanks. Scaled about
 * the summit, it stays on those flanks up to 1.14×, where its right corner reaches the valley.
 */
const CAP = "M9 3l3.5 7-1.5 2.5L9.5 11 8 13.5 6.5 12l-1.39 1z"

/** Flakes start in open sky and melt away before they reach a slope. */
const FLAKES = [
  { part: "flake-a", x: 17.5, y: 2, fall: 4 },
  { part: "flake-b", x: 2.5, y: 4, fall: 4 },
  { part: "flake-c", x: 12.5, y: 2, fall: 2.5 },
]

/** 2 colors: mountains (primary), snow cap and flakes (accent). */
export const MountainSnow = createAnimatedIcon({
  name: "mountain-snow",
  family: "mountain",
  category: "nature",
  keywords: ["snow", "peak", "summit", "alps", "winter", "ski", "landscape", "glacier"],
  slots: { primary: "mountains", accent: "snow cap + flakes" },
  defaultVariant: "snowfall",
  variants: {
    // the cap shrinks back to the summit, flakes drift down, and it builds up again past its line
    snowfall: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cap]",
            { scale: [1, 0.45, 0.45, 1.12, 1] },
            { duration: seconds, times: [0, 0.18, 0.3, 0.8, 1], ease: ["easeIn", "linear", "easeOut", ease.overshoot] },
          ),
          ...FLAKES.map(({ part, fall }, i) =>
            animate(
              `[data-part=${part}]`,
              { y: [0, fall], opacity: [0, 1, 1, 0] },
              { duration: seconds * 0.5, delay: seconds * (0.15 + i * 0.13), ease: "easeIn" },
            ),
          ),
        ]),
    },
    // the range dives into the ground and heaves back up past its height; the snow lands on top last
    rise: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=range]",
            { scaleY: [1, 0.05, 0.05, 1.14, 0.95, 1], scaleX: [1, 1.12, 1.12, 0.95, 1.02, 1] },
            { duration: seconds, times: [0, 0.15, 0.25, 0.58, 0.78, 1], ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=cap]",
            { scale: [1, 1, 0, 0, 1.12, 1] },
            { duration: seconds, times: [0, 0.15, 0.16, 0.5, 0.78, 1], ease: ["linear", "linear", "linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // the range turns a full circle on a turntable, shrinking away as it shows its far side
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=range]",
          { scaleX: [1, -1, 1], scale: [1, 0.85, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="range" style={pivot("50% 100%")}>
        {/* the cap's fill tucks under the outline, which draws over it */}
        <path data-part="cap" d={CAP} fill={slot.accent} stroke="none" style={pivot("52.64% 0%")} />
        <path d={RANGE} />
      </g>
      <g fill={slot.accent} stroke="none">
        {FLAKES.map(({ part, x, y }) => (
          <rect key={part} data-part={part} x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
    </>
  ),
})
