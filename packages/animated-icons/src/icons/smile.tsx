"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    smile: "wink" | "grin"
  }
}

/** 1 color: face, eyes and mouth (primary). */
export const SmileIcon = createAnimatedIcon({
  name: "smile",
  category: "social",
  keywords: ["happy", "emoji", "face", "emotion", "reaction", "feedback", "satisfied"],
  slots: { primary: "face + eyes + mouth" },
  defaultVariant: "wink",
  variants: {
    // the head tips and the right eye closes into a line, then opens again
    wink: {
      duration: 800,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.3, 0.65, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=face]", { rotate: [0, -8, -8, 0] }, timing),
          animate("[data-eye=right]", { scaleY: [1, 0.1, 0.1, 1] }, timing),
          animate("[data-part=lid]", { opacity: [0, 1, 1, 0] }, { ...timing, ease: "linear" as const }),
        ])
      },
    },
    // the smile widens into a grin and the eyes squint with it
    grin: {
      duration: 750,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=mouth]", { scale: [1, 1.25, 1.25, 1] }, timing),
          animate("[data-part=eye]", { scaleY: [1, 0.5, 0.5, 1], y: [0, -0.5, -0.5, 0] }, timing),
        ])
      },
    },
  },
  render: () => (
    <g data-part="face" style={pivot("50% 50%")}>
      {/* a face is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      <g fill={slot.primary} stroke="none">
        <rect data-part="eye" data-eye="left" x="8" y="7.5" width="2" height="3" style={pivot("50% 50%")} />
        <rect data-part="eye" data-eye="right" x="14" y="7.5" width="2" height="3" style={pivot("50% 50%")} />
      </g>
      {/* the closed eye of a wink, only there in motion */}
      <path data-part="lid" d="M14 9h2" style={flash()} />
      {/* a faceted smile: two raked sides and a flat lip */}
      <path data-part="mouth" d="M8 14l2 2.5h4l2-2.5" style={pivot("50% 0%")} />
    </g>
  ),
})
