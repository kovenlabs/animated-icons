"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bone: "toss" | "snap" | "wobble"
  }
}

/**
 * A bone drawn level in two halves that meet mid-shaft: a 4px shaft ending in faceted twin knobs.
 * Each half hinges on the bottom of the break.
 */
const HALVES = [
  { side: "left", d: "M12 10H8L7 7.5H5L3 9.5 4 12l-1 2.5 2 2h2l1-2.5h4", origin: "100% 72%" },
  { side: "right", d: "M12 10h4l1-2.5h2l2 2-1 2.5 1 2.5-2 2h-2l-1-2.5h-4", origin: "0% 72%" },
] as const

/** 2 colors: bone (primary), crack sparks (accent). The sparks only exist in motion. */
export const Bone = createAnimatedIcon({
  name: "bone",
  category: "health",
  keywords: ["skeleton", "fracture", "x-ray", "orthopedic", "dog", "treat", "anatomy", "calcium"],
  slots: { primary: "bone", accent: "crack sparks" },
  defaultVariant: "toss",
  variants: {
    // tossed up and away from you, it turns end over end and lands with a squash
    toss: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bone]",
            { y: [0, -3, 0, 0], rotate: [0, 180, 360, 360], scale: [1, 0.78, 1, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=land]",
            { scaleY: [1, 1, 0.84, 1.05, 1], scaleX: [1, 1, 1.1, 0.97, 1] },
            { duration: seconds, times: [0, 0.75, 0.82, 0.92, 1], ease: "easeOut" },
          ),
        ]),
    },
    // bent until it cracks open at the top, sparks flying off the break, then it springs back straight
    snap: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: [ease.in, "linear", "easeOut", "easeInOut"] as Easing[] }
        return Promise.all([
          animate("[data-part=half-left]", { rotate: [0, -16, -16, 3, 0] }, timing),
          animate("[data-part=half-right]", { rotate: [0, 16, 16, -3, 0] }, timing),
          animate("[data-part=spark]", blink, { duration: seconds * 0.35, delay: seconds * 0.25, ease: "easeOut" }),
        ])
      },
    },
    // a rubbery chew toy: it stretches along its length, squashes short and fat, and wiggles to rest
    wobble: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flex]",
            { scaleX: [1, 1.12, 0.88, 1.05, 1], scaleY: [1, 0.78, 1.2, 0.95, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.78, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bone]",
            { rotate: [0, -8, 6, -3, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.78, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="land" style={pivot("50% 100%")}>
      <g data-part="bone" style={pivot("50% 50%")}>
        {/* drawn level and tipped 45° */}
        <g transform="rotate(-45 12 12)">
          <g data-part="flex" style={pivot("50% 50%")}>
            {HALVES.map(({ side, d, origin }) => (
              <path key={side} data-part={`half-${side}`} d={d} style={pivot(origin)} />
            ))}
          </g>
          {/* sparks either side of the break, across the shaft */}
          <g stroke={slot.accent}>
            <path data-part="spark" d="M12 4v2" style={flash("50% 100%")} />
            <path data-part="spark" d="M12 18v2" style={flash("50% 0%")} />
          </g>
        </g>
      </g>
    </g>
  ),
})
