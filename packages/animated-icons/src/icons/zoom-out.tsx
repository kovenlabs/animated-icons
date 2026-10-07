"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "zoom-out": "recede" | "turn" | "minus"
  }
}

/** 2 colors: lens and handle (primary), minus sign (accent). */
export const ZoomOut = createAnimatedIcon({
  name: "zoom-out",
  family: "zoom",
  category: "actions",
  keywords: ["shrink", "reduce", "zoom", "magnifying glass", "scale down", "smaller", "further"],
  slots: { primary: "lens + handle", accent: "minus sign" },
  defaultVariant: "recede",
  variants: {
    // the glass falls away from you, then springs back past rest; the minus squeezes in and stretches out
    recede: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glass]",
            { scale: [1, 0.7, 1.1, 0.97, 1], y: [0, 1, -0.5, 0, 0] },
            { duration: seconds, times: [0, 0.4, 0.7, 0.85, 1], ease: ["easeOut", ease.overshoot, "easeInOut", "easeOut"] },
          ),
          animate(
            "[data-part=minus]",
            { scaleX: [1, 0.3, 1.3, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: ["easeOut", ease.overshoot, "easeOut"] },
          ),
        ]),
    },
    // the magnifier turns right round on its vertical axis, lifting toward you as it goes
    turn: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=magnifier]",
          { scaleX: [1, -1, 1], scale: [1, 1.08, 1], y: [0, -1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the minus collapses to a dot, then snaps back wide; the glass sinks a little with it
    minus: {
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=minus]",
            { scaleX: [1, 0.15, 1.35, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ["easeIn", ease.overshoot, "easeOut"] },
          ),
          animate(
            "[data-part=glass]",
            { scale: [1, 0.92, 1] },
            { duration: seconds, times: [0, 0.35, 1], ease: ["easeIn", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="magnifier" style={pivot("50% 50%")}>
      {/* the same glass as search: it scales about the centre of its lens (10, 10) */}
      <g data-part="glass" style={pivot("40% 40%")}>
        {/* a lens is round, so it gets a true circle */}
        <circle cx="10" cy="10" r="7" />
        <path d="M15 15l5.5 5.5" />
        <path data-part="minus" d="M7 10h6" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
