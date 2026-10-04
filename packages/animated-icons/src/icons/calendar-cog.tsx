"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "calendar-cog": "spin" | "tune" | "remind"
  }
}

/** Six short teeth around the hub, centred on (17, 17): straight segments only. */
const TEETH =
  "M17 13.5V12M20.03 15.25l1.3-.75M20.03 18.75l1.3.75M17 20.5V22M13.97 18.75l-1.3.75M13.97 15.25l-1.3-.75"

/** 3 colors: frame (primary), binder rings (secondary), cog (accent). */
export const CalendarCogIcon = createAnimatedIcon({
  name: "calendar-cog",
  family: "calendar",
  category: "time",
  keywords: ["schedule settings", "timetable", "configure", "planning", "calendar settings", "preferences", "setup"],
  slots: { primary: "frame + days", secondary: "binder rings", accent: "cog" },
  defaultVariant: "spin",
  variants: {
    // the cog makes one unhurried turn
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=cog]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // dialled back and forth like a knob being adjusted
    tune: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=cog]", { rotate: [0, -40, 20, -8, 0] }, { duration: seconds, ease: "easeInOut" }),
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
  },
  render: () => (
    <>
      {/* the calendar's frame, left open at the bottom-right corner where the cog sits */}
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
      {/* the hub is round, so it gets a true circle; the teeth are short spokes off it */}
      <g data-part="cog" stroke={slot.accent} style={pivot("50% 50%")}>
        <circle cx="17" cy="17" r="2.5" />
        <path d={TEETH} />
      </g>
    </>
  ),
})
