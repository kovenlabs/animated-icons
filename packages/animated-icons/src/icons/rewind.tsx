"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    rewind: "flip" | "race" | "pulse"
  }
}

/**
 * `fast-forward` mirrored: two left-pointing triangles 9 wide and 14 tall, one behind the other, the back
 * one's point resting on the front one's flat edge. They only ever pull apart from that join, never across
 * it. `join` is where each one meets the other, relative to its own box.
 */
const TRIANGLES = [
  { part: "back", d: "M21 5v14l-9-7Z", join: "0% 50%" },
  { part: "front", d: "M12 5v14l-9-7Z", join: "100% 50%" },
] as const

/** 2 colors: outlines (primary), fills (accent). */
export const Rewind = createAnimatedIcon({
  name: "rewind",
  category: "media",
  keywords: ["back", "skip back", "seek", "reverse", "replay", "player", "media"],
  slots: { primary: "outlines", accent: "fills" },
  defaultVariant: "flip",
  variants: {
    // the triangles turn over like flip cards, back one first, lifting as they go edge-on
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          TRIANGLES.map(({ part }, i) =>
            animate(
              `[data-flip=${part}]`,
              { scaleX: [1, 0, 1, 0, 1], y: [0, -2, 0, -2, 0] },
              {
                duration: seconds * 0.75,
                delay: seconds * 0.25 * i,
                times: [0, 0.25, 0.5, 0.75, 1],
                ease: ["easeIn", "easeOut", "easeIn", "easeOut"],
              },
            ),
          ),
        ),
    },
    // stretched by the speed, the pair streaks out to the left, rushes back in from the right and brakes
    race: {
      clip: true,
      duration: 950,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pair]",
          { x: [0, -24, 24, 0, 0], scaleX: [1, 1.4, 1.4, 0.85, 1] },
          { duration: seconds, times: [0, 0.4, 0.401, 0.78, 1], ease: [ease.in, snap, ease.out, ease.overshoot] },
        ),
    },
    // a pulse runs back through them twice: each swells away from the join, back one first
    pulse: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          TRIANGLES.map(({ part }, i) =>
            animate(
              `[data-part=${part}]`,
              { scale: [1, 1.22, 1, 1.22, 1] },
              { duration: seconds * 0.8, delay: seconds * 0.2 * i, ease: "easeInOut" },
            ),
          ),
        ),
    },
  },
  render: () => (
    <g data-part="pair" style={pivot("50% 50%")}>
      {TRIANGLES.map(({ part, d, join }) => (
        // turns on its own centre line, swells from the join
        <g key={part} data-part="flip" data-flip={part} style={pivot("50% 50%")}>
          <g data-part={part} style={pivot(join)}>
            <path d={d} fill={slot.accent} stroke="none" />
            <path d={d} />
          </g>
        </g>
      ))}
    </g>
  ),
})
