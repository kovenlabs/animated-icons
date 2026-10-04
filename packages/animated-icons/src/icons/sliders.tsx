"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sliders: "tune" | "slide" | "pop"
  }
}

/** 2 colors: tracks (primary), knobs (accent). */
export const Sliders = createAnimatedIcon({
  name: "sliders",
  category: "actions",
  keywords: ["settings", "adjust", "controls", "preferences", "equalizer", "filters", "options", "tune"],
  slots: { primary: "tracks", accent: "knobs" },
  defaultVariant: "tune",
  variants: {
    // each knob is nudged along its track, away from its neighbours, and comes back
    tune: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=top]", { x: [0, 3, -1, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=middle]", { x: [0, -3, 0.5, 0] }, { duration: seconds, delay: seconds * 0.08, ease: "easeInOut" }),
          animate("[data-part=bottom]", { x: [0, 4, 0] }, { duration: seconds * 0.84, delay: seconds * 0.16, ease: "easeInOut" }),
        ]),
    },
    // the middle knob slides the length of its track and back
    slide: {
      clip: false,
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=middle]", { x: [0, 9, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the knobs pop one after the other, like being tapped
    pop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=knob]",
          { scale: [1, 1.2, 1] },
          { duration: seconds * 0.6, delay: stagger(seconds * 0.2), ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <>
      <path d="M3 5h18M3 12h18M3 19h18" />
      {/* solid knobs stand 2px proud of their tracks on both sides and cover them wherever they slide */}
      <g fill={slot.accent} stroke="none">
        <g data-part="top">
          <rect data-part="knob" x="14" y="2" width="4" height="6" style={pivot("50% 50%")} />
        </g>
        <g data-part="middle">
          <rect data-part="knob" x="6" y="9" width="4" height="6" style={pivot("50% 50%")} />
        </g>
        <g data-part="bottom">
          <rect data-part="knob" x="12" y="16" width="4" height="6" style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
