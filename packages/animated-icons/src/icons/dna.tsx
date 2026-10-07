"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    dna: "twist" | "spin" | "scan"
  }
}

/**
 * The helix in three pieces, cut where the strands cross on the axis (x 12, at y 7 and y 17). Each piece
 * turns about that axis, so the cut points never move and the strands stay joined while the pieces turn
 * out of step. Strand A sways like a sampled wave, x = 12 + 5·cos, and strand B is its mirror.
 */
const PIECES = [
  { a: "M17 2l-1 2-4 3", b: "M7 2l1 2 4 3", rungs: [4] },
  { a: "M12 7 8 10l-1 2 1 2 4 3", b: "M12 7l4 3 1 2-1 2-4 3", rungs: [10, 14] },
  { a: "M12 17l4 3 1 2", b: "M12 17l-4 3-1 2", rungs: [20] },
]

/** 2 colors: one strand + base pairs (primary), the other strand (accent). */
export const Dna = createAnimatedIcon({
  name: "dna",
  category: "education",
  keywords: ["genetics", "helix", "gene", "biology", "genome", "science", "chromosome", "biotech"],
  slots: { primary: "strand + base pairs", accent: "second strand" },
  defaultVariant: "twist",
  variants: {
    // the helix twists a full turn about its axis, top piece first, the turn running down the
    // ladder; edge-on each piece thins to a line and the strands come round on the other side
    twist: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=piece]",
          { scaleX: [1, 0, -1, 0, 1] },
          {
            duration: seconds * 0.7,
            delay: stagger(seconds * 0.15),
            ease: ["easeIn", "easeOut", "easeIn", "easeOut"],
          },
        ),
    },
    // spun a whole turn on its centre, swelling at the half way and settling with a bounce
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=dna]",
          { rotate: [0, 380, 360], scale: [1, 1.15, 1] },
          { duration: seconds, times: [0, 0.75, 1], ease: ["easeInOut", "easeOut"] },
        ),
    },
    // the base pairs are read top to bottom, each one blinking out and back as the helix stretches
    scan: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=rung]",
            { opacity: [1, 0, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.18), ease: "easeInOut" },
          ),
          animate(
            "[data-part=dna]",
            { scaleY: [1, 1.06, 0.95, 1], scaleX: [1, 0.94, 1.04, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ease.inOut },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="dna" style={pivot("50% 50%")}>
      {PIECES.map(({ a, b, rungs }, i) => (
        <g key={i} data-part="piece" style={pivot("50% 50%")}>
          {/* the base pairs run strand to strand, 4 apart at the waist */}
          {rungs.map((y) => (
            <path key={y} data-part="rung" d={`M8 ${y}h8`} />
          ))}
          <path d={b} stroke={slot.accent} />
          <path d={a} />
        </g>
      ))}
    </g>
  ),
})
