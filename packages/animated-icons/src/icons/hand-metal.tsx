"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "hand-metal": "rock" | "headbang" | "flip"
  }
}

/** 1 color: hand. */
export const HandMetal = createAnimatedIcon({
  name: "hand-metal",
  family: "hand",
  category: "social",
  keywords: ["rock on", "horns", "metal", "concert", "music", "gesture", "rock and roll", "party"],
  slots: { primary: "hand" },
  defaultVariant: "rock",
  variants: {
    // pulls back and thrusts the horns at the crowd on two beats, kicking a little each time
    rock: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=hand]",
          {
            scale: [1, 0.88, 1.06, 0.9, 1.06, 1],
            y: [0, 1, -0.5, 1, -0.5, 0],
            rotate: [0, 3, -6, 3, -6, 0],
          },
          {
            duration: seconds,
            times: [0, 0.18, 0.36, 0.54, 0.72, 1],
            ease: ["easeOut", ease.out, "easeInOut", ease.out, ease.overshoot],
          },
        ),
    },
    // rocks out side to side, the hand shearing behind each swing like it is thrown about in a mosh pit
    headbang: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=hand]",
          { rotate: [0, -12, 10, -8, 5, 0], skewX: [0, 6, -6, 4, -2, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // turned round on its upright axis to show the back of the hand, rising toward you as it turns,
    // and round again to the palm
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=hand]",
          {
            scaleX: [1, 0, -1, -1, 0, 1],
            scaleY: [1, 1.03, 1, 1, 1.03, 1],
            y: [0, -0.5, 0, 0, -0.5, 0],
          },
          {
            duration: seconds,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            ease: ["easeIn", "easeOut", "linear", "easeIn", ease.overshoot],
          },
        ),
    },
  },
  render: () => (
    <g data-part="hand" style={pivot("50% 50%")}>
      {/* index and little finger raised as horns, the middle two folded flat across the top of the palm */}
      <path d="M6 3h4v7h6V4h4v11l-4 6h-6l-4-4Z" />
      {/* the thumb, laid across the folded fingers */}
      <path d="M6 13l4 1.5h4" />
    </g>
  ),
})
