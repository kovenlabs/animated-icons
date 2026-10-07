"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    piano: "run" | "tilt" | "chord"
  }
}

/** The lit-up front of white key i (of 4, each 5 wide): its 3px interior, 2 below the black keys. */
const lit = (i: number) => ({ x: 3 + i * 5, y: 14, width: 3, height: 4 })

/** 2 colors: keyboard (primary), black keys and pressed keys (accent). */
export const Piano = createAnimatedIcon({
  name: "piano",
  category: "media",
  keywords: ["keyboard", "keys", "instrument", "music", "synth", "melody", "play", "notes"],
  slots: { primary: "keyboard", accent: "black keys + pressed keys" },
  defaultVariant: "run",
  variants: {
    // a chromatic run up the keys, white and black in turn: each white key lights as it is struck, each
    // black key sinks, and the keyboard dips a little under the last note
    run: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const step = seconds / 7
        const press = (part: string, keyframes: Record<string, number[]>, at: number) =>
          animate(`[data-part=${part}]`, keyframes, { duration: step * 1.8, delay: step * at, ease: "easeOut" })
        const light = { opacity: [0, 1, 0], scaleY: [0.4, 1, 1] }
        const sink = { scaleY: [1, 0.72, 1], opacity: [1, 0.6, 1] }
        return Promise.all([
          press("key-1", light, 0),
          press("black-1", sink, 0.8),
          press("key-2", light, 1.6),
          press("black-2", sink, 2.4),
          press("key-3", light, 3.2),
          press("key-4", light, 4),
          animate(
            "[data-part=piano]",
            { y: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.6, 0.72, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
    // the keyboard leans back into perspective, as if seen from the bench, and swings upright again
    tilt: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=piano]",
          { scaleY: [1, 0.55, 0.55, 1], skewX: [0, -28, -28, 0], y: [0, 1, 1, 0] },
          { duration: seconds, times: [0, 0.3, 0.6, 1], ease: ["easeInOut", "linear", ease.overshoot] },
        ),
    },
    // a big chord: three keys struck at once, the keyboard squashes under the hands and bounces back
    chord: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=key-1], [data-part=key-3], [data-part=key-4]",
            { opacity: [0, 1, 1, 0], scaleY: [0.4, 1, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.6, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=black-2]",
            { scaleY: [1, 0.72, 0.72, 1] },
            { duration: seconds, times: [0, 0.15, 0.6, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=piano]",
            { scaleY: [1, 0.86, 1.05, 1], scaleX: [1, 1.05, 0.98, 1], y: [0, 0, -1.5, 0] },
            { duration: seconds, times: [0, 0.15, 0.45, 1], ease: ["easeOut", "easeOut", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="piano" style={pivot("50% 100%")}>
      {/* four white keys: the case, and the gaps between keys below the black keys (one runs full height) */}
      <path d="M2 5h20v14H2z" />
      <path d="M7 12v7M12 12v7M17 5v14" />
      <g fill={slot.accent} stroke="none">
        {/* two black keys hanging from the top, each straddling a gap */}
        <rect data-part="black-1" height="7" style={pivot("50% 0%")} width="3" x="5.5" y="5" />
        <rect data-part="black-2" height="7" style={pivot("50% 0%")} width="3" x="10.5" y="5" />
        {/* the front of each white key lights up when it is struck */}
        {[1, 2, 3, 4].map((n) => (
          <rect data-part={`key-${n}`} key={n} {...lit(n - 1)} style={flash("50% 100%")} />
        ))}
      </g>
    </g>
  ),
})
