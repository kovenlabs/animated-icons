"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"
import { dots } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    ellipsis: "wave" | "blink" | "spread"
  }
}

/** Three 2×2 dots across the middle, 7 apart: 3px clear of each other once stroked. */
const DOTS = dots(12, 12, 7)
const PARTS = ["dot-a", "dot-b", "dot-c"] as const

/** 1 color. */
export const Ellipsis = createAnimatedIcon({
  name: "ellipsis",
  category: "navigation",
  keywords: ["more", "options", "menu", "overflow", "dots", "actions", "meatballs", "horizontal dots"],
  slots: { primary: "dots" },
  defaultVariant: "wave",
  variants: {
    // each dot hops in turn, left to right, like a typing indicator
    wave: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          PARTS.map((part, i) =>
            animate(
              `[data-part=${part}]`,
              { y: [0, -2.5, 0] },
              { duration: seconds * 0.5, delay: seconds * 0.25 * i, ease: "easeInOut" },
            ),
          ),
        ),
    },
    // each dot dims and comes back in turn, left to right
    blink: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          PARTS.map((part, i) =>
            animate(
              `[data-part=${part}]`,
              { opacity: [1, 0.2, 1] },
              { duration: seconds * 0.5, delay: seconds * 0.25 * i, ease: "easeInOut" },
            ),
          ),
        ),
    },
    // the outer dots push away from the middle one and settle back
    spread: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dot-a]",
            { x: [0, -2, 0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=dot-c]",
            { x: [0, 2, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {DOTS.map(({ x, y }, i) => (
        <rect key={x} data-part={PARTS[i]} x={x} y={y} width="2" height="2" style={pivot("50% 50%")} />
      ))}
    </>
  ),
})
