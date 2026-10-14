"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "plane-landing": "land" | "touchdown" | "approach"
  }
}

/** Runway markings; the off-frame dash slides in from the right while the others stream left. */
const DASHES = [3, 10, 17] as const

/** 2 colors: airliner (primary), runway markings (accent). */
export const PlaneLanding = createAnimatedIcon({
  name: "plane-landing",
  family: "plane",
  category: "transport",
  keywords: ["arrival", "landing", "flight", "airport", "travel", "airplane", "arrive", "descent"],
  slots: { primary: "airliner", accent: "runway" },
  defaultVariant: "land",
  variants: {
    // swoops in from the far top left, growing as it nears, and flares its nose up as it settles onto
    // the glide path while the runway rushes in beneath
    land: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plane]",
            {
              x: [-12, -3, 0, 0],
              y: [-9, -2, 0, 0],
              scale: [0.5, 0.9, 1.04, 1],
              rotate: [10, 4, -8, 0],
              opacity: [0, 1, 1, 1],
            },
            { duration: seconds, times: [0, 0.45, 0.75, 1], ease: ["easeIn", ease.out, "easeInOut"] },
          ),
          animate("[data-part=dash]", { x: [0, -7, 0] }, stream(seconds)),
          animate("[data-part=incoming]", { x: [0, -7, 0], opacity: [0, 1, 0] }, stream(seconds)),
        ]),
    },
    // levels out onto the runway, squashes on its gear, rolls off to the right, and the next one
    // fades in up on the glide path
    touchdown: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=plane]",
          {
            x: [0, 1, 1.5, 14, 0, 0],
            y: [0, 3, 3, 3, 0, 0],
            rotate: [0, -24, -24, -24, 0, 0],
            scaleX: [1, 1, 1.08, 1, 0.4, 1],
            scaleY: [1, 1, 0.84, 1, 0.4, 1],
            opacity: [1, 1, 1, 0, 0, 1],
          },
          {
            duration: seconds,
            times: [0, 0.3, 0.4, 0.62, 0.65, 1],
            ease: [ease.inOut, ease.overshoot, ease.in, snap, ease.overshoot],
          },
        ),
    },
    // riding the glide path through light chop: the airliner pitches and bobs while the runway streams in
    approach: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plane]",
            { x: [0, 0.5, -0.5, 0.5, 0], y: [0, 1.5, -1, 1, 0], rotate: [0, 4, -4, 3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=dash]", { x: [0, -7, 0, -7, 0] }, stream(seconds, 2)),
          animate("[data-part=incoming]", { x: [0, -7, 0, -7, 0], opacity: [0, 1, 0, 1, 0] }, stream(seconds, 2)),
        ]),
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
      {/* descending at 1:2: a long body with a wedge nose, the far wing swept back above it, a tail fin */}
      <path
        data-part="plane"
        d="M3.2 10.9 17.2 17.9 20.8 17.7 18.8 14.2 15.8 12.7 14.5 4.6 12.3 2.5 11.3 10.5 7.8 8.7 7.9 5.5 6.5 5.3Z"
        style={pivot("50% 100%")}
      />
    </>
  ),
})

/**
 * The runway streaming left one dash-length at a time, `laps` times over the cycle; each lap ends on a
 * snap back to the identical-looking start.
 */
function stream(seconds: number, laps = 1) {
  const times = Array.from({ length: laps }, (_, i) => [(i + 0.999) / laps, (i + 1) / laps]).flat()
  return {
    duration: seconds,
    times: [0, ...times],
    ease: Array.from({ length: laps }, () => ["linear", snap] as const).flat(),
  }
}
