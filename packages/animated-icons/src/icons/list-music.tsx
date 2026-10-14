"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "list-music": "play" | "flip" | "shuffle"
  }
}

/** Track rows, 6 apart, each stopping 2 clear of the note. */
const ROWS = ["M3 6h12", "M3 12h8", "M3 18h7"] as const

/** 2 colors: track rows (primary), note (accent). */
export const ListMusic = createAnimatedIcon({
  name: "list-music",
  family: "list",
  category: "media",
  keywords: ["playlist", "queue", "tracks", "music", "songs", "library", "audio"],
  slots: { primary: "track rows", accent: "note" },
  defaultVariant: "play",
  variants: {
    // the note bounces on the beat, stretching up and squashing down, while the rows pump like levels
    play: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=note]",
            {
              y: [0, -2, 0, -1.5, 0, 0],
              scaleY: [1, 1.05, 0.82, 1.04, 0.9, 1],
              scaleX: [1, 0.94, 1.15, 0.96, 1.08, 1],
            },
            { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: ["easeOut", "easeIn", "easeOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=row]",
            { scaleX: [1, 0.45, 1, 0.65, 1] },
            { duration: seconds * 0.8, delay: stagger(seconds * 0.1), ease: "easeInOut" },
          ),
        ]),
    },
    // the note hops and turns over in 3D like a tossed coin, landing back face-on
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=note]",
            // turned about its head the stem would swing left through the top row, so the note drifts right
            // while it shows its back
            { scaleX: [1, 0, -1, 0, 1], skewY: [0, 10, 0, -10, 0], x: [0, 1.5, 3, 1.5, 0] },
            { duration: seconds * 0.8, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=note]",
            { y: [0, -2, 0, 0], scaleY: [1, 1, 0.85, 1] },
            { duration: seconds, times: [0, 0.4, 0.8, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
        ]),
    },
    // next track: the rows slip out to the left and slide back in one after another, the note nodding
    shuffle: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...ROWS.map((_, i) => {
            const start = 0.3 + i * 0.15
            return animate(
              `[data-part=row][data-row="${i}"]`,
              { x: [0, -8, -8, 0, 0], opacity: [1, 0, 0, 1, 1] },
              { duration: seconds, times: [0, 0.2, start, start + 0.35, 1], ease: [ease.in, "linear", ease.out, "linear"] },
            )
          }),
          animate(
            "[data-part=note]",
            { rotate: [0, -14, 8, -3, 0] },
            { duration: seconds * 0.8, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {ROWS.map((d, i) => (
        <path key={d} data-part="row" data-row={i} d={d} style={pivot("0% 50%")} />
      ))}
      {/* a note: round head (a true circle), straight stem rising off its right side */}
      <g data-part="note" stroke={slot.accent} style={pivot("50% 100%")}>
        <circle cx="17" cy="17" r="2.5" />
        <path d="M19.5 17V5" />
      </g>
    </>
  ),
})
