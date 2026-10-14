"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    regex: "spin" | "match" | "burst"
  }
}

/**
 * The asterisk: six arms from its centre (16, 8.5), each 5 long and 60° apart, each pivoting on the
 * centre end of its own box so it can shrink into the hub and shoot back out.
 */
const ARMS = [
  { d: "M16 8.5V3.5", origin: "50% 100%" },
  { d: "M16 8.5l4.33 2.5", origin: "0% 0%" },
  { d: "M16 8.5l-4.33 2.5", origin: "100% 0%" },
  { d: "M16 8.5v5", origin: "50% 0%" },
  { d: "M16 8.5l-4.33-2.5", origin: "100% 100%" },
  { d: "M16 8.5l4.33-2.5", origin: "0% 100%" },
] as const

/** 2 colors: dot (primary), asterisk (accent). */
export const Regex = createAnimatedIcon({
  name: "regex",
  category: "development",
  keywords: ["regular expression", "pattern", "match", "search", "wildcard", "asterisk", "find replace"],
  slots: { primary: "dot", accent: "asterisk" },
  defaultVariant: "spin",
  variants: {
    // the asterisk winds back and whips round a full turn, swelling as it goes, and the dot below
    // squashes under the kick and springs back
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=star]",
            { rotate: [0, -35, 380, 360], scale: [1, 0.85, 1.15, 1] },
            { duration: seconds, times: [0, 0.2, 0.75, 1], ease: ["easeOut", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=dot]",
            { scaleY: [1, 1, 0.6, 1.15, 1], scaleX: [1, 1, 1.3, 0.9, 1] },
            { duration: seconds, times: [0, 0.2, 0.35, 0.6, 0.8], ease: "easeInOut" },
          ),
        ]),
    },
    // the dot crouches, leaps up under the asterisk with a stretch and lands squashed; the asterisk
    // ticks a sixth of a turn and flares on the catch
    match: {
      clip: false,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dot]",
            {
              y: [0, 0, -6, 0, 0],
              scaleY: [1, 0.65, 1.2, 0.7, 1],
              scaleX: [1, 1.25, 0.85, 1.25, 1],
            },
            { duration: seconds * 0.8, times: [0, 0.2, 0.5, 0.8, 1], ease: ["easeOut", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=star]",
            { rotate: [0, 0, 60, 60, 0], scale: [1, 1, 1.15, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.55, 0.999, 1], ease: ["linear", ease.overshoot, "easeOut", snap] },
          ),
        ]),
    },
    // the arms snap into the hub one after another and fire back out past their length, like a spark;
    // the dot blinks like a cursor meanwhile
    burst: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arm]",
            { scale: [1, 0, 1.2, 1] },
            {
              duration: seconds * 0.6,
              times: [0, 0.35, 0.75, 1],
              delay: stagger(seconds * 0.06),
              ease: [ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=dot]",
            { opacity: [1, 0, 1, 0, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.7, 0.95], ease: snap },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <rect data-part="dot" x="3" y="16" width="5" height="5" fill={slot.primary} stroke="none" style={pivot("50% 100%")} />
      <g data-part="star" stroke={slot.accent} style={pivot("50% 50%")}>
        {ARMS.map(({ d, origin }) => (
          <path key={d} data-part="arm" d={d} style={pivot(origin)} />
        ))}
      </g>
    </>
  ),
})
