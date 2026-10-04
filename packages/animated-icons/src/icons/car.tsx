"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    car: "drive" | "bump" | "flash"
  }
}

/** 2 colors: body and wheels (primary), headlight, beams and speed lines (accent). */
export const Car = createAnimatedIcon({
  name: "car",
  category: "transport",
  keywords: ["vehicle", "auto", "drive", "ride", "taxi", "parking", "road"],
  slots: { primary: "body + wheels", accent: "headlight + beams + speed lines" },
  defaultVariant: "drive",
  variants: {
    // speeds off to the right, leaving speed lines behind, and rolls back in from the left
    drive: {
      clip: true,
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=car]",
            { x: [0, 9, -9, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=speed]",
            { opacity: [0, 1, 0] },
            { duration: seconds * 0.35, delay: seconds * 0.08, ease: "easeOut" },
          ),
        ]),
    },
    // rolls over a bump: the front wheels lift first, then the rear
    bump: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=body]",
            { rotate: [0, -7, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=car]",
            { rotate: [0, 0, 6, 0] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // flashes its headlight twice
    flash: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=lamp]", { scale: [1, 1.4, 1, 1.4, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=beam]", { opacity: [0, 1, 0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <g data-part="speed" style={flash()}>
          <path d="M0 10h1.5" />
          <path d="M0 14h1.5" />
        </g>
        <path data-part="beam" d="M21 10l1.5-1" style={flash("0% 100%")} />
        <path data-part="beam" d="M21 13h1.5" style={flash("0% 50%")} />
        <path data-part="beam" d="M21 16l1.5 1" style={flash("0% 0%")} />
      </g>
      <g data-part="car" style={pivot("100% 100%")}>
        <g data-part="body" style={pivot("0% 100%")}>
          {/* a hatchback in profile: raked rear, flat roof, sloped windscreen, short hood */}
          <path d="M4 16H2v-5.5l2-5h7.5l3.5 4.5 4 1V16h-2M8 16h5" />
          <circle cx="6" cy="16" r="2" />
          <circle cx="15" cy="16" r="2" />
          <rect data-part="lamp" x="16.5" y="12" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("100% 50%")} />
        </g>
      </g>
    </>
  ),
})
