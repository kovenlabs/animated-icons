"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    shrink: "squeeze" | "crush" | "twist"
  }
}

/** The four arrows, clockwise from top-left: each one's inward direction. */
const ARROWS = [
  { part: "nw", x: 1, y: 1, head: "M9 4v5H4", shaft: "M3 3l5 5" },
  { part: "ne", x: -1, y: 1, head: "M15 4v5h5", shaft: "M21 3l-5 5" },
  { part: "se", x: -1, y: -1, head: "M15 20v-5h5", shaft: "M21 21l-5-5" },
  { part: "sw", x: 1, y: -1, head: "M9 20v-5H4", shaft: "M3 21l5-5" },
] as const

/** 1 color: four diagonal arrows pointing in from the corners. */
export const Shrink = createAnimatedIcon({
  name: "shrink",
  category: "layout",
  keywords: ["collapse", "minimize", "reduce", "exit fullscreen", "compress", "scale down", "contract"],
  slots: { primary: "corner arrows" },
  defaultVariant: "squeeze",
  variants: {
    // the arrows draw back to their corners, then punch in toward the middle and settle
    squeeze: {
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all(
          ARROWS.map(({ part, x, y }) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, -x, x * 1.5, 0], y: [0, -y, y * 1.5, 0] },
              { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeOut", ease.in, ease.overshoot] },
            ),
          ),
        ),
    },
    // crushed from the sides, the frame squashes thin and tall, then rebounds wide and settles
    crush: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrows]",
          { scaleX: [1, 0.55, 1.06, 1], scaleY: [1, 1.06, 0.9, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // wrung a quarter turn as it sinks back into the distance, then springs forward. The arrows look the
    // same a quarter turn back, so it starts there and comes to rest at 0 without a visible jump
    twist: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=arrows]", { rotate: [-90, 0] }, { duration: seconds, ease: ease.overshoot }),
          animate("[data-part=arrows]", { scale: [1, 0.65, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="arrows" style={pivot("50% 50%")}>
      {/* each arrow moves as one piece: a right-angled head near the middle, its shaft running in from the corner */}
      {ARROWS.map(({ part, head, shaft }) => (
        <g key={part} data-part={part}>
          <path d={head} />
          <path d={shaft} />
        </g>
      ))}
    </g>
  ),
})
