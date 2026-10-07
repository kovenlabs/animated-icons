"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bomb: "fizz" | "boom" | "bounce"
  }
}

/**
 * The bomb's box is 3..20.75 × 3.25..21 (body to spark tip); the body's centre (10, 14) sits at
 * 39.4% 60.6% of it, the middle of its floor at 39.4% 100%.
 */
const CENTRE = pivot("39.4% 60.6%")
const FLOOR = pivot("39.4% 100%")

/** A four-point spark on the fuse's end at (19, 5), its points on the diagonals. */
const SPARK = "M20.75 3.25 19.75 5l1 1.75-1.75-1-1.75 1 1-1.75-1-1.75 1.75 1z"

/** 2 colors: body (primary), fuse and spark (accent). */
export const Bomb = createAnimatedIcon({
  name: "bomb",
  category: "status",
  keywords: ["explosive", "explosion", "danger", "boom", "fuse", "dynamite", "destroy", "blast"],
  slots: { primary: "body + cap", accent: "fuse + spark" },
  defaultVariant: "fizz",
  variants: {
    // the lit fuse sputters and spins while the bomb trembles harder and harder, then swells toward you
    // as if about to blow, and shrinks back
    fizz: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=spark]",
            { rotate: [0, 360], scale: [1, 1.5, 0.8, 1.6, 0.9, 1.6, 1] },
            { duration: seconds, ease: "linear" },
          ),
          animate(
            "[data-part=bomb]",
            { rotate: [0, -1.5, 1.5, -3, 3, -5, 5, -3, 0] },
            { duration: seconds * 0.7, ease: "linear" },
          ),
          animate(
            "[data-part=bomb]",
            { scale: [1, 1, 1.18, 1] },
            { duration: seconds, times: [0, 0.62, 0.8, 1], ease: ease.overshoot },
          ),
        ]),
    },
    // it shrinks in a breath, flares its spark, balloons toward you and wobbles back down to size
    boom: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=spark]",
            { scale: [1, 1.7, 1.7, 1], rotate: [0, 90, 180, 360] },
            { duration: seconds * 0.6, times: [0, 0.3, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bomb]",
            { scale: [1, 0.88, 1.22, 1.22, 0.92, 1.05, 1], y: [0, 0.5, -1, -1, 0, 0, 0] },
            { duration: seconds, times: [0, 0.18, 0.38, 0.5, 0.68, 0.84, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // two hops that land in a squash; the spark spins behind each landing
    bounce: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hop]",
            {
              y: [0, -4, 0, -2, 0, 0],
              scaleX: [1, 0.94, 1.12, 0.97, 1.05, 1],
              scaleY: [1, 1.08, 0.86, 1.04, 0.94, 1],
            },
            {
              duration: seconds,
              times: [0, 0.28, 0.5, 0.68, 0.84, 1],
              ease: ["easeOut", "easeIn", "easeOut", "easeIn", "easeOut"],
            },
          ),
          animate(
            "[data-part=spark]",
            { rotate: [0, 0, 120, 120, 360] },
            { duration: seconds, times: [0, 0.45, 0.62, 0.8, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="hop" style={FLOOR}>
      <g data-part="bomb" style={CENTRE}>
        {/* a bomb is round: a true circle, with a glint on its upper left for volume */}
        <circle cx="10" cy="14" r="7" />
        <path d="M7 14a3 3 0 0 1 3-3" />
        {/* the cap and fuse, drawn upright and turned onto the diagonal */}
        <g transform="rotate(45 10 14)">
          <path d="M8 7.3V4.5h4v2.8" />
          <path d="M10 4.5V2.5" stroke={slot.accent} />
        </g>
        <g data-part="spark" style={pivot("50% 50%")}>
          <path d={SPARK} fill={slot.accent} stroke="none" />
        </g>
      </g>
    </g>
  ),
})
