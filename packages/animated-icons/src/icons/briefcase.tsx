"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    briefcase: "lift" | "swing" | "latch"
  }
}

/** 2 colors: case, handle and seam (primary), clasp (accent). */
export const Briefcase = createAnimatedIcon({
  name: "briefcase",
  category: "commerce",
  keywords: ["job", "work", "career", "business", "portfolio", "office", "role"],
  slots: { primary: "case + handle + seam", accent: "clasp" },
  defaultVariant: "lift",
  variants: {
    // picked up by the handle: it rises, tips a little, and sets back down
    lift: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=case]",
          { y: [0, -2.5, -2.5, 0.5, 0], rotate: [0, -4, 3, 0, 0] },
          {
            duration: seconds,
            times: [0, 0.35, 0.6, 0.85, 1],
            ease: "easeInOut",
          },
        ),
    },
    // carried: it swings from the handle and settles
    swing: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate("[data-part=case]", { rotate: [0, 12, -9, 5, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the clasp snaps open and shut
    latch: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clasp]",
          { scale: [1, 1.35, 0.9, 1] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <g data-part="case" style={pivot("50% 0%")}>
      <path d="M8 7V4h8v3" />
      <path d="M2 7h20v13H2z" />
      <path d="M2 12h20" />
      {/* a solid accent over the seam: a stroked 4px square would leave a 0px hole */}
      <path d="M10 10h4v4h-4z" data-part="clasp" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </g>
  ),
})
