"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    banknote: "wave" | "slide" | "stamp"
  }
}

/** 2 colors: note (primary), emblem and corner dots (accent). */
export const BanknoteIcon = createAnimatedIcon({
  name: "banknote",
  category: "finance",
  keywords: ["money", "cash", "bill", "payment", "currency", "note", "pay", "salary"],
  slots: { primary: "note", accent: "emblem + dots" },
  defaultVariant: "wave",
  variants: {
    // held by its left edge and waved: the free end flaps up and down and settles
    wave: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate("[data-part=note]", { skewY: [0, -8, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // handed over: slides out to the right, the next one slides in from the left
    slide: {
      clip: true,
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=note]",
          { x: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // the emblem is stamped back on: it vanishes and lands with an overshoot
    stamp: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=emblem]",
          { scale: [1, 0, 1.3, 1], rotate: [0, -90, 0, 0] },
          { duration: seconds, times: [0, 0.3, 0.7, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <g data-part="note" style={pivot("0% 50%")}>
      <rect x="2" y="6" width="20" height="12" />
      {/* a coin-like seal is round: a true circle, 2px clear of the dots */}
      <circle data-part="emblem" cx="12" cy="12" r="2" stroke={slot.accent} style={pivot("50% 50%")} />
      <g fill={slot.accent} stroke="none">
        <rect x="5" y="11" width="2" height="2" />
        <rect x="17" y="11" width="2" height="2" />
      </g>
    </g>
  ),
})
