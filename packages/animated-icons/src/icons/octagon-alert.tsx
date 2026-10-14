"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "octagon-alert": "slam" | "shake" | "flash"
  }
}

/** 2 colors: octagon (primary), exclamation mark (accent). */
export const OctagonAlert = createAnimatedIcon({
  name: "octagon-alert",
  category: "status",
  keywords: ["stop", "error", "danger", "critical", "warning", "halt", "alert", "exclamation"],
  slots: { primary: "octagon", accent: "exclamation mark" },
  defaultVariant: "slam",
  variants: {
    // the sign is knocked back flat on its base, then springs upright with a wobble and the mark
    // punches out last
    slam: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=base]",
            { scaleY: [1, 0.3, 1.04, 0.95, 1], skewX: [0, -7, 4, -2, 0] },
            { duration: seconds * 0.8, times: [0, 0.3, 0.55, 0.75, 1], ease: ["easeOut", ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=mark]",
            { scale: [1, 1, 1, 1.3, 1] },
            { duration: seconds, times: [0, 0.4, 0.55, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
    // alarm: the octagon rocks hard on its centre while the mark jolts big
    shake: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sign]",
            { rotate: [0, -16, 13, -9, 5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=mark]",
            { scale: [1, 1.25, 1.25, 1], x: [0, 0.5, -0.5, 0] },
            { duration: seconds, times: [0, 0.15, 0.65, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a warning light: the mark blinks twice, stretching as it lights, and the sign throbs with it
    flash: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.45, 0.65, 0.9, 1]
        return Promise.all([
          animate(
            "[data-part=mark]",
            { opacity: [1, 0, 1, 0, 1, 1], scaleY: [1, 0.7, 1.2, 0.7, 1.2, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=sign]",
            { scale: [1, 0.94, 1.07, 0.94, 1.07, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="sign" style={pivot("50% 50%")}>
      <g data-part="base" style={pivot("50% 100%")}>
        {/* a near-regular octagon: 7px flats, 5.5px chamfers */}
        <path d="M8.5 3h7l5.5 5.5v7L15.5 21h-7L3 15.5v-7z" />
        <g data-part="mark" style={pivot("50% 50%")}>
          <path d="M12 7.5v5" stroke={slot.accent} />
          <rect x="11" y="15.5" width="2" height="2" fill={slot.accent} stroke="none" />
        </g>
      </g>
    </g>
  ),
})
