"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    origami: "flap" | "fly" | "turn"
  }
}

/** 2 colors: body and far wing (primary), near wing (accent). */
export const Origami = createAnimatedIcon({
  name: "origami",
  category: "design",
  keywords: ["paper crane", "paper bird", "paper", "fold", "craft", "bird", "japanese", "kids"],
  slots: { primary: "body + far wing", accent: "near wing" },
  defaultVariant: "flap",
  variants: {
    // the paper wings beat twice, folding down in perspective one after the other, and the bird lifts on each beat
    flap: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const times = [0, 0.25, 0.5, 0.75, 1]
        return Promise.all([
          animate(
            "[data-part=wing]",
            { scaleY: [1, 0.2, 1, 0.25, 1], skewX: [0, 18, 0, 14, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=far]",
            { scaleY: [1, 1, 0.3, 1, 0.35, 1], skewX: [0, 0, -14, 0, -10, 0] },
            { duration: seconds, times: [0, 0.12, 0.37, 0.62, 0.87, 1], ease: "easeInOut" },
          ),
          animate("[data-part=crane]", { y: [0, -2, 0, -2, 0] }, { duration: seconds, times, ease: "easeInOut" }),
        ])
      },
    },
    // takes off out to the right, flapping hard, and glides back in from the left
    fly: {
      duration: 1500,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=crane]",
            { x: [0, 0, 24, -24, 0], y: [0, 1, -6, 4, 0], rotate: [0, 6, -14, -10, 0] },
            { duration: seconds, times: [0, 0.12, 0.45, 0.451, 1], ease: ["easeOut", ease.in, snap, ease.out] },
          ),
          animate(
            "[data-part=wing], [data-part=far]",
            { scaleY: [1, 0.2, 1, 0.2, 1, 0.3, 1], skewX: [0, 18, 0, 18, 0, 12, 0] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // turns round on the spot like paper on a string to fly the other way, hopping as it turns, then turns home
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.4, 0.6, 0.8, 1]
        return animate(
          "[data-part=crane]",
          {
            scaleX: [1, 0, -1, -1, 0, 1],
            scaleY: [1, 0.9, 1, 1, 0.9, 1],
            y: [0, -2, 0, 0, -2, 0],
          },
          { duration: seconds, times, ease: ["easeIn", "easeOut", "linear", "easeIn", "easeOut"] },
        )
      },
    },
  },
  render: () => (
    <g data-part="crane" style={pivot("50% 50%")}>
      {/* a folded paper bird in flight: a flat, faceted body */}
      <path d="M2 16 8 14h8l6 2-10 4Z" />
      {/* the far wing, raised behind */}
      <path data-part="far" d="M8 14 5 5l6 9" style={pivot("50% 100%")} />
      {/* the near wing, swept up and back; both fold from their base on the back */}
      <path data-part="wing" d="M11 14l8-11-3 11" stroke={slot.accent} style={pivot("50% 100%")} />
    </g>
  ),
})
