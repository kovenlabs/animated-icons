"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "heart-pulse": "beat" | "trace" | "revive"
  }
}

/** The faceted heart of the heart family. */
const HEART = "M12 20.5 3 11.5v-4L6.5 4h2L12 7.5 15.5 4h2L21 7.5v4Z"

/** A heartbeat trace run across the heart between its two side corners: a dip, a deep spike, a peak. */
const TRACE = "M3 11.5h5l1.5-2.5 2.5 6 2-6 1.5 2.5H21"

/** 2 colors: heart (primary), trace (accent). */
export const HeartPulse = createAnimatedIcon({
  name: "heart-pulse",
  family: "heart",
  category: "health",
  keywords: ["heartbeat", "pulse", "cardio", "ecg", "health", "vitals", "heart rate", "medical"],
  slots: { primary: "heart", accent: "trace" },
  defaultVariant: "beat",
  variants: {
    // lub-dub: the heart thumps out toward you twice and the trace spikes taller with each beat
    beat: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.15, 0.3, 0.45, 1], ease: "easeOut" as const }
        return Promise.all([
          animate("[data-part=heart]", { scale: [1, 1.18, 0.96, 1.1, 1] }, timing),
          animate("[data-part=trace]", { scaleY: [1, 1.25, 0.85, 1.15, 1] }, timing),
        ])
      },
    },
    // the monitor sweeps: the trace wipes and redraws left to right, the heart kicking as the spike passes
    trace: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=trace]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.35, times: [0, 0.3, 0.5, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=trace]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.1, 0.15, 1], ease: ["linear", "linear", "easeInOut"] },
          ),
          animate(
            "[data-part=heart]",
            { scale: [1, 1, 1.14, 0.98, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 0.7, 1], ease: "easeOut" },
          ),
        ]),
    },
    // flatline, then a jolt: the heart shrinks still, leaps out at you and the spikes fire back tall
    revive: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const timing = {
          duration: seconds,
          times: [0, 0.2, 0.45, 0.58, 0.75, 1],
          ease: ["easeOut", "linear", ease.in, "easeOut", "easeInOut"] as Easing[],
        }
        return Promise.all([
          animate("[data-part=trace]", { scaleY: [1, 0.1, 0.1, 1.3, 0.9, 1] }, timing),
          animate("[data-part=heart]", { scale: [1, 0.9, 0.9, 1.14, 0.97, 1], y: [0, 0.5, 0.5, -1, 0, 0] }, timing),
          // the squashed trace thins to a hairline, so a full-weight flat line stands in for it while it is down
          animate(
            "[data-part=flatline]",
            { opacity: [0, 0, 1, 1, 0, 0] },
            { duration: seconds, times: [0, 0.08, 0.18, 0.45, 0.52, 1], ease: "linear" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="heart" style={pivot("50% 50%")}>
      <path d={HEART} />
      {/* scales about its baseline (y 11.5 of its 9..15 box) */}
      <path data-part="trace" d={TRACE} stroke={slot.accent} style={pivot("50% 42%")} />
      <path data-part="flatline" d="M3 11.5H21" stroke={slot.accent} style={flash()} />
    </g>
  ),
})
