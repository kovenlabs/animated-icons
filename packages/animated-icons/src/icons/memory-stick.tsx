"use client"

import type { Easing } from "motion/react"
import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "memory-stick": "insert" | "load" | "turn"
  }
}

/** Three memory chips across the board, left to right. */
const CHIPS = [4.5, 10.5, 16.5]

/** Contact pins under the board, either side of the key notch. The notch sits off-centre, as on a real
 * DIMM, so the board never reads as a face. */
const PINS = "M4 16v3M8 16v3M12 16v3M20 16v3"

/** 2 colors: board + pins (primary), chips (accent). */
export const MemoryStick = createAnimatedIcon({
  name: "memory-stick",
  category: "devices",
  keywords: ["ram", "memory", "dimm", "module", "hardware", "upgrade", "computer", "chip"],
  slots: { primary: "board + pins", accent: "chips" },
  defaultVariant: "insert",
  variants: {
    // lifted, then rammed down into the slot below the frame (the pins slip out through the bottom),
    // it seats with a squash, the chips light up left to right, and it pops back out
    insert: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) => {
        const times = [0, 0.15, 0.3, 0.38, 0.75, 1]
        const timing = { duration: seconds, times, ease: ["easeOut", ease.in, "easeOut", "linear", ease.overshoot] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=stick]", { y: [0, -2.5, 5, 5, 5, 0] }, timing),
          animate("[data-part=stick]", { scaleY: [1, 1.06, 1, 0.88, 1, 1], scaleX: [1, 0.97, 1, 1.05, 1, 1] }, timing),
          animate(
            "[data-part=chip]",
            { scale: [1, 0.4, 1.35, 1], opacity: [1, 0.2, 1, 1] },
            { duration: seconds * 0.3, delay: stagger(seconds * 0.08, { startDelay: seconds * 0.38 }), ease: "easeOut" },
          ),
        ])
      },
    },
    // data loading: each chip drops away into the board and pops back up toward you, one after
    // another, while the stick bucks under the load
    load: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=chip]",
            { scale: [1, 0.2, 1.45, 0.9, 1], opacity: [1, 0.15, 1, 1, 1] },
            { duration: seconds * 0.55, times: [0, 0.3, 0.6, 0.8, 1], delay: stagger(seconds * 0.15), ease: "easeInOut" },
          ),
          animate(
            "[data-part=stick]",
            { y: [0, -1.5, 0, -1.5, 0, -1.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // turned over in the hand: the stick spins round its upright axis, leaning into the turn, with
    // the chips sliding ahead of the board for depth
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const times = [0, 0.1, 0.3, 0.5, 0.7, 0.88, 1]
        return Promise.all([
          animate(
            "[data-part=stick]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1], skewY: [0, 0, 10, 0, -10, 0, 0] },
            { duration: seconds, times, ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"] },
          ),
          animate("[data-part=chips]", { x: [0, 0, 1.5, 0, -1.5, 0, 0] }, { duration: seconds, times, ease: "easeInOut" }),
          animate(
            "[data-part=stick]",
            { y: [0, -1, -2.5, -2.5, -1, 0.8, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="stick" style={pivot("50% 50%")}>
      {/* the board, with the key notch cut into its bottom edge */}
      <path d="M2 5h20v11h-5v-2h-2v2H2Z" />
      <path d={PINS} />
      <g data-part="chips" fill={slot.accent} stroke="none">
        {CHIPS.map((x) => (
          <rect key={x} data-part="chip" x={x} y="8" width="3" height="3" style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
