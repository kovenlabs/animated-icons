"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    calendar: "flip" | "select" | "remind"
  }
}

const DAYS = [
  [6, 13],
  [10, 13],
  [6, 17],
  [10, 17],
] as const

/** 3 colors: frame (primary), binder rings (secondary), highlighted day (accent). */
export const Calendar = createAnimatedIcon({
  name: "calendar",
  category: "time",
  keywords: ["date", "schedule", "event", "month", "planner", "agenda"],
  slots: { primary: "frame + days", secondary: "binder rings", accent: "highlighted day" },
  defaultVariant: "flip",
  variants: {
    // the page folds up into the header and a fresh one drops back down
    flip: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=page]",
          { scaleY: [1, 0, 1], opacity: [1, 0.3, 1] },
          { duration: seconds, times: [0, 0.45, 1], ease: "easeInOut" },
        ),
    },
    // the day presses in, turns through a diamond, and lands square
    select: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=day]",
          { scale: [1, 0.7, 1.15, 1], rotate: [0, 45, 0, 0] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: "easeOut" },
        ),
    },
    // a reminder nudge: the whole calendar rocks on its centre, like a desk alarm going off
    remind: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=calendar]", { rotate: [0, -6, 6, -4, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <g data-part="calendar" style={pivot("50% 50%")}>
      <rect x="3" y="4" width="18" height="18" />
      <path d="M3 10h18" />
      <g stroke={slot.secondary}>
        <path data-part="ring" d="M8 2v4" />
        <path data-part="ring" d="M16 2v4" />
      </g>
      <g data-part="page" style={pivot("50% 0%")}>
        <g fill={slot.primary} stroke="none">
          {DAYS.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" />
          ))}
        </g>
        <rect data-part="day" x="14" y="14" width="4" height="4" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
