"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    map: "unfold" | "flap" | "flip"
  }
}

/**
 * 1 color: a map folded in three. Each panel is its own shape, so the outer two can fold over the middle:
 * mirrored about its fold, either one lands exactly on the middle panel.
 */
export const Map = createAnimatedIcon({
  name: "map",
  category: "navigation",
  keywords: ["atlas", "chart", "route", "travel", "directions", "location", "trip", "folded map"],
  slots: { primary: "map" },
  defaultVariant: "unfold",
  variants: {
    // folds shut, left panel then right flipping over onto the middle, and opens back out with a snap
    unfold: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=left]",
            { scaleX: [1, -1, -1, 1] },
            { duration: seconds, times: [0, 0.28, 0.55, 0.85], ease: ["easeInOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=right]",
            { scaleX: [1, 1, -1, -1, 1] },
            { duration: seconds, times: [0, 0.12, 0.4, 0.62, 0.95], ease: ["linear", "easeInOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=map]",
            { y: [0, 0, -2, 0, 0], scale: [1, 1, 1.12, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.48, 0.62, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the outer panels flap on their folds like wings, tilting back as they rise
    flap: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const tilt = { scaleX: [1, 0.7, 1, 0.75, 1, 1] }
        const times = [0, 0.22, 0.45, 0.65, 0.85, 1]
        return Promise.all([
          animate(
            "[data-part=left]",
            { skewY: [0, 18, -10, 14, -5, 0], ...tilt },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=right]",
            { skewY: [0, -18, 10, -14, 5, 0], ...tilt },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
    // tossed up, it turns head over heels once and lands flat with a squash
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=map]",
          { y: [0, -3, -3, 0, 0, 0], scaleY: [1, 0, -1, 0, 0.9, 1], scaleX: [1, 1, 1, 1, 1.06, 1] },
          { duration: seconds, times: [0, 0.22, 0.44, 0.66, 0.82, 1], ease: ["easeOut", "linear", "easeIn", "easeOut", "easeInOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="map" style={pivot("50% 50%")}>
      {/* the outer panels fold on their inner edges */}
      <path data-part="left" d="M3 6 9 3v15l-6 3Z" style={pivot("100% 50%")} />
      <path d="M9 3l6 3v15l-6-3Z" />
      <path data-part="right" d="M15 6l6-3v15l-6 3Z" style={pivot("0% 50%")} />
    </g>
  ),
})
