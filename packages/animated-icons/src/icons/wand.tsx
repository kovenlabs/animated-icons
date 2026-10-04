"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    wand: "burst" | "flick"
  }
}

/**
 * The three sparkles, each with where it starts a burst from: most of the way back to the wand's
 * tip (14, 10), so it grows out of the tip without crossing the stick. `at` staggers them.
 */
const SPARKLES = [
  { part: "big", d: "M18 3v6M15 6h6", from: { x: -2.75, y: 2.75 }, at: 0 },
  { part: "left", d: "M7 4v4M5 6h4", from: { x: 4.5, y: 2.5 }, at: 0.12 },
  { part: "right", d: "M19 13v4M17 15h4", from: { x: -3.5, y: -3.5 }, at: 0.24 },
] as const

const ALL_SPARKLES = SPARKLES.map(({ part }) => `[data-part=${part}]`).join(", ")

/** 3 colors: stick (primary), tip (secondary), sparkles (accent). */
export const Wand = createAnimatedIcon({
  name: "wand",
  category: "design",
  keywords: ["magic", "sparkles", "auto", "enhance", "generate", "ai", "wizard"],
  slots: { primary: "stick", secondary: "tip", accent: "sparkles" },
  defaultVariant: "burst",
  variants: {
    // the sparkles burst out of the tip one after another, overshoot a touch and settle in place.
    // Each waits at the tip (scale 0) until its turn, so none blinks out before it bursts
    burst: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          SPARKLES.map(({ part, from, at }) => {
            const grow = at + (1 - at) * 0.6
            return Promise.all([
              animate(
                `[data-part=${part}]`,
                { x: [from.x, from.x, 0], y: [from.y, from.y, 0] },
                { duration: seconds, times: [0, at, grow], ease: ["linear", ease.out] },
              ),
              animate(
                `[data-part=${part}]`,
                { scale: [0, 0, 1.2, 1] },
                { duration: seconds, times: [0, at, grow, 1], ease: ["linear", ease.out, "easeInOut"] },
              ),
            ])
          }),
        ),
    },
    // the wand winds back and flicks forward from the handle, and the sparkles answer with a twinkle
    flick: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=wand]",
            { rotate: [0, -7, 5, -2, 0] },
            { duration: seconds * 0.7, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            ALL_SPARKLES,
            { scale: [1, 1, 1.3, 1] },
            { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a slim 45° stick; pivots on its handle end, bottom-left */}
      <g data-part="wand" style={pivot("11.5% 88.5%")}>
        <path d="M9 12 2.5 18.5l3 3L12 15" />
        {/* the tip, set off from the stick by a band */}
        <path d="M9 12l3.5-3.5 3 3L12 15Z" stroke={slot.secondary} />
      </g>
      <g stroke={slot.accent}>
        {SPARKLES.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} style={pivot("50% 50%")} />
        ))}
      </g>
    </>
  ),
})
