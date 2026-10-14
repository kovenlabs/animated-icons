"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    move: "drag" | "gather" | "turn"
  }
}

/** Each arm's inward direction, clockwise from the top. */
const ARMS = [
  { part: "arm-n", x: 0, y: 1 },
  { part: "arm-e", x: -1, y: 0 },
  { part: "arm-s", x: 0, y: -1 },
  { part: "arm-w", x: 1, y: 0 },
] as const

/** 2 colors: four arrows (primary), centre hub (accent). */
export const Move = createAnimatedIcon({
  name: "move",
  category: "arrows",
  keywords: ["drag", "reposition", "pan", "arrows", "four way", "relocate", "handle", "grab"],
  slots: { primary: "four arrows", accent: "hub" },
  defaultVariant: "drag",
  variants: {
    // picked up (it sinks back in depth), dragged left then right with a lean, and set down
    drag: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=move]",
          {
            scale: [1, 0.8, 0.8, 0.8, 0.8, 1],
            x: [0, 0, -2, 2, 0, 0],
            y: [0, 0, -1.5, 1.5, 0, 0],
            skewX: [0, 0, 8, -8, 0, 0],
          },
          { duration: seconds, times: [0, 0.18, 0.4, 0.65, 0.82, 1], ease: "easeInOut" },
        ),
    },
    // the arms draw in one after another round the clock while the hub sucks in, then all spring back
    // out as the hub pops
    gather: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...ARMS.map(({ part, x, y }, i) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, x * 2, 0], y: [0, y * 2, 0] },
              {
                duration: seconds * 0.8,
                delay: seconds * 0.06 * i,
                times: [0, 0.45, 1],
                ease: ["easeIn", ease.overshoot],
              },
            ),
          ),
          animate(
            "[data-part=hub]",
            { scale: [1, 0.3, 0.3, 1.5, 1] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // a quarter turn that lands while it dips back and comes forward. The cross looks the same a
    // quarter turn back, so it starts there and comes to rest at 0 without a visible jump
    turn: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=move]", { rotate: [-90, 0] }, { duration: seconds, ease: ease.overshoot }),
          animate("[data-part=move]", { scale: [1, 0.7, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="move" style={pivot("50% 50%")}>
      {/* each arm is a right-angled head and a shaft stopping short of its point and 2px short of the hub */}
      <g data-part="arm-n">
        <path d="M12 3v4" />
        <path d="M9 5l3-3 3 3" />
      </g>
      <g data-part="arm-e">
        <path d="M21 12h-4" />
        <path d="M19 9l3 3-3 3" />
      </g>
      <g data-part="arm-s">
        <path d="M12 21v-4" />
        <path d="M9 19l3 3 3-3" />
      </g>
      <g data-part="arm-w">
        <path d="M3 12h4" />
        <path d="M5 9l-3 3 3 3" />
      </g>
      <rect data-part="hub" x="10" y="10" width="4" height="4" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </g>
  ),
})
