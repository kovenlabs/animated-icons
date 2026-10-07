"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "traffic-cone": "wobble" | "hop" | "glint"
  }
}

/** 2 colors: cone and base (primary), reflective bands and glints (accent). */
export const TrafficCone = createAnimatedIcon({
  name: "traffic-cone",
  category: "transport",
  keywords: ["construction", "roadwork", "under construction", "caution", "pylon", "maintenance", "detour", "work in progress"],
  slots: { primary: "cone + base", accent: "bands + glints" },
  defaultVariant: "wobble",
  variants: {
    // knocked, it rolls round on its rim: tipping left, toward you, right and away, smaller each time,
    // until it stands still
    wobble: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cone]",
          {
            rotate: [0, -14, 0, 10, 0, -6, 0, 3, 0],
            scaleY: [1, 1, 0.84, 1, 0.9, 1, 0.95, 1, 1],
            y: [0, 0, 1, 0, 0.5, 0, 0.3, 0, 0],
          },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // springs off its base, stretching tall, and lands with a squash and a jiggle
    hop: {
      clip: false,
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cone]",
          {
            y: [0, 1, -6, 0, 0, 0],
            scaleY: [1, 0.8, 1.15, 0.78, 1.06, 1],
            scaleX: [1, 1.15, 0.9, 1.18, 0.97, 1],
          },
          { duration: seconds, times: [0, 0.15, 0.45, 0.7, 0.85, 1], ease: ["easeOut", ease.out, ease.in, "easeOut", "easeInOut"] },
        ),
    },
    // headlights sweep it: the reflective bands flare one after the other and glint at their ends
    glint: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["upper", "lower"].map((band, i) =>
            Promise.all([
              animate(
                `[data-part=${band}]`,
                { scale: [1, 1.3, 1] },
                { duration: seconds * 0.55, delay: seconds * 0.3 * i, ease: ease.out },
              ),
              animate(
                `[data-part=${band}-glint]`,
                { opacity: [0, 1, 0], scale: [0.5, 1.2, 1] },
                { duration: seconds * 0.55, delay: seconds * 0.3 * i + seconds * 0.08, ease: "easeOut" },
              ),
            ]),
          ),
        ),
    },
  },
  render: () => (
    <>
      <path d="M2 21h20" />
      <g stroke={slot.accent}>
        <path data-part="upper-glint" d="M6 8.5h-2M18 8.5h2" style={flash()} />
        <path data-part="lower-glint" d="M4.5 14h-2M19.5 14h2" style={flash()} />
      </g>
      <g data-part="cone" style={pivot("50% 100%")}>
        {/* a cone with a flat top, standing on the base; it is round, so its bands are half ellipses */}
        <path d="M6 21 10.5 3h3L18 21" />
        <g stroke={slot.accent}>
          <path data-part="upper" d="M9 9A3 1.5 0 0 0 15 9" style={pivot("50% 50%")} />
          <path data-part="lower" d="M7.6 14.5A4.4 1.75 0 0 0 16.4 14.5" style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
