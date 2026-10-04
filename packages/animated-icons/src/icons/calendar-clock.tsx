"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "calendar-clock": "sweep" | "remind" | "pop"
  }
}

/** 3 colors: frame (primary), binder rings (secondary), clock (accent). */
export const CalendarClock = createAnimatedIcon({
  name: "calendar-clock",
  family: "calendar",
  category: "time",
  keywords: ["schedule", "timetable", "appointment", "deadline", "event time", "agenda", "planning"],
  slots: { primary: "frame + days", secondary: "binder rings", accent: "clock" },
  defaultVariant: "sweep",
  variants: {
    // the clock is wound: both hands sweep once round the dial, the hour hand trailing the minute hand
    sweep: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=minute]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=hour]",
            { rotate: [0, 360] },
            { duration: seconds * 0.9, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
    // a reminder nudge: the whole calendar rocks on its centre, like a desk alarm going off
    remind: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=calendar]", { rotate: [0, -6, 6, -4, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the clock ducks into its corner and pops back out, a little past full size
    pop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clock]",
          { scale: [1, 0.85, 1.1, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="calendar" style={pivot("50% 50%")}>
      {/* the calendar's frame, open round the bottom-right corner where the clock sits: the bottom edge, */}
      {/* the header and a stub of the right edge all stop 2px clear of the dial */}
      <path d="M8 22H3V4h18v5" />
      <path d="M3 10h7" />
      <g fill={slot.primary} stroke="none">
        <rect x="6" y="13" width="2" height="2" />
        <rect x="6" y="17" width="2" height="2" />
      </g>
      <g stroke={slot.secondary}>
        <path data-part="ring" d="M8 2v4" />
        <path data-part="ring" d="M16 2v4" />
      </g>
      {/* the dial's edge lines up with the frame's bottom and right edges; it pops from that corner */}
      <g data-part="clock" stroke={slot.accent} style={pivot("100% 100%")}>
        <circle cx="16" cy="17" r="5" />
        {/* both hands turn on their foot, the centre of the dial */}
        <path data-part="minute" d="M16 17v-2" style={pivot("50% 100%")} />
        <path data-part="hour" d="M16 17h1.5" style={pivot("0% 50%")} />
      </g>
    </g>
  ),
})
