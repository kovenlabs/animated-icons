"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "calendar-x": "strike" | "pop" | "shake"
  }
}

/** 3 colors: frame (primary), binder rings (secondary), cross (accent). */
export const CalendarX = createAnimatedIcon({
  name: "calendar-x",
  family: "calendar",
  category: "time",
  keywords: ["cancel event", "cancelled", "remove date", "delete event", "unavailable", "missed", "no meeting"],
  slots: { primary: "frame", secondary: "binder rings", accent: "cross" },
  defaultVariant: "strike",
  variants: {
    // the cross fades out and strikes the day again, one stroke after the other; each is hidden while too short to read
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
    // the cross presses in hard and springs back past full size, like a cancelled stamp
    pop: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cross]",
          { scale: [1, 0.6, 1.15, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
        ),
    },
    // the calendar gives a small, damped "no" shake on its centre
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=calendar]", { rotate: [0, -6, 5, -3, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
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
      {/* a 5px cross centred in the page below the header */}
      <g data-part="cross" stroke={slot.accent} style={pivot("50% 50%")}>
        <path data-part="cross-a" d="M9.5 13.5l5 5" />
        <path data-part="cross-b" d="M14.5 13.5l-5 5" />
      </g>
    </g>
  ),
})
