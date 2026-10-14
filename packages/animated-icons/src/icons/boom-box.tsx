"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "boom-box": "thump" | "turn" | "power"
  }
}

/** Two speakers, 2 clear of each other and of the body's inner edge. */
const SPEAKERS = [8, 16] as const

/** 2 colors: body + handle (primary), speakers (accent). */
export const BoomBox = createAnimatedIcon({
  name: "boom-box",
  category: "media",
  keywords: ["boombox", "stereo", "radio", "music", "speaker", "cassette", "ghetto blaster", "party"],
  slots: { primary: "body + handle", accent: "speakers" },
  defaultVariant: "thump",
  variants: {
    // two bass hits: the speakers punch out, the box squashes on each and the handle springs after it
    thump: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.15, 0.4, 0.55, 0.8, 1], ease: "easeOut" as const }
        return Promise.all([
          animate("[data-part=speaker]", { scale: [1, 1.35, 0.9, 1.3, 0.95, 1] }, timing),
          animate("[data-part=box]", { scaleY: [1, 0.9, 1.04, 0.92, 1.02, 1], scaleX: [1, 1.02, 0.98, 1.02, 0.99, 1] }, timing),
          animate(
            "[data-part=handle]",
            { scaleY: [1, 0.7, 1.25, 0.75, 1.15, 1] },
            { ...timing, delay: seconds * 0.04 },
          ),
        ])
      },
    },
    // turns on the spot in 3D: narrows and leans as it swings away, swings back, then the other way
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=box]",
            { scaleX: [1, 0.3, 1, 0.3, 1], skewY: [0, -12, 0, 12, 0], y: [0, -1.5, 0, -1.5, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
          // the speakers sit nearer than the box face, so they swell as they swing toward you
          animate(
            "[data-part=speaker]",
            { scale: [1, 0.8, 1.15, 0.8, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // switched on: the handle snaps up, then each speaker pops in with a kick of the box
    power: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handle]",
            { scaleY: [1, 0, 1.3, 1] },
            { duration: seconds * 0.5, times: [0, 0.2, 0.7, 1], ease: [ease.in, ease.out, "easeInOut"] },
          ),
          ...SPEAKERS.map((x, i) =>
            animate(
              `[data-part=speaker][data-x="${x}"]`,
              { scale: [1, 0, 0, 1.45, 1, 1] },
              {
                duration: seconds,
                times: [0, 0.15, 0.35 + i * 0.2, 0.55 + i * 0.2, 0.75 + i * 0.2, 1],
                ease: ["easeIn", "linear", ease.overshoot, "easeInOut", "linear"],
              },
            ),
          ),
          animate(
            "[data-part=box]",
            { scaleY: [1, 1, 0.93, 1, 0.93, 1, 1] },
            { duration: seconds, times: [0, 0.5, 0.58, 0.7, 0.78, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="box" style={pivot("50% 100%")}>
      <path data-part="handle" d="M5 9V4h14v5" style={pivot("50% 100%")} />
      <path d="M2 9h20v12H2Z" />
      <g stroke={slot.accent}>
        {/* speaker cones are round, so they are true circles */}
        {SPEAKERS.map((x) => (
          <circle key={x} data-part="speaker" data-x={x} cx={x} cy="15" r="2" style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
