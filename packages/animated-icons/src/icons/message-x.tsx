"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { bubble } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "message-x": "fail" | "strike" | "pop"
  }
}

/** 2 colors: bubble (primary), cross (accent). */
export const MessageX = createAnimatedIcon({
  name: "message-x",
  family: "message",
  category: "communication",
  keywords: ["failed message", "not sent", "message error", "delete message", "chat error", "undelivered", "remove comment"],
  slots: { primary: "bubble", accent: "cross" },
  defaultVariant: "fail",
  variants: {
    // a refused send: the whole message shudders side to side and settles
    fail: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=message]",
          { x: [0, -1.5, 1.5, -1, 0.5, 0], rotate: [0, -3, 3, -2, 1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the cross fades out and strikes again, one stroke after the other; each is hidden while too short to read
    strike: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cross-a]",
            { opacity: [1, 0, 0, 1, 1], pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.2, 0.5, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=cross-b]",
            { opacity: [1, 0, 0, 1, 1], pathLength: [1, 1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.15, 0.2, 0.5, 0.85], ease: "easeOut" },
          ),
        ]),
    },
    // the cross turns in from a quarter turn and lands square
    pop: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cross]",
          { scale: [0, 1.15, 1], rotate: [-90, 0, 0] },
          { duration: seconds, ease: ease.overshoot },
        ),
    },
  },
  render: () => (
    // pivots on the tail, bottom-left, like `message`
    <g data-part="message" style={pivot("15% 100%")}>
      <path d={bubble(3, 4, 18, 12)} />
      {/* a 5px cross centred in the bubble body */}
      <g data-part="cross" stroke={slot.accent} style={pivot("50% 50%")}>
        <path data-part="cross-a" d="M9.5 7.5l5 5" />
        <path data-part="cross-b" d="M14.5 7.5l-5 5" />
      </g>
    </g>
  ),
})
