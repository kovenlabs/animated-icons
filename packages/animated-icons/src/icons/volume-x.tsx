"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "volume-x": "mute" | "shake" | "strike"
  }
}

/** The X's two strokes, a 6px square centred where `volume`'s waves start (18, 12). */
const STROKES = ["M15 9l6 6", "M21 9l-6 6"]

/** 2 colors: speaker (primary), X (accent). */
export const VolumeX = createAnimatedIcon({
  name: "volume-x",
  family: "volume",
  category: "media",
  keywords: ["mute", "muted", "sound off", "no sound", "silent", "audio off", "speaker off"],
  slots: { primary: "speaker", accent: "X" },
  defaultVariant: "mute",
  variants: {
    // the X pops toward you and spins a full turn on its upright axis; the speaker flinches back from it
    mute: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=x]",
            { scale: [1, 1.35, 1.35, 1] },
            { duration: seconds, times: [0, 0.2, 0.75, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=turn]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.75, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=speaker]",
            { scale: [1, 0.86, 0.86, 1] },
            { duration: seconds, times: [0, 0.2, 0.7, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
        ]),
    },
    // the X shakes its head: no
    shake: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=x]",
          { rotate: [0, -24, 20, -14, 7, 0], x: [0, -1.5, 1.5, -1, 0.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the X is wiped away, then struck across again one stroke at a time; the speaker jolts at each stroke
    strike: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds * 0.8, delay: stagger(seconds * 0.2) } as const
        return Promise.all([
          animate("[data-part=stroke]", { pathLength: [1, 0, 0, 1] }, { ...timing, times: [0, 0.3, 0.45, 0.8], ease: "easeInOut" }),
          // the square cap would leave a dot at zero length: off from the moment it is wiped until it is struck
          animate(
            "[data-part=stroke]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { ...timing, times: [0, 0.28, 0.3, 0.45, 0.48, 1], ease: "linear" },
          ),
          animate(
            "[data-part=speaker]",
            { x: [0, 0, -1.5, 0, -1.5, 0] },
            { duration: seconds, times: [0, 0.6, 0.68, 0.78, 0.88, 1], ease: "easeOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <>
      {/* the `volume` speaker: a box with a flared cone, straight segments only */}
      <path data-part="speaker" d="M3 9h4l4-4v14l-4-4H3Z" style={pivot("0% 50%")} />
      <g data-part="x" stroke={slot.accent} style={pivot("50% 50%")}>
        <g data-part="turn" style={pivot("50% 50%")}>
          {STROKES.map((d) => (
            <path key={d} data-part="stroke" d={d} />
          ))}
        </g>
      </g>
    </>
  ),
})
