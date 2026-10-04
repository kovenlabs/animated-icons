"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    message: "typing" | "pop" | "wiggle"
  }
}

/** 2 colors: bubble (primary), dots (accent). "Typing" only reads as typing while it keeps going, so it loops in view. */
export const Message = createAnimatedIcon({
  name: "message",
  category: "communication",
  keywords: ["chat", "comment", "conversation", "typing", "reply", "support"],
  slots: { primary: "bubble", accent: "dots" },
  defaultVariant: "typing",
  defaults: { trigger: "inView", interval: 500 },
  variants: {
    typing: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=dot]",
          { y: [0, -2, 0] },
          { duration: seconds * 0.65, delay: stagger(seconds * 0.17), ease: "easeInOut" },
        ),
    },
    pop: {
      duration: 400,
      run: ({ animate, seconds }) =>
        animate("[data-part=message]", { scale: [1, 1.06, 1] }, { duration: seconds, ease: "easeOut" }),
    },
    wiggle: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=message]", { rotate: [0, -6, 4, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    // pivots on the tail, bottom-left
    <g data-part="message" style={pivot("15% 100%")}>
      {/* a square bubble with a raked, pointed tail */}
      <path d="M3 4h18v12h-9l-6 4v-4H3Z" />
      <g fill={slot.accent} stroke="none">
        {[7, 11, 15].map((x) => (
          <rect key={x} data-part="dot" x={x} y="9" width="2" height="2" style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
