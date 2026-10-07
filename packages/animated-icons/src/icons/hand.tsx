"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    hand: "wave" | "push" | "turn"
  }
}

/** 1 color: hand. */
export const Hand = createAnimatedIcon({
  name: "hand",
  category: "social",
  keywords: ["wave", "hello", "hi", "palm", "stop", "high five", "greeting", "goodbye"],
  slots: { primary: "hand" },
  defaultVariant: "wave",
  variants: {
    // a big friendly wave from the wrist, the palm turning a little with each swing, settling slowly
    wave: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=palm]",
          { rotate: [0, 16, -10, 14, -6, 3, 0], scaleX: [1, 0.9, 1, 0.92, 1, 1, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // a high five: the palm draws back, then pushes out towards you, holds the slap, and settles
    push: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=hand]",
          { scale: [1, 0.85, 1.35, 1.35, 1], y: [0, 1, -1, -1, 0] },
          { duration: seconds, times: [0, 0.25, 0.45, 0.6, 1], ease: ["easeOut", ease.in, "linear", ease.overshoot] },
        ),
    },
    // turned round on its upright axis to show the back of the hand, and round again to the palm
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=palm]",
          { scaleX: [1, 0, -1, -1, 0, 1], y: [0, -1, -1, -1, -1, 0] },
          { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: ["easeIn", "easeOut", "linear", "easeIn", "easeOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="hand" style={pivot("50% 50%")}>
      <g data-part="palm" style={pivot("50% 100%")}>
        {/* an open palm: four flat-topped fingers stepping up to the middle one, a thumb lobe out to the
            left, and the wrist across the bottom */}
        <path d="M6 13V5h4V2h4v2h4v3h4v8l-5 7H9l-7-7z" />
        {/* the splits between the fingers, down into the palm */}
        <path d="M10 5v8M14 4v8M18 7v7" />
      </g>
    </g>
  ),
})
