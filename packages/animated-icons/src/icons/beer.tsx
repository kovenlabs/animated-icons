"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    beer: "cheers" | "fizz" | "slosh"
  }
}

/** Bubbles rising inside the mug, left of, between and right of centre. */
const BUBBLES = [6.5, 9.5, 12.5] as const

/** 2 colors: mug (primary), foam and bubbles (accent). */
export const Beer = createAnimatedIcon({
  name: "beer",
  category: "food",
  keywords: ["mug", "pint", "drink", "alcohol", "bar", "pub", "cheers", "ale"],
  slots: { primary: "mug", accent: "foam + bubbles" },
  defaultVariant: "cheers",
  variants: {
    // lifted for a toast: the mug swings up and tips into a clink, the foam lagging behind the swing
    // and puffing up on impact, then it is set down with a thud
    cheers: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mug]",
            { y: [0, -1.5, -1.5, 0, 0], rotate: [0, 12, 7, -2, 0], scaleY: [1, 1, 1, 0.92, 1] },
            {
              duration: seconds,
              times: [0, 0.3, 0.45, 0.75, 1],
              ease: [ease.in, "easeOut", "easeIn", ease.overshoot],
            },
          ),
          animate(
            "[data-part=foam]",
            { skewX: [0, -14, 12, -6, 0], scaleY: [1, 1, 1.1, 0.95, 1], scaleX: [1, 1, 1.06, 0.98, 1] },
            { duration: seconds, times: [0, 0.25, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // freshly poured: bubbles stream up through the beer one after another and the head swells up over
    // the rim, overshoots, and settles
    fizz: {
      duration: 1200,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bubble]",
            { y: [0, -7], ...blink },
            { duration: seconds * 0.55, delay: stagger(seconds * 0.14), ease: "easeOut" },
          ),
          animate(
            "[data-part=foam]",
            { scaleY: [1, 1, 1.28, 0.92, 1.05, 1], scaleX: [1, 1, 1.08, 0.98, 1.01, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.72, 0.87, 1], ease: ["linear", ease.out, "easeInOut", "easeInOut", "easeInOut"] },
          ),
        ]),
    },
    // slid along the bar: the mug rocks to a stop and the foam sloshes over the rim against the motion
    slosh: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mug]",
            { rotate: [0, -6, 5, -3, 1, 0], x: [0, -1, 0.8, -0.4, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=foam]",
            { skewX: [0, 18, -16, 9, -3, 0], scaleY: [1, 0.9, 1.12, 0.95, 1.02, 1] },
            { duration: seconds, delay: seconds * 0.05, times: [0, 0.22, 0.45, 0.65, 0.82, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // the mug's box runs 3.5..20 × 2..21: it lifts and tips on its base at 50% 100%
    <g data-part="mug" style={pivot("50% 100%")}>
      {/* a stepped head of foam overhanging the rim, its base tucked under the rim's stroke */}
      <path
        data-part="foam"
        d="M3.5 7V4.5L5.5 3H8l1.5-1h3L14 3h.5l2 1.5V7Z"
        fill={slot.accent}
        stroke="none"
        style={pivot("50% 100%")}
      />
      <path d="M4 7h12v14H4Z" />
      <path d="M16 10h4v7h-4" />
      <g fill={slot.accent} stroke="none">
        {BUBBLES.map((x, i) => (
          <rect key={x} data-part="bubble" x={x} y={17 - i} width="2" height="2" style={flash()} />
        ))}
      </g>
    </g>
  ),
})
