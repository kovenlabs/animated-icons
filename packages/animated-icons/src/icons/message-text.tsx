"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"
import { bubble } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "message-text": "type" | "pop" | "wiggle"
  }
}

/** Two text lines, a long one over a short one, 2px clear of the bubble and of each other. */
const LINES = [
  { part: "line-1", d: "M7 8h10" },
  { part: "line-2", d: "M7 12h6" },
] as const

/**
 * Each line fades out with the other, then draws on left to right, one after the other.
 * Hidden while its stroke is too short to read: a square cap paints a dot at length 0.
 */
const typeLine = (start: number, end: number) => ({
  opacity: { values: [1, 0, 0, 1, 1], times: [0, 0.15, start, start + 0.01, 1] },
  pathLength: { values: [1, 1, 0, 1, 1], times: [0, start - 0.01, start, end, 1] },
})

/** 2 colors: bubble (primary), text lines (accent). */
export const MessageText = createAnimatedIcon({
  name: "message-text",
  family: "message",
  category: "communication",
  keywords: ["chat", "comment", "text", "note", "reply", "conversation", "sms"],
  slots: { primary: "bubble", accent: "text lines" },
  defaultVariant: "type",
  variants: {
    // the lines type in again, the short one after the long one
    type: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          LINES.map(({ part }, i) => {
            const { opacity, pathLength } = typeLine(0.25 + i * 0.35, 0.6 + i * 0.35)
            return Promise.all([
              animate(`[data-part=${part}]`, { opacity: opacity.values }, { duration: seconds, times: opacity.times }),
              animate(
                `[data-part=${part}]`,
                { pathLength: pathLength.values },
                { duration: seconds, times: pathLength.times, ease: "easeOut" },
              ),
            ])
          }),
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
    // pivots on the tail, bottom-left, like `message`
    <g data-part="message" style={pivot("15% 100%")}>
      <path d={bubble(3, 4, 18, 12)} />
      <g stroke={slot.accent}>
        {LINES.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} />
        ))}
      </g>
    </g>
  ),
})
