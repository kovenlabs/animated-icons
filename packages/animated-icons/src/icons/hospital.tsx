"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    hospital: "beacon" | "turn" | "build"
  }
}

/** A solid plus with 2px arms, centred in the tower. */
const CROSS = "M11 6h2v2h2v2h-2v2h-2v-2H9V8h2Z"

/** 2 colors: building (primary), cross (accent). */
export const Hospital = createAnimatedIcon({
  name: "hospital",
  category: "buildings",
  keywords: ["clinic", "medical", "emergency", "health", "care", "building", "doctor", "infirmary"],
  slots: { primary: "building", accent: "cross" },
  defaultVariant: "beacon",
  variants: {
    // the cross throbs like a lit sign, pumping out toward you twice
    beacon: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cross]",
            { scale: [1, 1.3, 1.05, 1.22, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.5, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=building]",
            { scaleY: [1, 0.97, 1, 0.98, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.5, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the cross lifts off the wall and spins twice on its post like a rooftop sign, then the building settles
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cross]",
            { scaleX: [1, -1, 1, -1, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=sign]",
            { scale: [1, 1.25, 1.25, 1] },
            { duration: seconds * 0.85, times: [0, 0.2, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=building]",
            { scaleY: [1, 1, 0.94, 1.02, 1] },
            { duration: seconds, times: [0, 0.75, 0.85, 0.93, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the hospital rises out of the ground and overshoots, then the cross spins in from nothing
    build: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=building]",
            { scaleY: [0, 1.06, 0.96, 1, 1] },
            { duration: seconds, times: [0, 0.4, 0.55, 0.7, 1], ease: [ease.out, "easeInOut", "easeInOut", "linear"] },
          ),
          animate(
            "[data-part=sign]",
            { scale: [0, 0, 1.35, 1], rotate: [-90, -90, 10, 0] },
            { duration: seconds, times: [0, 0.45, 0.8, 1], ease: ["linear", "easeOut", "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="building" style={pivot("50% 100%")}>
      {/* a tall centre block between two low wings, standing on the ground line, with a door */}
      <path d="M2 22V11h4V3h12v8h4v11Z" />
      <path d="M10 22v-5h4v5" />
      <g data-part="sign" style={pivot("50% 50%")}>
        <path data-part="cross" d={CROSS} fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
