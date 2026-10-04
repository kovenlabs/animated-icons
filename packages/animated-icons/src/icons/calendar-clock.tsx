"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "calendar-clock": "sweep" | "remind" | "pop"
  }
}

/** 3 colors: frame (primary), binder rings (secondary), clock (accent). */
export const CalendarClockIcon = createAnimatedIcon({
  name: "calendar-clock",
  family: "calendar",
  category: "time",
  keywords: ["schedule", "timetable", "appointment", "deadline", "event time", "agenda", "planning"],
  slots: { primary: "frame + days", secondary: "binder rings", accent: "clock" },
  defaultVariant: "sweep",
  variants: {
    // the minute hand sweeps one unhurried hour round the dial
    sweep: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=minute]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the binder rings hop one after the other, like a nudge
    remind: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ring]",
          { y: [0, -2, 0] },
          { duration: seconds * 0.75, delay: stagger(seconds * 0.25), ease: "easeInOut" },
        ),
    },
    // the clock pops out of the corner and settles
    pop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clock]",
          { scale: [1, 1.2, 0.95, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: ease.overshoot },
        ),
    },
  },
  render: () => (
    <>
      {/* the calendar's frame, left open at the bottom-right corner where the clock sits */}
      <path d="M10 22H3V4h18v6" />
      <path d="M3 10h18" />
      <g fill={slot.primary} stroke="none">
        <rect x="6" y="13" width="2" height="2" />
        <rect x="6" y="17" width="2" height="2" />
      </g>
      <g stroke={slot.secondary}>
        <path data-part="ring" d="M8 2v4" />
        <path data-part="ring" d="M16 2v4" />
      </g>
      <g data-part="clock" stroke={slot.accent} style={pivot("50% 50%")}>
        <circle cx="17" cy="17" r="4.5" />
        {/* the minute hand turns on its foot, the centre of the dial; the hour hand stays put */}
        <path data-part="minute" d="M17 17v-2.5" style={pivot("50% 100%")} />
        <path d="M17 17h2" />
      </g>
    </>
  ),
})
