"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "calendar-range": "span" | "flip" | "remind"
  }
}

/** 3 colors: frame + end days (primary), binder rings (secondary), range (accent). */
export const CalendarRange = createAnimatedIcon({
  name: "calendar-range",
  family: "calendar",
  category: "time",
  keywords: ["date range", "period", "term", "semester", "duration", "from to", "span"],
  slots: { primary: "frame + end days", secondary: "binder rings", accent: "range" },
  defaultVariant: "span",
  variants: {
    // each week's range collapses onto its first day and stretches out again, one after the other
    span: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=range]",
          { scaleX: [1, 0, 1] },
          { duration: seconds * 0.75, delay: stagger(seconds * 0.25), times: [0, 0.35, 1], ease: "easeInOut" },
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
      <g data-part="page" style={pivot("50% 0%")}>
        {/* the first day, then its range; the range wraps to the next week and ends on the last day */}
        <g fill={slot.primary} stroke="none">
          <rect x="6" y="13" width="2" height="2" />
          <rect x="15" y="17" width="2" height="2" />
        </g>
        <g stroke={slot.accent}>
          <path data-part="range" d="M11 14h6" style={pivot("0% 50%")} />
          <path data-part="range" d="M7 18h5" style={pivot("0% 50%")} />
        </g>
      </g>
    </g>
  ),
})
