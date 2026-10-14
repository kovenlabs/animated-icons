"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "plane-takeoff": "takeoff" | "climb" | "lift"
  }
}

/** Runway markings; the off-frame dash slides in from the right while the others stream left. */
const DASHES = [3, 10, 17] as const

/** 2 colors: airliner (primary), runway markings (accent). */
export const PlaneTakeoff = createAnimatedIcon({
  name: "plane-takeoff",
  family: "plane",
  category: "transport",
  keywords: ["departure", "takeoff", "flight", "airport", "travel", "airplane", "depart", "trip"],
  slots: { primary: "airliner", accent: "runway" },
  defaultVariant: "takeoff",
  variants: {
    // pitches up hard and roars off the top right, shrinking into the sky; the next one fades in on
    // the climb from the distance and swells into place
    takeoff: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) => {
        const times = [0, 0.15, 0.45, 0.5, 1]
        // the runway streams one dash left as it accelerates, then snaps back unseen
        const roll = { duration: seconds * 0.45, delay: seconds * 0.1, times: [0, 0.999, 1], ease: [ease.in, snap] satisfies Easing[] }
        return Promise.all([
          animate(
            "[data-part=plane]",
            {
              x: [0, -1, 12, 0, 0],
              y: [0, 1, -10, 0, 0],
              rotate: [0, 6, -12, 0, 0],
              scale: [1, 1, 0.6, 0.4, 1],
              opacity: [1, 1, 0, 0, 1],
            },
            { duration: seconds, times, ease: ["easeOut", ease.in, snap, ease.overshoot] },
          ),
          animate("[data-part=dash]", { x: [0, -7, 0] }, roll),
          animate("[data-part=incoming]", { x: [0, -7, 0], opacity: [0, 1, 0] }, roll),
        ])
      },
    },
    // a steady climb: the runway streams away beneath while the airliner rides the air, nose bobbing
    climb: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) => {
        // two dash-lengths of runway, each ending on a snap back to the identical-looking start
        const stream = {
          duration: seconds,
          times: [0, 0.499, 0.5, 0.999, 1],
          ease: ["linear", snap, "linear", snap] satisfies Easing[],
        }
        return Promise.all([
          animate(
            "[data-part=plane]",
            { y: [0, -2, 0.5, -1, 0], rotate: [0, -5, 2, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=dash]", { x: [0, -7, 0, -7, 0] }, stream),
          animate("[data-part=incoming]", { x: [0, -7, 0, -7, 0], opacity: [0, 1, 0, 1, 0] }, stream),
        ])
      },
    },
    // rotation: it squats back on its tail, then leaps up the climb stretched long and settles
    lift: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=plane]",
          {
            x: [0, -1, 1.5, 0],
            y: [0, 1.5, -2.5, 0],
            rotate: [0, 8, -6, 0],
            scaleX: [1, 0.88, 1.12, 1],
            scaleY: [1, 1.08, 0.9, 1],
          },
          { duration: seconds, times: [0, 0.3, 0.6, 1], ease: ["easeOut", ease.in, ease.overshoot] },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {DASHES.map((x) => (
          <path key={x} data-part="dash" d={`M${x} 22h4`} />
        ))}
        <path data-part="incoming" d="M24 22h4" style={flash()} />
      </g>
      <g data-part="plane" style={pivot("50% 50%")}>
        {/* climbing out at 1:2: a long body with a wedge nose, the far wing swept back above it, a tail fin */}
        <path d="M5 18l14-7 2-3-4-.5-3 1.5-5-6-3 .5 2.5 8.25L6 13l-2.5-2-1 1Z" />
      </g>
    </>
  ),
})
