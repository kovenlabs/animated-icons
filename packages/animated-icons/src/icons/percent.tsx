"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    percent: "spin" | "pop" | "draw"
  }
}

/** 2 colors: slash (primary), dots (accent). */
export const Percent = createAnimatedIcon({
  name: "percent",
  category: "finance",
  keywords: ["discount", "sale", "rate", "interest", "percentage", "tax", "offer", "promo"],
  slots: { primary: "slash", accent: "dots" },
  defaultVariant: "spin",
  variants: {
    // a half turn on its centre swaps the dots; the sign is symmetric, so it lands on its rest pose
    spin: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=percent]",
          { rotate: [0, 180, 0] },
          { duration: seconds, times: [0, 0.999, 1], ease: ["easeInOut", "linear"] },
        ),
    },
    // the dots pop back in, one after the other
    pop: {
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["top", "bottom"].map((dot, i) =>
            animate(
              `[data-part=${dot}]`,
              { scale: [1, 0, 1.25, 1] },
              { duration: seconds * 0.65, delay: seconds * 0.35 * i, times: [0, 0.3, 0.7, 1], ease: ease.out },
            ),
          ),
        ),
    },
    // the slash is struck again, top right to bottom left. Hidden at length 0: a square cap paints a dot
    draw: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.31, 1] },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.29, 0.3, 0.8, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="percent" style={pivot("50% 50%")}>
      <path data-part="slash" d="M19 5 5 19" />
      <g stroke={slot.accent}>
        <rect data-part="top" x="4" y="4" width="4" height="4" style={pivot("50% 50%")} />
        <rect data-part="bottom" x="16" y="16" width="4" height="4" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
