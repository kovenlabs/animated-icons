"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    hexagon: "toss" | "twist" | "tilt"
  }
}

/** 2 colors: tile (primary), inner hexagon (accent). */
export const Hexagon = createAnimatedIcon({
  name: "hexagon",
  category: "design",
  keywords: ["shape", "polygon", "six sides", "honeycomb", "cell", "geometry", "nut", "badge"],
  slots: { primary: "tile", accent: "inner hexagon" },
  defaultVariant: "toss",
  variants: {
    // tossed up like a tile: it tumbles over its horizontal axis while spinning a sixth of a turn,
    // lands with a squash, and the spin snaps back unseen (a sixth of a turn is the same pose)
    toss: {
      duration: 1250,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hexagon]",
            { y: [0, 1, -5, 0, 0, 0], scaleX: [1, 1.08, 0.95, 1, 1.1, 1] },
            { duration: seconds, times: [0, 0.12, 0.42, 0.72, 0.82, 1], ease: ["easeOut", "easeOut", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=hexagon]",
            { scaleY: [1, 0.86, 0, -1, 0, 1, 0.84, 1] },
            {
              duration: seconds,
              times: [0, 0.12, 0.27, 0.42, 0.57, 0.72, 0.82, 1],
              ease: ["easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=hexagon]",
            { rotate: [0, 0, 60, 60, 0] },
            { duration: seconds, times: [0, 0.12, 0.72, 0.999, 1], ease: ["linear", "easeInOut", "linear", snap] },
          ),
        ]),
    },
    // tightened like a nut: two ratcheting sixth turns, the inner hexagon counter-turning; both are
    // back in their own pose at the end and snap to rest unseen
    twist: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tile]",
            { rotate: [0, 60, 60, 120, 120, 0] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.75, 0.999, 1], ease: [ease.overshoot, "linear", ease.overshoot, "linear", snap] },
          ),
          animate(
            "[data-part=inner]",
            { rotate: [0, -60, -60, -120, -120, 0] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.75, 0.999, 1], ease: [ease.overshoot, "linear", ease.overshoot, "linear", snap] },
          ),
        ]),
    },
    // pitches back and forth on its horizontal axis: the tile foreshortens while the raised inner
    // hexagon slides the other way, nearer to you
    tilt: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=hexagon]", { scaleY: [1, 0.7, 1, 0.7, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=inner]", { y: [0, -2.2, 0, 2.2, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="hexagon" style={pivot("50% 50%")}>
      {/* a regular hexagon, point up, 10 from its centre to every corner */}
      <path data-part="tile" d="M12 2l8.66 5v10L12 22l-8.66-5V7z" style={pivot("50% 50%")} />
      {/* the same shape at 4, 3.5 clear of the tile */}
      <path
        data-part="inner"
        d="M12 8l3.46 2v4L12 16l-3.46-2v-4z"
        stroke={slot.accent}
        style={pivot("50% 50%")}
      />
    </g>
  ),
})
