"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    eye: "blink" | "look" | "focus"
  }
}

/** 2 colors: outline (primary), pupil (accent). */
export const Eye = createAnimatedIcon({
  name: "eye",
  category: "security",
  keywords: ["view", "visible", "show", "watch", "preview", "reveal", "visibility"],
  slots: { primary: "outline", accent: "pupil" },
  defaultVariant: "blink",
  variants: {
    // the lids close to a slit and reopen
    blink: {
      duration: 450,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=eye]",
          { scaleY: [1, 0.12, 1] },
          { duration: seconds, times: [0, 0.4, 1], ease: "easeInOut" },
        ),
    },
    // glances left, then right, then back to centre
    look: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pupil]",
          { x: [0, -3, -3, 3, 3, 0] },
          { duration: seconds, times: [0, 0.15, 0.4, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
    // the pupil narrows, then widens as it settles on something
    focus: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pupil]",
          { scale: [1, 0.5, 1.2, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <g data-part="eye" style={pivot("50% 50%")}>
      {/* an almond from straight segments: pointed corners, flat lids */}
      <path d="M2 12l6-5h8l6 5-6 5H8z" />
      <rect data-part="pupil" x="10" y="10" width="4" height="4" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </g>
  ),
})
