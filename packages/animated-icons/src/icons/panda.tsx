"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    panda: "turn" | "roll" | "chew"
  }
}

/** A wide, faceted head, flat across the brow and tapering to the chin. */
const HEAD = "M3 12l2-4 4-2h6l4 2 2 4v4l-3 4-4 1h-4l-4-1-3-4z"

/**
 * Solid, round-topped ears. Each is open at its base, which lies on the head's upper edge, and hinges on
 * its outer corner, so it only ever tips outwards, away from the head.
 */
const EAR_LEFT = "M5 8 3 5l2-2h3l1 3"
const EAR_RIGHT = "M19 8l2-3-2-2h-3l-1 3"

/** 2 colors: head, ears and nose (primary), eye patches (accent). */
export const Panda = createAnimatedIcon({
  name: "panda",
  category: "animals",
  keywords: ["bear", "animal", "bamboo", "china", "cute", "wildlife", "zoo", "giant panda"],
  slots: { primary: "head + ears + nose", accent: "eye patches" },
  defaultVariant: "turn",
  variants: {
    // the head turns to look left, then right: the face slides further than the skull, the ears drift
    // the other way with the far one going edge-on, then it faces you again and blinks
    turn: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const look = { duration: seconds, times: [0, 0.18, 0.4, 0.58, 0.78, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=face]", { x: [0, -2, -2, 2, 2, 0] }, look),
          animate("[data-part=head]", { scaleX: [1, 0.93, 0.93, 0.93, 0.93, 1] }, look),
          animate("[data-part=ears]", { x: [0, 0.6, 0.6, -0.6, -0.6, 0] }, look),
          animate("[data-part=ear-left]", { scaleX: [1, 0.6, 0.6, 1, 1, 1] }, look),
          animate("[data-part=ear-right]", { scaleX: [1, 1, 1, 0.6, 0.6, 1] }, look),
          animate(
            "[data-part=patch]",
            { scaleY: [1, 1, 0.3, 1] },
            { duration: seconds, times: [0, 0.84, 0.9, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
    // it tumbles: crouches, then rolls a full turn, shrinking away from you at the top of the roll (which
    // keeps every corner in the frame), and lands on a squash, the ears flopping out from the landing
    roll: {
      duration: 1300,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=panda]",
            {
              rotate: [0, 0, 180, 360, 360, 360],
              y: [0, 1, -1, 0, 0, 0],
              scaleX: [1, 1.1, 0.7, 0.92, 1.1, 1],
              scaleY: [1, 0.86, 0.7, 0.92, 0.88, 1],
            },
            {
              duration: seconds,
              times: [0, 0.16, 0.38, 0.6, 0.76, 1],
              ease: ["easeInOut", "easeIn", "easeOut", "easeOut", ease.overshoot],
            },
          ),
          animate(
            "[data-part=ear-left]",
            { rotate: [0, 0, -22, 6, 0] },
            { duration: seconds, times: [0, 0.68, 0.8, 0.9, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ear-right]",
            { rotate: [0, 0, 22, -6, 0] },
            { duration: seconds, times: [0, 0.68, 0.8, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // it munches on bamboo: the cheeks puff wide and the jaw drops in turns, the nose bobbing and the ears
    // wiggling with every bite
    chew: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const bites = { duration: seconds, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate(
            "[data-part=head]",
            { scaleX: [1, 1.1, 0.96, 1.1, 0.96, 1.06, 1], scaleY: [1, 0.94, 1.04, 0.94, 1.04, 0.97, 1] },
            bites,
          ),
          animate("[data-part=nose]", { y: [0, 1, -0.5, 1, -0.5, 0.5, 0] }, bites),
          animate("[data-part=ear-left]", { rotate: [0, -12, 0, -12, 0, -6, 0] }, bites),
          animate("[data-part=ear-right]", { rotate: [0, 12, 0, 12, 0, 6, 0] }, bites),
          animate("[data-part=patch]", { y: [0, -0.5, 0, -0.5, 0, 0, 0] }, bites),
        ])
      },
    },
  },
  render: () => (
    <g data-part="panda" style={pivot("50% 50%")}>
      <path data-part="head" d={HEAD} style={pivot("50% 100%")} />
      <g data-part="ears" fill={slot.primary}>
        <path data-part="ear-left" d={EAR_LEFT} style={pivot("33.3% 100%")} />
        <path data-part="ear-right" d={EAR_RIGHT} style={pivot("66.7% 100%")} />
      </g>
      <g data-part="face" stroke="none">
        {/* slanted patches, 2px apart across the bridge of the nose */}
        <g fill={slot.accent}>
          <path data-part="patch" d="M7 10l3-1 1 3-2 3-2-1z" style={pivot("50% 50%")} />
          <path data-part="patch" d="M17 10l-3-1-1 3 2 3 2-1z" style={pivot("50% 50%")} />
        </g>
        <path data-part="nose" d="M10.5 16.5h3L12 18z" fill={slot.primary} />
      </g>
    </g>
  ),
})
