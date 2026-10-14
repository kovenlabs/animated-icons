"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    birdhouse: "chirp" | "turn" | "sway"
  }
}

const TURN = spin(1, "inOut")

/** 2 colors: house, hole and pole (primary), roof (accent). */
export const Birdhouse = createAnimatedIcon({
  name: "birdhouse",
  category: "nature",
  keywords: ["bird house", "nest box", "birdfeeder", "garden", "nest", "spring", "wildlife", "backyard"],
  slots: { primary: "house + hole + pole", accent: "roof" },
  defaultVariant: "chirp",
  variants: {
    // someone's home: the house crouches and springs up on its pole, the roof hops off its walls and
    // lands with a rattle, and the hole winks
    chirp: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=box]",
            { scaleY: [1, 0.88, 1.03, 0.96, 1], scaleX: [1, 1.08, 0.97, 1.02, 1] },
            { duration: seconds * 0.6, times: [0, 0.3, 0.55, 0.78, 1], ease: ["easeIn", ease.out, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=roof]",
            { y: [0, 0, -1.5, 0, -0.5, 0], rotate: [0, 0, -6, 0, 3, 0] },
            { duration: seconds * 0.7, times: [0, 0.25, 0.45, 0.65, 0.8, 1], ease: ["linear", ease.out, ease.in, "easeOut", "easeIn"] },
          ),
          animate(
            "[data-part=hole]",
            { scaleY: [1, 1, 0.15, 1] },
            { duration: seconds, times: [0, 0.72, 0.84, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the house turns right round on its pole, showing its blank back (no hole there) before coming
    // back to face you
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=face]", { scaleX: TURN.scaleX }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate(
            "[data-part=hole]",
            { opacity: [1, 0, 0, 0, 1] },
            { duration: seconds, times: TURN.times, ease: "easeInOut" },
          ),
        ]),
    },
    // the wind rocks it on its post, and the house sways on top a beat behind, leaning into each gust
    sway: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=birdhouse]",
            { rotate: [0, -6, 5, -3, 1.5, 0] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=box]",
            { skewX: [0, 0, 4, -4, 2, 0] },
            { duration: seconds, times: [0, 0.1, 0.32, 0.54, 0.76, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // rocks on the foot of its pole
    <g data-part="birdhouse" style={pivot("50% 100%")}>
      <path d="M12 19v2.5" />
      {/* the house sits on the top of the pole */}
      <g data-part="box" style={pivot("50% 100%")}>
        <g data-part="face" style={pivot("50% 50%")}>
          <path d="M6 10v9M18 10v9M4 19h16" />
          <circle data-part="hole" cx="12" cy="13" r="2" style={pivot("50% 50%")} />
          {/* drawn last so the eaves cover the tops of the walls */}
          <path data-part="roof" d="M4 12l8-8 8 8" stroke={slot.accent} style={pivot("50% 100%")} />
        </g>
      </g>
    </g>
  ),
})
