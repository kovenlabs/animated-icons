"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    wine: "swirl" | "cheers" | "refill"
  }
}

/** 2 colors: glass (primary), wine (accent). */
export const Wine = createAnimatedIcon({
  name: "wine",
  category: "commerce",
  keywords: ["glass", "drink", "alcohol", "bar", "red wine", "toast", "celebrate", "restaurant"],
  slots: { primary: "glass", accent: "wine" },
  defaultVariant: "swirl",
  variants: {
    // swirled on its foot: the glass rocks one way and the other, and the wine lags behind, staying
    // level as the bowl tilts and sloshing past it
    swirl: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glass]",
            { rotate: [0, 8, -8, 6, -3, 0] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.65, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=wine]",
            { skewY: [0, -10, 9, -7, 4, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.7, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // raised for a toast: the glass lifts and tips into a clink, rings for a moment, and is set down;
    // the wine sloshes against the tilt
    cheers: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glass]",
            { y: [0, -3, -3, -3, 0, 0], rotate: [0, 12, 8, 10, -2, 0] },
            {
              duration: seconds,
              times: [0, 0.3, 0.4, 0.5, 0.8, 1],
              ease: [ease.in, "easeOut", "easeInOut", "easeInOut", ease.overshoot],
            },
          ),
          animate(
            "[data-part=wine]",
            { skewY: [0, 0, -10, 6, -3, 0] },
            { duration: seconds, times: [0, 0.25, 0.38, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // drunk and refilled: the glass tips up to the lips while the wine drains away, rights itself, and
    // the wine pours back in to the brim and settles
    refill: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glass]",
            { y: [0, -2, -2, 0, 0], rotate: [0, -15, -15, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.55, 1], ease: ["easeOut", "linear", "easeInOut", "linear"] },
          ),
          animate(
            "[data-part=level]",
            { scaleY: [1, 0.6, 0, 0, 1.15, 0.95, 1] },
            {
              duration: seconds,
              times: [0, 0.2, 0.4, 0.55, 0.78, 0.9, 1],
              ease: ["easeIn", "easeOut", "linear", "easeOut", "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=wine]",
            { skewY: [0, 10, 10, 0, -6, 4, 0] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.55, 0.78, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // the glass's box runs 6..18 × 2..21: it tilts on its foot at 50% 100%
    <g data-part="glass" style={pivot("50% 100%")}>
      {/* the wine fills the bowl's lower half, its edges tucked under the bowl's stroke; the level
          fills from the bottom of the bowl, the surface tilts about its middle */}
      <g data-part="level" style={pivot("50% 100%")}>
        <path
          data-part="wine"
          d="M6.5 8.5h11l-1.75 3.25-3.75 2.25-3.75-2.25Z"
          fill={slot.accent}
          stroke="none"
          style={pivot("50% 0%")}
        />
      </g>
      {/* a faceted bowl: straight flanks, angled shoulders tapering into the stem */}
      <path d="M7 2h10l1 6-2 4-4 2.5L8 12 6 8Z" />
      <path d="M12 14.5V21M8 21h8" />
    </g>
  ),
})
