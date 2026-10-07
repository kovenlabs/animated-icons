"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    aperture: "iris" | "twist" | "flip"
  }
}

/**
 * Six blades. Each runs along one edge of the central hexagon (corners 4.6 from the centre) and on
 * to the ring, where it is hinged: `origin` is that end, in its own box.
 */
const BLADES = [
  { d: "M9.7 8.02h11.47", origin: "100% 50%" },
  { d: "M14.3 8.02l5.74 9.93", origin: "100% 100%" },
  { d: "M16.6 12l-5.74 9.94", origin: "0% 100%" },
  { d: "M14.3 15.98H2.83", origin: "0% 50%" },
  { d: "M9.7 15.98 3.96 6.05", origin: "0% 0%" },
  { d: "M7.4 12l5.74-9.94", origin: "100% 0%" },
] as const

/** 2 colors: ring (primary), blades (accent). */
export const Aperture = createAnimatedIcon({
  name: "aperture",
  category: "media",
  keywords: ["camera", "shutter", "lens", "iris", "photography", "f-stop", "focus", "exposure"],
  slots: { primary: "ring", accent: "blades" },
  defaultVariant: "iris",
  variants: {
    // every blade swings on its hinge in the ring: the iris stops down to a small hole, the ring clicks, then
    // the blades open past wide and settle
    iris: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=blade]",
            { rotate: [0, -13, -13, 8, 0] },
            { duration: seconds, times: [0, 0.32, 0.5, 0.78, 1], ease: ["easeIn", "linear", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=ring]",
            { scale: [1, 1, 0.92, 1.04, 1] },
            { duration: seconds, times: [0, 0.3, 0.4, 0.6, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the blades spin a third of a turn inside the still ring with a spring, and snap back unseen
    twist: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=blades]",
          { rotate: [0, 120, 0] },
          { duration: seconds, times: [0, 0.999, 1], ease: [ease.overshoot, snap] },
        ),
    },
    // the lens turns a full circle about its vertical axis and comes toward you on the way: halfway
    // round the blades spiral the other way
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=aperture]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate("[data-part=aperture]", { scaleY: [1, 1.12, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="aperture" style={pivot("50% 50%")}>
      {/* a lens ring: genuinely round */}
      <circle data-part="ring" cx={12} cy={12} r={10} style={pivot("50% 50%")} />
      <g data-part="blades" stroke={slot.accent} style={pivot("50% 50%")}>
        {BLADES.map(({ d, origin }) => (
          <path key={d} data-part="blade" d={d} style={pivot(origin)} />
        ))}
      </g>
    </g>
  ),
})
