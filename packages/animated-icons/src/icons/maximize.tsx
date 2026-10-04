"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    maximize: "expand" | "collapse" | "turn"
  }
}

/** 1 color: two diagonal arrows pointing out to opposite corners. */
export const Maximize = createAnimatedIcon({
  name: "maximize",
  category: "layout",
  keywords: ["fullscreen", "expand", "enlarge", "full screen", "grow", "resize", "zoom"],
  slots: { primary: "corner arrows" },
  defaultVariant: "expand",
  variants: {
    // both arrows push out to their corners and settle back
    expand: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ne]",
            { x: [0, 2, -0.5, 0], y: [0, -2, 0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=sw]",
            { x: [0, -2, 0.5, 0], y: [0, 2, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // both arrows draw in toward the middle, then spring back out to their corners
    collapse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ne]",
            { x: [0, -2, 0], y: [0, 2, 0] },
            { duration: seconds, times: [0, 0.4, 1], ease: ["easeInOut", ease.overshoot] },
          ),
          animate(
            "[data-part=sw]",
            { x: [0, 2, 0], y: [0, -2, 0] },
            { duration: seconds, times: [0, 0.4, 1], ease: ["easeInOut", ease.overshoot] },
          ),
        ]),
    },
    // a half turn that lands. The icon looks the same half a turn back, so it starts there and
    // comes to rest at 0 without a visible jump.
    turn: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=arrows]", { rotate: [-180, 0] }, { duration: seconds, ease: ease.overshoot }),
    },
  },
  render: () => (
    <g data-part="arrows" style={pivot("50% 50%")}>
      {/* each arrow moves as one piece: a right-angled head, its shaft stopping short of the point */}
      <g data-part="ne">
        <path d="M14 4h6v6" />
        <path d="M19 5l-5 5" />
      </g>
      <g data-part="sw">
        <path d="M10 20H4v-6" />
        <path d="M5 19l5-5" />
      </g>
    </g>
  ),
})
