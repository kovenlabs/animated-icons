"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "skip-back": "skip" | "previous" | "spin"
  }
}

/**
 * `skip-forward` mirrored: the `play` triangle (13 wide, 16 tall) points left, set back against the right
 * edge, its point 5 short of the bar so even a sharp miter keeps 2px clear of the bar's stroke.
 */
const TRIANGLE = "M21 4v16L8 12Z"

/** 2 colors: outline + bar (primary), triangle fill (accent). */
export const SkipBack = createAnimatedIcon({
  name: "skip-back",
  family: "skip",
  category: "media",
  keywords: ["previous", "previous track", "back", "restart", "rewind", "playlist", "player", "media"],
  slots: { primary: "outline + bar", accent: "triangle fill" },
  defaultVariant: "skip",
  variants: {
    // the triangle winds back and punches the bar, which is knocked flat into the screen and springs back up
    skip: {
      duration: 950,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=triangle]",
            { x: [0, 1.5, -1, 0], scaleX: [1, 0.82, 1.04, 1] },
            { duration: seconds * 0.6, times: [0, 0.45, 0.7, 1], ease: ["easeOut", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=bar]",
            { scaleY: [1, 1, 0.55, 1.08, 1] },
            { duration: seconds, times: [0, 0.38, 0.5, 0.78, 1], ease: ["linear", "easeOut", "easeOut", "easeInOut"] },
          ),
        ]),
    },
    // previous track: the button leans into the move, slides out to the left and glides back in from the right
    previous: {
      clip: true,
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=skip]",
          { x: [0, -24, 24, 0, 0], skewX: [0, 20, 20, -10, 0] },
          { duration: seconds, times: [0, 0.4, 0.401, 0.8, 1], ease: [ease.in, snap, ease.out, "easeInOut"] },
        ),
    },
    // flipped like a coin: lifted toward you, it turns edge-on twice and lands face up
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=face]",
            { scaleX: [1, 0, 1, 0, 1] },
            { duration: seconds * 0.8, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=skip]",
            { scale: [1, 1.2, 1.2, 0.94, 1], y: [0, -1.5, -1.5, 0.5, 0] },
            { duration: seconds, times: [0, 0.2, 0.7, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="skip" style={pivot("50% 50%")}>
      <g data-part="face" style={pivot("50% 50%")}>
        {/* pivots on its flat back edge, so a squash pulls the point back, away from the bar */}
        <g data-part="triangle" style={pivot("100% 50%")}>
          <path d={TRIANGLE} fill={slot.accent} stroke="none" />
          <path d={TRIANGLE} />
        </g>
        {/* hinged at its foot: knocked flat, it shortens toward the floor */}
        <path data-part="bar" d="M3 4v16" style={pivot("50% 100%")} />
      </g>
    </g>
  ),
})
