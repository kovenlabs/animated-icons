"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "calendar-cog": "spin" | "tune" | "remind"
  }
}

/**
 * Six stubby teeth on the rim, centred on (16, 17): each runs from the ring's outer edge (r 4) to r 5, so with
 * its cap it stands 2px proud of the ring, and neighbours stay over 2px apart.
 */
const TEETH = "M16 13v-1M19.46 15l.87-.5M19.46 19l.87.5M16 21v1M12.54 19l-.87.5M12.54 15l-.87-.5"

/** 3 colors: frame (primary), binder rings (secondary), cog (accent). */
export const CalendarCog = createAnimatedIcon({
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
    // a reminder nudge: the whole calendar rocks on its centre, like a desk alarm going off
    remind: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=calendar]", { rotate: [0, -6, 6, -4, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <g data-part="calendar" style={pivot("50% 50%")}>
      {/* calendar-clock's frame: open round the bottom-right corner, every edge stopping 2px clear of the cog */}
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
      {/* the cog's body is round, so it gets a true circle, wide enough to keep a clear hub hole */}
      <g data-part="cog" stroke={slot.accent} style={pivot("50% 50%")}>
        <circle cx="16" cy="17" r="3" />
        <path d={TEETH} />
      </g>
    </g>
  ),
})
