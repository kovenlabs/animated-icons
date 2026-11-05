"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "calendar-days": "ripple" | "flip" | "remind"
  }
}

/** Two weeks of three days, 2×2 each, 3 apart, centred in the page below the header, in reading order. */
const DAYS = [
  [6, 13],
  [11, 13],
  [16, 13],
  [6, 17],
  [11, 17],
  [16, 17],
] as const

/** 3 colors: frame (primary), binder rings (secondary), days (accent). */
export const CalendarDays = createAnimatedIcon({
  name: "calendar-days",
  family: "calendar",
  category: "time",
  keywords: ["date", "month view", "schedule", "days", "date picker", "agenda", "planner"],
  slots: { primary: "frame", secondary: "binder rings", accent: "days" },
  defaultVariant: "ripple",
  variants: {
    // a wave runs through the days in reading order: each dips and pops back
    ripple: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=day]",
          { scale: [1, 0.4, 1.25, 1] },
          { duration: seconds * 0.5, delay: stagger(seconds * 0.1), times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
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
      <g data-part="page" fill={slot.accent} stroke="none" style={pivot("50% 0%")}>
        {DAYS.map(([x, y]) => (
          <rect key={`${x}-${y}`} data-part="day" x={x} y={y} width="2" height="2" style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
