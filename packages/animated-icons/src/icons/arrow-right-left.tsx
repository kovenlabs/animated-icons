"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "arrow-right-left": "swap" | "trade" | "through"
  }
}

/** 1 color. */
export const ArrowRightLeft = createAnimatedIcon({
  name: "arrow-right-left",
  family: "arrow",
  category: "arrows",
  keywords: ["swap", "exchange", "transfer", "switch", "trade", "convert", "horizontal"],
  slots: { primary: "arrows" },
  defaultVariant: "swap",
  variants: {
    // both arrows push out their own way at once and settle back
    swap: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=right]",
            { x: [0, 3, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=left]",
            { x: [0, -3, 0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the pair turns half a circle about its centre, so the two arrows trade places without crossing; a beat,
    // then they trade back
    trade: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pair]",
          { rotate: [0, 180, 180, 360] },
          { duration: seconds, times: [0, 0.4, 0.6, 1], ease: "easeInOut" },
        ),
    },
    // each arrow leaves through its own side and comes back in from the other
    through: {
      clip: true,
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=right]",
            { x: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=left]",
            { x: [0, -7, 7, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="pair" style={pivot("50% 50%")}>
      {/* each arrow moves as one piece, so its shaft never pokes through its point */}
      <g data-part="right">
        <path d="M4 8h15.5" />
        <path d="M16 4l4 4-4 4" />
      </g>
      <g data-part="left">
        <path d="M20 16H4.5" />
        <path d="M8 12l-4 4 4 4" />
      </g>
    </g>
  ),
})
