"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    reply: "send" | "through" | "draw"
  }
}

/** 1 color: an arrow that bends down from its tail and points back left. */
export const Reply = createAnimatedIcon({
  name: "reply",
  category: "communication",
  keywords: ["respond", "answer", "message", "email", "return", "back", "comment"],
  slots: { primary: "arrow" },
  defaultVariant: "send",
  variants: {
    // a quick push to the left that settles back, like sending the answer off
    send: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, -3, 0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // exits left, re-enters from the right
    through: {
      clip: true,
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { x: [0, -7, 7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // fades out, the line redraws from its tail to the head, then the head pops back on;
    // each is hidden while too short to read, so the square cap never leaves a stray dot
    draw: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=line]",
            { opacity: [1, 0, 0, 1, 1, 1], pathLength: [1, 1, 0, 0.1, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.2, 0.25, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { opacity: [1, 0, 0, 1, 1], x: [0, 0, 1.5, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.68, 0.82, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="arrow" style={pivot("50% 50%")}>
      {/* authored from the tail so it draws on toward the head */}
      <path data-part="line" d="M20 19v-3l-5-5H4.5" />
      {/* a right-angled chevron: its miter makes the point */}
      <path data-part="head" d="M9 6l-5 5 5 5" />
    </g>
  ),
})
