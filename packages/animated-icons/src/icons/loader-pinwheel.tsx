"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "loader-pinwheel": "spin" | "whirl" | "tilt"
  }
}

/** Three hooked vanes, a third of a turn apart: each runs out from the hub, kinks, and meets the rim. */
const VANES = [0, 120, 240]

/** 2 colors: rim (primary), vanes (accent). Loops forever with no rest by default, like every loader. */
export const LoaderPinwheel = createAnimatedIcon({
  name: "loader-pinwheel",
  family: "loader",
  category: "status",
  keywords: ["spinner", "loading", "pinwheel", "wait", "busy", "progress", "processing"],
  slots: { primary: "rim", accent: "vanes" },
  defaultVariant: "spin",
  defaults: { trigger: "auto", interval: 0 },
  variants: {
    // turns at a steady clip, like a pinwheel in a breeze
    spin: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate("[data-part=wheel]", { rotate: [0, 360] }, { duration: seconds, ease: "linear" }),
    },
    // a gust: winds up, whips round twice while it is pushed back, and coasts to a stop
    whirl: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=wheel]", { rotate: [0, 720] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=wheel]",
            { scale: [1, 0.82, 1] },
            { duration: seconds, times: [0, 0.5, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // tips back into the distance while it turns, flattening to an ellipse, and rises face-on again
    tilt: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=wheel]", { rotate: [0, 360] }, { duration: seconds, ease: "linear" }),
          animate(
            "[data-part=wheel]",
            { scaleY: [1, 0.4, 1] },
            { duration: seconds, times: [0, 0.5, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="wheel" style={pivot("50% 50%")}>
      <circle cx="12" cy="12" r="10" />
      <g stroke={slot.accent}>
        {VANES.map((angle) => (
          <path key={angle} d="M12 12 8 7l4-5" transform={`rotate(${angle} 12 12)`} />
        ))}
      </g>
    </g>
  ),
})
