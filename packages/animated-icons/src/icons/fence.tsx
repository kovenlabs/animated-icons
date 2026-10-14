"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    fence: "wave" | "build" | "flip"
  }
}

/** Three pointed pickets, 4 wide with 3 between them, standing on the baseline. */
const PICKETS = [3, 10, 17] as const

/** Each rail runs from one picket's edge to the next, so a picket slides up and down along it freely. */
const RAILS = [
  { x: 7, y: 10 },
  { x: 14, y: 10 },
  { x: 7, y: 17 },
  { x: 14, y: 17 },
] as const

const TURN = spin(1, "inOut")

/** 2 colors: pickets (primary), rails (accent). */
export const Fence = createAnimatedIcon({
  name: "fence",
  category: "nature",
  keywords: ["picket fence", "garden", "yard", "boundary", "barrier", "farm", "property", "enclosure"],
  slots: { primary: "pickets", accent: "rails" },
  defaultVariant: "wave",
  variants: {
    // a ripple runs along the fence: each picket crouches, springs up along its rails stretched tall,
    // lands on a squash and settles, one after another like piano keys played in a run
    wave: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=picket]",
          { y: [0, 0, -2.5, 0, 0, 0], scaleY: [1, 0.85, 1.03, 0.86, 1.03, 1] },
          {
            duration: seconds * 0.7,
            times: [0, 0.18, 0.45, 0.68, 0.84, 1],
            delay: stagger(seconds * 0.15),
            ease: ["easeOut", ease.out, ease.in, "easeOut", "easeInOut"],
          },
        ),
    },
    // the pickets are yanked up out of the ground one by one and hammered back in, each landing on a
    // squash, then the rails are nailed back across them, drawn on left to right
    build: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=picket]",
            { y: [0, -24, -24, 0, 0, 0], scaleY: [1, 1.2, 1.25, 0.8, 1.06, 1] },
            {
              duration: seconds * 0.55,
              times: [0, 0.25, 0.4, 0.75, 0.88, 1],
              delay: stagger(seconds * 0.11),
              ease: [ease.in, "linear", ease.in, "easeOut", "easeInOut"],
            },
          ),
          ...RAILS.map((_, i) => {
            const start = 0.66 + i * 0.06
            return animate(
              `[data-part=rail]:nth-of-type(${i + 1})`,
              { pathLength: [1, 1, 0, 0.2, 1, 1], opacity: [1, 0, 0, 1, 1, 1] },
              { duration: seconds, times: [0, 0.1, start, start + 0.03, start + 0.14, 1], ease: "easeOut" },
            )
          }),
        ]),
    },
    // the boards turn over one after another like a card trick, each one lifting off the ground as it
    // goes edge-on, so a wave of turning boards runs down the fence
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=board]",
            { scaleX: TURN.scaleX },
            { duration: seconds * 0.6, times: TURN.times, ease: TURN.ease, delay: stagger(seconds * 0.2) },
          ),
          animate(
            "[data-part=picket]",
            { y: [0, -2, 0, -2, 0] },
            {
              duration: seconds * 0.6,
              times: TURN.times,
              ease: "easeInOut",
              delay: stagger(seconds * 0.2),
            },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {PICKETS.map((x) => (
        <g key={x} data-part="picket" style={pivot("50% 100%")}>
          <path data-part="board" d={`M${x} 21V7l2-2 2 2v14Z`} style={pivot("50% 50%")} />
        </g>
      ))}
      <g stroke={slot.accent}>
        {RAILS.map(({ x, y }) => (
          <path key={`${x}-${y}`} data-part="rail" d={`M${x} ${y}h3`} style={pivot("50% 50%")} />
        ))}
      </g>
    </>
  ),
})
