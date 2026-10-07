"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sunrise: "rise" | "ascend" | "glow"
  }
}

/**
 * Four rays round the half sun, left to right, each with the way it points out from the sun's centre
 * (12, 18): flat at the sun's base on either side, and the two upper diagonals.
 */
const RAYS = [
  { d: "M2 18h2", out: { x: -1, y: 0 } },
  { d: "M5 11l1.5 1.5", out: { x: -1, y: -1 } },
  { d: "M19 11l-1.5 1.5", out: { x: 1, y: -1 } },
  { d: "M20 18h2", out: { x: 1, y: 0 } },
]

/** 2 colors: horizon and arrow (primary), sun and rays (accent). */
export const Sunrise = createAnimatedIcon({
  name: "sunrise",
  category: "weather",
  keywords: ["dawn", "morning", "sun", "daybreak", "sunup", "early", "wake up", "weather"],
  slots: { primary: "horizon + arrow", accent: "sun + rays" },
  defaultVariant: "rise",
  variants: {
    // the sun sinks out of sight and rises back into place, its rays opening once it is up
    rise: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sun]",
            { y: [0, 2.5, 0], opacity: [1, 0, 1] },
            { duration: seconds * 0.85, times: [0, 0.3, 1], ease: ["easeIn", ease.out] },
          ),
          animate(
            "[data-part=rays]",
            { scale: [1, 0.6, 0.6, 1.12, 1], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the arrow climbs out through the top of the frame and comes back up from just above the sun
    ascend: {
      clip: true,
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, -6, 2, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.4, 0.45, 1], ease: [ease.in, "linear", ease.out] },
        ),
    },
    // the rays push outward one after another, left to right, while the sun swells a touch
    glow: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...RAYS.map(({ out }, i) =>
            animate(
              `[data-part=ray-${i}]`,
              { x: [0, out.x, 0], y: [0, out.y, 0] },
              { duration: seconds * 0.55, delay: seconds * 0.15 * i, ease: "easeInOut" },
            ),
          ),
          animate("[data-part=sun]", { scale: [1, 1.1, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <path d="M2 22h20" />
      <g data-part="arrow">
        <path d="M12 2v7" />
        <path d="M9 5l3-3 3 3" />
      </g>
      <g stroke={slot.accent}>
        {/* the sun is round, so its upper half is a true arc, standing on the line of the side rays */}
        <path data-part="sun" d="M8 18a4 4 0 0 1 8 0" style={pivot("50% 100%")} />
        <g data-part="rays" style={pivot("50% 100%")}>
          {RAYS.map(({ d }, i) => (
            <path key={d} data-part={`ray-${i}`} d={d} />
          ))}
        </g>
      </g>
    </>
  ),
})
