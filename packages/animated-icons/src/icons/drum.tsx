"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    drum: "beat" | "tilt" | "boom"
  }
}

/** 2 colors: drum (primary), sticks (accent). */
export const Drum = createAnimatedIcon({
  name: "drum",
  category: "media",
  keywords: ["drums", "snare", "drumsticks", "percussion", "beat", "rhythm", "instrument", "music"],
  slots: { primary: "drum", accent: "sticks" },
  defaultVariant: "beat",
  variants: {
    // left, right, left: each stick lifts from the wrist and strikes, and the head gives under every hit
    beat: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stick-l]",
            { rotate: [0, -28, 0, 0, -28, 0, 0] },
            { duration: seconds, times: [0, 0.12, 0.24, 0.5, 0.62, 0.74, 1], ease: ["easeOut", ease.in, "linear", "easeOut", ease.in, "linear"] },
          ),
          animate(
            "[data-part=stick-r]",
            { rotate: [0, 0, 28, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.37, 0.49, 1], ease: ["linear", "easeOut", ease.in, "linear"] },
          ),
          animate(
            "[data-part=head]",
            { scaleY: [1, 1, 0.6, 1, 0.6, 1, 0.6, 1] },
            { duration: seconds, times: [0, 0.24, 0.28, 0.49, 0.53, 0.74, 0.78, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=shell]",
            { scaleY: [1, 1, 0.94, 1, 0.94, 1, 0.94, 1] },
            { duration: seconds, times: [0, 0.24, 0.28, 0.4, 0.53, 0.65, 0.78, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the camera rises over the drum: the head opens into a rounder ellipse, the shell foreshortens and its
    // bottom rim curves with it, the sticks ride up on the head, then it all swings back down past level
    tilt: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.35, 0.6, 0.8, 1], ease: ["easeInOut", "linear", "easeInOut", "easeOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=head]", { scaleY: [1, 1.67, 1.67, 0.7, 1] }, timing),
          animate("[data-part=sides]", { scaleY: [1, 5 / 7, 5 / 7, 1.08, 1] }, timing),
          animate("[data-part=bottom]", { scaleY: [1, 1.67, 1.67, 0.7, 1], y: [0, -2, -2, 0.56, 0] }, timing),
          animate("[data-part=sticks]", { y: [0, -2, -2, 0.9, 0] }, timing),
        ])
      },
    },
    // both sticks wind up and slam together: the drum squashes flat, springs up and lands
    boom: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stick-l]",
            { rotate: [0, -40, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.4, 1], ease: ["easeOut", ease.in, "linear"] },
          ),
          animate(
            "[data-part=stick-r]",
            { rotate: [0, 40, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.4, 1], ease: ["easeOut", ease.in, "linear"] },
          ),
          animate(
            "[data-part=drum]",
            { scaleY: [1, 1, 0.75, 1.12, 0.92, 1], scaleX: [1, 1, 1.12, 0.94, 1.04, 1], y: [0, 0, 0, -3, 0, 0] },
            { duration: seconds, times: [0, 0.4, 0.46, 0.66, 0.84, 1], ease: ["linear", "easeOut", "easeOut", "easeIn", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="drum" style={pivot("50% 100%")}>
      <g data-part="shell" style={pivot("50% 100%")}>
        {/* a cylinder: the head is a true ellipse, the shell two straight sides and the front half of the bottom rim */}
        <path data-part="sides" d="M4 11v7M20 11v7" style={pivot("50% 0%")} />
        <path data-part="bottom" d="M4 18a8 3 0 0 0 16 0" style={pivot("50% 0%")} />
        <ellipse cx="12" cy="11" data-part="head" rx="8" ry="3" style={pivot("50% 50%")} />
      </g>
      {/* two sticks crossing in from the top corners, tips resting on the head; each pivots at its grip */}
      <g data-part="sticks" stroke={slot.accent}>
        <path d="M3 2l6 6" data-part="stick-l" style={pivot("0% 0%")} />
        <path d="M21 2l-6 6" data-part="stick-r" style={pivot("100% 0%")} />
      </g>
    </g>
  ),
})
