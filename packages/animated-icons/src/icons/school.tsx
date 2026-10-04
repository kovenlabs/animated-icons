"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    school: "wave" | "open" | "bell"
  }
}

/** 2 colors: building (primary), flag and door (accent). */
export const SchoolIcon = createAnimatedIcon({
  name: "school",
  category: "navigation",
  keywords: ["building", "campus", "education", "academy", "classroom", "institution", "college"],
  slots: { primary: "building", accent: "flag + door" },
  defaultVariant: "wave",
  variants: {
    // the flag flutters on its pole
    wave: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=flag]",
          { scaleX: [1, 0.6, 1.05, 0.8, 1], rotate: [0, 8, -5, 3, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the door swings open on its hinge and closes again
    open: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=door]",
          { scaleX: [1, 0.25, 0.25, 1] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // the school bell rings: the whole building gives a short shiver and the flag jumps
    bell: {
      duration: 600,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=building]",
            { x: [0, -0.75, 0.75, -0.75, 0.75, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate(
            "[data-part=flag]",
            { scaleY: [1, 1.3, 0.9, 1], scaleX: [1, 0.85, 1.1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="building">
      {/* a schoolhouse: a low pitched roof over one block, leaving the flag room, set on the ground line */}
      <path d="M2 22h20" />
      <path d="M3 22v-9l9-5 9 5v9" />
      {/* the pole rises from the roof's peak */}
      <path d="M12 8V2" />
      <g fill={slot.primary} stroke="none">
        <rect x="6" y="15" width="2" height="2" />
        <rect x="16" y="15" width="2" height="2" />
      </g>
      <path data-part="flag" d="M12 2h6l-1.5 2 1.5 2h-6z" fill={slot.accent} stroke="none" style={pivot("0% 50%")} />
      <path data-part="door" d="M10 22v-4h4v4" stroke={slot.accent} style={pivot("0% 100%")} />
    </g>
  ),
})
