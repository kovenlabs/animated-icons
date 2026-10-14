"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    shovel: "dig" | "toss" | "turn"
  }
}

/**
 * A pointed spade on the diagonal: square shoulders across the socket at (10, 14), straight sides,
 * and a point at (3, 21), the bottom-left corner of the shovel's box.
 */
const BLADE = "M7.5 11.5 12.5 16.5 8.5 20.5 3 21 3.5 15.5Z"

/** Clods of dirt flung up off the blade, resting clear of it. */
const CLODS = [
  { x: 3, y: 9 },
  { x: 7, y: 7 },
  { x: 2, y: 4.5 },
]

/** 2 colors: handle and grip (primary), blade and dirt (accent). */
export const Shovel = createAnimatedIcon({
  name: "shovel",
  category: "development",
  keywords: ["spade", "dig", "garden", "construction", "tool", "dirt", "excavate", "gardening"],
  slots: { primary: "handle + grip", accent: "blade + dirt" },
  defaultVariant: "dig",
  variants: {
    // driven into the ground, levered back on its point and flicked, flinging clods of dirt up
    dig: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=shovel]",
            { x: [0, -2, -2, 0, 0], y: [0, 2, 2, 0, 0], rotate: [0, 0, 12, -8, 0] },
            {
              duration: seconds,
              times: [0, 0.2, 0.45, 0.62, 1],
              ease: [ease.in, "easeInOut", ease.in, ease.overshoot],
            },
          ),
          animate(
            "[data-part=clod]",
            { opacity: [0, 1, 1, 0], x: [2, 0, -0.5, -1], y: [5, 0, -2, -3], rotate: [0, 90, 150, 180] },
            { duration: seconds * 0.45, delay: stagger(seconds * 0.04, { startDelay: seconds * 0.52 }), ease: "easeOut" },
          ),
        ]),
    },
    // tossed up end over end, sailing away and back, and caught with a squash
    toss: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=shovel-body]",
          { y: [0, -4, 0, 0], rotate: [0, 180, 360, 360], scale: [1, 0.7, 1.06, 1] },
          { duration: seconds, times: [0, 0.45, 0.8, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
        ),
    },
    // spun twice round on its own upright axis with a hop, the blade swinging side to side
    turn: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=shovel-body]",
          { scaleX: [1, -1, 1, -1, 1], y: [0, -2.5, -3, -2.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {CLODS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} data-part="clod" x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="shovel-body" style={pivot("50% 50%")}>
        {/* levers on its point, the box's bottom-left corner */}
        <g data-part="shovel" style={pivot("0% 100%")}>
          <path d="M10 14 18 6" />
          <path d="M16 4l4 4" />
          <path d={BLADE} stroke={slot.accent} />
        </g>
      </g>
    </>
  ),
})
