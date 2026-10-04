"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "calendar-check": "draw" | "pop" | "remind"
  }
}

/** 3 colors: frame (primary), binder rings (secondary), tick (accent). */
export const CalendarCheck = createAnimatedIcon({
  name: "calendar-check",
  family: "calendar",
  category: "time",
  keywords: ["scheduled", "confirmed", "attendance", "booked", "event done", "appointment", "present"],
  slots: { primary: "frame", secondary: "binder rings", accent: "tick" },
  defaultVariant: "draw",
  variants: {
    // the tick fades out and redraws from its short leg; hidden while the stroke is too short to read
    draw: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tick]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=tick]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.8, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the tick presses in hard and springs back past full size, like a stamp of approval
    pop: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=tick]",
          { scale: [1, 0.6, 1.15, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
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
      {/* a short 45° leg and a long one, centred in the page below the header */}
      <path data-part="tick" d="M8 16.5l2.5 2.5 5.5-5.5" stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
