"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    telescope: "sweep" | "turn" | "extend"
  }
}

/**
 * Where the tube rests on the tripod's apex (12.5, 13.5), as a share of the tipped tube's box: the tube
 * swings about this point so it never leaves its mount. A group's box is its tipped child's box, tipped
 * and boxed again, so it is looser than the drawing: 1.53..20.71 × 4.15..18.78.
 */
const MOUNT = pivot("57.2% 63.9%")

/** 2 colors: tube + tripod (primary), lens hood + star (accent). The star only exists in motion. */
export const Telescope = createAnimatedIcon({
  name: "telescope",
  category: "education",
  keywords: ["astronomy", "stargazing", "space", "observatory", "discover", "explore", "science", "vision"],
  slots: { primary: "tube + tripod", accent: "lens hood + star" },
  defaultVariant: "sweep",
  variants: {
    // the tube swings up on its mount to find a star, overshoots, and settles on it as the star twinkles
    sweep: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tube]",
            { rotate: [0, 8, -12, 3, 0] },
            { duration: seconds, times: [0, 0.2, 0.55, 0.8, 1], ease: ["easeOut", "easeInOut", "easeInOut", ease.out] },
          ),
          animate(
            "[data-part=star]",
            { ...blink, rotate: [0, 90, 180] },
            { duration: seconds * 0.5, delay: seconds * 0.45, ease: "easeOut" },
          ),
        ]),
    },
    // turned round on its tripod to look the other way and back, a full turn about the mount
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=telescope]",
          { scaleX: [1, 0, -1, 0, 1] },
          { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
        ),
    },
    // the tube telescopes out toward the sky from its eyepiece, the hood flaring, and slides back
    extend: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=barrel]",
            { scaleX: [1, 1.25, 0.96, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", "easeInOut", ease.out] },
          ),
          animate(
            "[data-part=hood]",
            { scaleY: [1, 1, 1.3, 1] },
            { duration: seconds, times: [0, 0.3, 0.5, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // turns about the tripod's axis, x 12.5 of its 1.53..21.5 box
    <g data-part="telescope" style={pivot("54.9% 0%")}>
      {/* a tripod whose apex carries the tube */}
      <path d="M9 21l3.5-7.5L16 21" />
      <g data-part="tube" style={MOUNT}>
        {/* drawn level along y 11 and tipped 28° up: eyepiece, barrel, then a wider lens hood */}
        <g transform="rotate(-28 12 11)">
          <g data-part="barrel" style={pivot("0% 50%")}>
            <path d="M2 10h3v2H2zM5 8.5h11v5H5z" />
            <path data-part="hood" d="M16 7.5h4v7h-4z" stroke={slot.accent} style={pivot("50% 50%")} />
          </g>
        </g>
      </g>
      {/* the star it finds, up and to the right of the hood */}
      <path data-part="star" d="M20 2v3M18.5 3.5h3" stroke={slot.accent} style={flash()} />
    </g>
  ),
})
