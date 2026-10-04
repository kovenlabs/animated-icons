"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    flag: "wave" | "hoist" | "plant"
  }
}

/** 2 colors: pole (primary), cloth (accent). */
export const FlagIcon = createAnimatedIcon({
  name: "flag",
  category: "social",
  keywords: ["report", "milestone", "goal", "finish", "mark", "country", "banner"],
  slots: { primary: "pole", accent: "cloth" },
  defaultVariant: "wave",
  variants: {
    // the cloth flaps on the pole, its free end lifting and dropping
    wave: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cloth]",
          { skewY: [0, -9, 7, -4, 0], scaleX: [1, 0.9, 0.96, 0.93, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // lowered to the foot of the pole, then run back up to the top
    hoist: {
      clip: false,
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cloth]",
          { y: [0, 6, 6, 0] },
          { duration: seconds, times: [0, 0.35, 0.5, 1], ease: "easeInOut" },
        ),
    },
    // pulled up, tipped back, and driven down into place
    plant: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=flag]",
          { y: [0, -3, 0.5, 0], rotate: [0, -8, 1.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ease.inOut },
        ),
    },
  },
  render: () => (
    <g data-part="flag" style={pivot("0% 100%")}>
      <path d="M5 3v18" />
      {/* a zigzag cloth, open on the pole side: the pole is its edge */}
      <path data-part="cloth" d="M5 5l4-2 5 2 5-2v10l-5 2-5-2-4 2" stroke={slot.accent} style={pivot("0% 50%")} />
    </g>
  ),
})
