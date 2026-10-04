"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    school: "wave" | "open" | "bell"
  }
}

/** 2 colors: building (primary), flag and door (accent). */
export const School = createAnimatedIcon({
  name: "school",
  category: "education",
  keywords: ["building", "campus", "education", "academy", "classroom", "institution", "college"],
  slots: { primary: "building", accent: "flag + door" },
  defaultVariant: "wave",
  variants: {
    // a gust: the pole sways from the roof's peak and the flag ripples out from it
    wave: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=mast]", { rotate: [0, -8, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=flag]",
            { scaleX: [1, 0.7, 1.05, 0.85, 1], skewY: [0, 14, -10, 5, 0] },
            { duration: seconds, delay: seconds * 0.05, ease: "easeInOut" },
          ),
        ]),
    },
    // the double doors swing open outwards on their hinges, the doorway in shadow, and close again
    open: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=leaf]",
            { opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=doorway]",
            { opacity: [0, 0.35, 0.35, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
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
      <g fill={slot.primary} stroke="none">
        <rect x="6" y="15" width="2" height="2" />
        <rect x="16" y="15" width="2" height="2" />
      </g>
      {/* the pole rises from the roof's peak and sways from there, the flag with it */}
      <g data-part="mast" style={pivot("0% 100%")}>
        <path d="M12 8V2" />
        <path data-part="flag" d="M12 2h6l-1.5 2 1.5 2h-6z" fill={slot.accent} stroke="none" style={pivot("0% 50%")} />
      </g>
      {/* open, the doorway is in shadow and both leaves stand out from their hinges, clear of the windows */}
      <rect data-part="doorway" x="11" y="19" width="2" height="3" fill={slot.accent} stroke="none" style={flash()} />
      <g stroke={slot.accent}>
        <path data-part="leaf" d="M10 18l-3 2v2" style={flash("100% 50%")} />
        <path data-part="leaf" d="M14 18l3 2v2" style={flash("0% 50%")} />
      </g>
      <path data-part="door" d="M10 22v-4h4v4" stroke={slot.accent} />
    </g>
  ),
})
