"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cable-car": "ride" | "sway" | "twist"
  }
}

/** 2 colors: cable and cabin (primary), windows (accent). */
export const CableCar = createAnimatedIcon({
  name: "cable-car",
  family: "cable",
  category: "transport",
  keywords: ["gondola", "ropeway", "aerial tramway", "ski lift", "cableway", "mountain"],
  slots: { primary: "cable + cabin", accent: "windows" },
  defaultVariant: "ride",
  variants: {
    // glides up the cable and out, the cabin swinging back on its hanger, then rolls in from below and rocks to a stop
    ride: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          // along the cable's own slope (1 up for every 4 across), so the hanger never leaves it
          animate(
            "[data-part=car]",
            { x: [0, 14, -14, 0], y: [0, -3.5, 3.5, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.75, times: [0, 0.42, 0.58, 1], ease: [ease.in, "linear", ease.out] },
          ),
          animate(
            "[data-part=cabin]",
            { rotate: [0, 12, 12, -12, 7, -3, 0] },
            { duration: seconds, times: [0, 0.3, 0.42, 0.62, 0.76, 0.89, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // a gust catches it: a big pendulum swing that dies away on the hanger
    sway: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate("[data-part=cabin]", { rotate: [0, 12, -10, 7, -4, 1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the cabin turns round on its hanger: it narrows edge-on and opens out again, twice
    twist: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cabin]",
          { scaleX: [1, 0.2, 1, 0.2, 1], skewY: [0, 6, 0, -6, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the cable runs edge to edge, rising to the right */}
      <path d="M2 9 22 4" />
      <g data-part="car">
        {/* the hanger's top sits on the cable: the cabin swings from that point */}
        <g data-part="cabin" style={pivot("50% 0%")}>
          <path d="M12 6.5V12" />
          <path d="M5 12h14v9H5Z" />
          <path d="M5 16h14M9.5 12v4M14.5 12v4" stroke={slot.accent} />
        </g>
      </g>
    </>
  ),
})
