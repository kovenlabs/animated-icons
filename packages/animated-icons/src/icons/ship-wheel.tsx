"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "ship-wheel": "spin" | "steer" | "tilt"
  }
}

/** A point on the wheel `r` out from the hub, `deg` clockwise from straight up. */
const at = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return `${+(12 + r * Math.sin(a)).toFixed(2)} ${+(12 - r * Math.cos(a)).toFixed(2)}`
}

/** A spoke from the hub's rim out past the wheel's rim, ending in a handle. */
const spoke = (deg: number) => `M${at(2.5, deg)}L${at(9.5, deg)}`

/** Seven plain spokes; the eighth, straight up, is the king spoke that shows which way the wheel has turned. */
const SPOKES = [45, 90, 135, 180, 225, 270, 315].map(spoke).join("")

/** 2 colors: rim and spokes (primary), hub and king spoke (accent). */
export const ShipWheel = createAnimatedIcon({
  name: "ship-wheel",
  family: "ship",
  category: "transport",
  keywords: ["helm", "steering wheel", "captain", "nautical", "sailing", "navigation", "boat"],
  slots: { primary: "rim + spokes", accent: "hub + king spoke" },
  defaultVariant: "spin",
  variants: {
    // spun hard: a full turn that winds up, overshoots and swings back to centre
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=wheel]",
          { rotate: [0, -20, 385, 350, 360], scale: [1, 1, 0.94, 1.02, 1] },
          { duration: seconds, times: [0, 0.15, 0.6, 0.8, 1], ease: ["easeOut", "easeIn", "easeOut", "easeInOut"] },
        ),
    },
    // hard over to port, back to starboard, and settles amidships
    steer: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=wheel]",
          { rotate: [0, -110, 75, -30, 10, 0] },
          { duration: seconds, times: [0, 0.25, 0.55, 0.75, 0.9, 1], ease: "easeInOut" },
        ),
    },
    // the helm tips towards you, seen edge-on as it turns half round, and swings back flat
    tilt: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=helm]",
            { scaleX: [1, 0.3, 1], skewY: [0, 10, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=wheel]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="helm" style={pivot("50% 50%")}>
      <g data-part="wheel" style={pivot("50% 50%")}>
        <circle cx="12" cy="12" r="7" />
        <path d={SPOKES} />
        <g stroke={slot.accent}>
          <circle cx="12" cy="12" r="2.5" />
          <path d={spoke(0)} />
        </g>
      </g>
    </g>
  ),
})
