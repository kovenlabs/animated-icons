"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    brush: "paint" | "swish"
  }
}

/** 3 colors: handle (primary), ferrule (secondary), bristles and the paint they lay down (accent). */
export const Brush = createAnimatedIcon({
  name: "brush",
  category: "design",
  keywords: ["paint", "paintbrush", "art", "draw", "style", "format painter", "decorate"],
  slots: { primary: "handle", secondary: "ferrule", accent: "bristles + paint stroke" },
  defaultVariant: "paint",
  variants: {
    // the brush glides right, laying a stroke of paint under its tip; it lifts off and slides back
    // as the paint fades (2.5px: the end of the handle stays inside the frame)
    paint: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=brush]",
            { x: [0, 2.5, 2.5, 0], y: [0, 0, -1.5, 0] },
            { duration: seconds, times: [0, 0.5, 0.65, 1], ease: "easeInOut" },
          ),
          // hidden until it has length: a square cap paints a dot at pathLength 0
          animate(
            "[data-part=paint]",
            { opacity: [0, 0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.04, 0.05, 0.6, 0.9] },
          ),
          animate(
            "[data-part=paint]",
            { pathLength: [0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.04, 0.5, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the handle holds still while the bristles flick side to side from the ferrule and settle
    swish: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate("[data-part=bristles]", { rotate: [0, 14, -10, 5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      {/* the paint the tip leaves behind: only exists in motion */}
      <path data-part="paint" d="M3 21h2.5" stroke={slot.accent} style={flash("0% 50%")} />
      <g data-part="brush">
        {/* a slim 45° handle, open where it meets the ferrule */}
        <path d="M10.5 10.5l6.5-6.5 3 3-6.5 6.5" />
        <path d="M10 10l4 4-3 3-4-4Z" stroke={slot.secondary} />
        {/* a flame of bristles hanging off the ferrule; flexes about its middle */}
        <path data-part="bristles" d="M7 13 4 17l-1 4 4-1 4-3" stroke={slot.accent} style={pivot("75% 25%")} />
      </g>
    </>
  ),
})
