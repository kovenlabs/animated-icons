"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    music: "bounce" | "float" | "pulse"
  }
}

/** 2 colors: stems and beam (primary), note heads (accent). */
export const MusicIcon = createAnimatedIcon({
  name: "music",
  category: "media",
  keywords: ["song", "audio", "note", "melody", "playlist", "sound", "tune"],
  slots: { primary: "stems + beam", accent: "note heads" },
  defaultVariant: "bounce",
  variants: {
    // two hops in time, the second one smaller
    bounce: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=music]",
          { y: [0, -3, 0, -1.5, 0], rotate: [0, -6, 0, 3, 0] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // drifts up out of the top and floats back in from below
    float: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=music]",
          { y: [0, -7, 7, 0], x: [0, 1, -1, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // the note heads swell one after the other, like two beats
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=head]",
          { scale: [1, 1.3, 1] },
          { duration: seconds * 0.6, delay: stagger(seconds * 0.4), ease: ease.out },
        ),
    },
  },
  render: () => (
    <g data-part="music" style={pivot("50% 100%")}>
      {/* two beamed eighth notes: stems on the right of filled heads */}
      <path d="M9 18V6l12-2v12" />
      <g fill={slot.accent} stroke="none">
        <circle data-part="head" cx="6" cy="18" r="3" style={pivot("50% 50%")} />
        <circle data-part="head" cx="18" cy="16" r="3" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
