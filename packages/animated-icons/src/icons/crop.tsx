"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    crop: "close" | "rotate"
  }
}

/** 1 color: the two crop marks. */
export const Crop = createAnimatedIcon({
  name: "crop",
  category: "design",
  keywords: ["trim", "cut", "resize", "frame", "aspect ratio", "image edit", "selection"],
  slots: { primary: "crop marks" },
  defaultVariant: "close",
  variants: {
    // both corners close in on the centre, tightening the frame, and spring back out. Their long
    // arms run off the edges of the frame, so the variant clips to it
    close: {
      duration: 800,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lower]",
            { x: [0, 2, 2, 0], y: [0, -2, -2, 0] },
            { duration: seconds, times: [0, 0.4, 0.55, 1], ease: ["easeInOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=upper]",
            { x: [0, -2, -2, 0], y: [0, 2, 2, 0] },
            { duration: seconds, times: [0, 0.4, 0.55, 1], ease: ["easeInOut", "linear", ease.overshoot] },
          ),
        ]),
    },
    // the crop turns a half turn, like rotating the frame; turned 180° it looks exactly as it did at
    // rest, so it snaps back to 0 unseen
    rotate: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=crop]",
          { rotate: [0, 180, 0] },
          { duration: seconds, times: [0, 1, 1], ease: ["easeInOut", "linear"] },
        ),
    },
  },
  render: () => (
    <g data-part="crop" style={pivot("50% 50%")}>
      {/* two L-shaped marks, each corner set 6 in from the frame, overlapping like a crop box */}
      <path data-part="lower" d="M6 2v16h16" />
      <path data-part="upper" d="M18 22V6H2" />
    </g>
  ),
})
