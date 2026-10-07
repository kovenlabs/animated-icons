"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "party-popper": "pop" | "flutter" | "shake"
  }
}

/** Where the confetti leaves the cone: just outside the rim of its mouth. */
const MOUTH = { x: 12, y: 12 }

/** Four 2×2 confetti squares, spread round the mouth. */
const CONFETTI = [
  { x: 4, y: 5 },
  { x: 9, y: 3 },
  { x: 20, y: 7 },
  { x: 17, y: 19 },
]

/** Two zigzag streamers, each drawn from the end nearest the mouth outwards. */
const STREAMERS = [
  { d: "M13 9l1-3 2-1 1-3", origin: "0% 100%" },
  { d: "M16 13l2-1 2 2 2-1", origin: "0% 50%" },
]

/** 2 colors: cone (primary), confetti + streamers (accent). */
export const PartyPopper = createAnimatedIcon({
  name: "party-popper",
  category: "social",
  keywords: ["celebrate", "party", "confetti", "congratulations", "birthday", "tada", "success", "festive"],
  slots: { primary: "cone", accent: "confetti + streamers" },
  defaultVariant: "pop",
  variants: {
    // it goes off: the cone kicks back in the hand, confetti bursts out of the mouth tumbling end over
    // end to land round it, and the streamers unfurl behind
    pop: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=popper]",
            { x: [0, -1.5, 0], y: [0, 1.5, 0], rotate: [0, 6, 0] },
            { duration: seconds * 0.5, times: [0, 0.2, 1], ease: ["easeOut", ease.overshoot] },
          ),
          ...CONFETTI.flatMap(({ x, y }, i) => [
            animate(
              `[data-part=bit-${i}]`,
              { x: [MOUTH.x - (x + 1), 0], y: [MOUTH.y - (y + 1), 0], opacity: [0, 1, 1], scale: [0.4, 1.4, 1] },
              { duration: seconds * 0.6, delay: seconds * (0.06 + 0.05 * i), ease: ease.out },
            ),
            animate(
              `[data-part=bit-${i}] [data-part=confetti]`,
              { rotate: [i % 2 ? 270 : -270, 0] },
              { duration: seconds * 0.7, delay: seconds * (0.06 + 0.05 * i), ease: ease.out },
            ),
          ]),
          // a square cap would dot the start of an undrawn streamer: hidden until it starts to draw
          animate(
            "[data-part=streamer]",
            { pathLength: [0, 1], opacity: [0, 1, 1] },
            { duration: seconds * 0.55, delay: seconds * 0.12, ease: ease.out },
          ),
        ]),
    },
    // the confetti hangs in the air: each square turns over and over on its own axis as it drifts
    // down a little, the streamers sway and the cone rocks in the hand
    flutter: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...CONFETTI.map((_, i) =>
            animate(
              `[data-part=bit-${i}] [data-part=confetti]`,
              i % 2
                ? { scaleY: [1, 0, -1, 0, 1], y: [0, 1, 1.5, 1, 0] }
                : { scaleX: [1, 0, -1, 0, 1], y: [0, 1, 1.5, 1, 0] },
              { duration: seconds * 0.8, delay: seconds * 0.06 * i, ease: "easeInOut" },
            ),
          ),
          ...STREAMERS.map((_, i) =>
            animate(
              `[data-part=streamer-${i}]`,
              { rotate: [0, i ? 10 : -10, i ? -6 : 6, 0] },
              { duration: seconds * 0.9, delay: seconds * 0.1 * i, ease: "easeInOut" },
            ),
          ),
          animate("[data-part=popper]", { rotate: [0, -6, 4, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // shaken hard to get the party going: the cone rattles in the fist, then the confetti and
    // streamers all jump at once
    shake: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=popper]",
            { rotate: [0, -10, 10, -10, 10, -6, 0] },
            { duration: seconds * 0.55, ease: "linear" },
          ),
          animate(
            "[data-part=confetti]",
            { scale: [1, 1, 1.8, 1], rotate: [0, 0, 45, 0] },
            { duration: seconds, times: [0, 0.5, 0.7, 1], ease: ["linear", "easeOut", ease.overshoot] },
          ),
          ...STREAMERS.map((_, i) =>
            animate(
              `[data-part=streamer-${i}]`,
              { scale: [1, 1, 1.25, 1] },
              { duration: seconds, times: [0, 0.5, 0.7, 1], ease: ["linear", "easeOut", ease.overshoot] },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {STREAMERS.map(({ d, origin }, i) => (
          <g key={d} data-part={`streamer-${i}`} style={pivot(origin)}>
            <path data-part="streamer" d={d} />
          </g>
        ))}
      </g>
      <g fill={slot.accent} stroke="none">
        {CONFETTI.map(({ x, y }, i) => (
          <g key={i} data-part={`bit-${i}`} style={pivot("50% 50%")}>
            <rect data-part="confetti" x={x} y={y} width="2" height="2" style={pivot("50% 50%")} />
          </g>
        ))}
      </g>
      {/* the cone, held by its point: two straight flanks out to a round mouth seen at an angle */}
      <g data-part="popper" style={pivot("0% 100%")}>
        <path d="M6 11 2 22l11-4" />
        <ellipse cx="9.5" cy="14.5" rx="5" ry="2" transform="rotate(45 9.5 14.5)" />
      </g>
    </>
  ),
})
