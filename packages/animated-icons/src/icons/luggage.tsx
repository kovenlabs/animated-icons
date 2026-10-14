"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    luggage: "roll" | "turn" | "bump"
  }
}

/** Two square wheels under the case's bottom corners, hung half a pixel low so they spin clear of it. */
const WHEELS = [6, 16] as const

/** 2 colors: case and wheels (primary), handle and straps (accent). */
export const Luggage = createAnimatedIcon({
  name: "luggage",
  category: "transport",
  keywords: ["suitcase", "baggage", "travel", "trip", "trolley", "carry-on", "airport", "vacation"],
  slots: { primary: "case + wheels", accent: "handle + straps" },
  defaultVariant: "roll",
  variants: {
    // tipped back onto its wheels, it is dragged off to the right with the wheels spinning, rolls in
    // from the left and rocks upright on the brakes
    roll: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) => {
        const times = [0, 0.15, 0.45, 0.5, 0.78, 0.9, 1]
        return Promise.all([
          animate(
            "[data-part=case]",
            { x: [0, -1, 21, -21, 0, 0, 0], rotate: [0, -6, 12, 12, -9, 4, 0] },
            { duration: seconds, times, ease: ["easeOut", ease.in, snap, ease.out, "easeInOut", "easeOut"] },
          ),
          animate("[data-part=wheel]", { rotate: [0, 720] }, { duration: seconds * 0.8, ease: "easeInOut" }),
        ])
      },
    },
    // turns on the spot in perspective: the case narrows to its edge and back twice, the straps sliding
    // across its face like the near side of a box
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=case]", { scaleX: [1, 0.3, 1, 0.3, 1], y: [0, -0.5, 0, -0.5, 0] }, options),
          animate("[data-part=strap]", { x: [0, 2.5, 0, -2.5, 0] }, options),
          animate("[data-part=handle]", { x: [0, -1, 0, 1, 0] }, options),
        ])
      },
    },
    // slammed down on a scale: it squashes onto its wheels, springs up stretched and settles, the handle
    // flopping a beat behind
    bump: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, times: [0, 0.2, 0.45, 0.7, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate(
            "[data-part=case]",
            { scaleY: [1, 0.82, 1.05, 0.94, 1], scaleX: [1, 1.12, 0.95, 1.04, 1] },
            options,
          ),
          animate("[data-part=handle]", { scaleY: [1, 1, 0.6, 1.25, 1] }, options),
        ])
      },
    },
  },
  render: () => (
    <g data-part="case" style={pivot("50% 100%")}>
      {/* a telescoping handle standing on the lid */}
      <path data-part="handle" d="M9 6V3h6v3" stroke={slot.accent} style={pivot("50% 100%")} />
      <path d="M5 6h14v13H5Z" />
      {/* two straps down the front, 2px clear of the lid and the base */}
      <path data-part="strap" d="M9 10v5M15 10v5" stroke={slot.accent} />
      <g fill={slot.primary} stroke="none">
        {WHEELS.map((x) => (
          <rect key={x} data-part="wheel" x={x} y="20.5" width="2" height="2" style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
