"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "candy-cane": "spin" | "paint" | "jelly"
  }
}

/** The stripes, listed in the order they wind up the cane: two across the shaft, two across the hook. */
const STRIPES = ["M15 17.5l4-2", "M15 13l4-2", "M14.12 7.88 16.95 5.05", "M9.88 7.88 7.05 5.05"]

/** 2 colors: cane (primary), stripes (accent). */
export const CandyCane = createAnimatedIcon({
  name: "candy-cane",
  family: "candy",
  category: "commerce",
  keywords: ["christmas", "xmas", "holiday", "peppermint", "sweet", "treat", "festive", "winter"],
  slots: { primary: "cane", accent: "stripes" },
  defaultVariant: "spin",
  variants: {
    // it crouches, spins a full turn on its own axis like a stick twirled in the fingers, and settles with a squash
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=spin]",
            { scaleX: [1, 1, -1, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.75, 1], ease: ["linear", ease.in, ease.out, "linear"] },
          ),
          animate(
            "[data-part=cane]",
            { scaleY: [1, 0.88, 1.04, 1, 0.9, 1], scaleX: [1, 1.08, 0.97, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.7, 0.84, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the stripes wipe off, then paint back on one by one as they wind up to the hook, while the cane rocks
    paint: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...STRIPES.map((_, i) => {
            const start = 0.22 + i * 0.15
            return animate(
              `[data-part=stripe-${i}]`,
              { opacity: [1, 0, 0, 1, 1], pathLength: [1, 1, 0, 1, 1] },
              { duration: seconds, times: [0, 0.12, start, start + 0.18, 1], ease: "easeOut" },
            )
          }),
          animate(
            "[data-part=cane]",
            { rotate: [0, -7, 6, -3, 1, 0] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.7, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // tapped, the cane wobbles like jelly from its foot: its top lurches side to side as it squashes and stretches
    jelly: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cane]",
          {
            skewX: [0, -9, 7, -4, 2, 0],
            scaleY: [1, 0.88, 1.04, 0.95, 1.01, 1],
            scaleX: [1, 1.08, 0.97, 1.03, 1, 1],
          },
          { duration: seconds, times: [0, 0.18, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="spin" style={pivot("50% 50%")}>
      <g data-part="cane" style={pivot("86% 100%")}>
        {/* a 4px band: the straight runs and the true arcs of the hook are separate strokes, so the
            factory still rounds the corners at its two ends */}
        <path d="M5 10v3h4v-3M15 10v11h4V10" />
        <path d="M5 10a7 7 0 0 1 14 0M9 10a3 3 0 0 1 6 0" />
        <g stroke={slot.accent}>
          {STRIPES.map((d, i) => (
            <path key={d} data-part={`stripe-${i}`} d={d} />
          ))}
        </g>
      </g>
    </g>
  ),
})
