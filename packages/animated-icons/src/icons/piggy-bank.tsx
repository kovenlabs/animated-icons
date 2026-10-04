"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "piggy-bank": "drop" | "wiggle"
  }
}

/** 2 colors: pig (primary), coin (accent). */
export const PiggyBank = createAnimatedIcon({
  name: "piggy-bank",
  category: "finance",
  keywords: ["savings", "save", "money", "deposit", "budget", "bank", "coin", "piggy"],
  slots: { primary: "pig", accent: "coin" },
  defaultVariant: "drop",
  variants: {
    // the coin turns edge-on and sinks into the slot, fading before it passes the back; the pig dips
    // under it, and the next coin floats down to wait over the slot
    drop: {
      clip: false,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=coin]",
            { y: [0, 5, -3, 0, 0], scaleX: [1, 0.5, 1, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.31, 0.75, 1], ease: ["easeIn", "linear", "easeOut", "linear"] },
          ),
          animate(
            "[data-part=coin]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.22, 0.3, 0.33, 0.6, 1], ease: "linear" },
          ),
          animate(
            "[data-part=pig]",
            { y: [0, 0, 1, 0, 0] },
            { duration: seconds, times: [0, 0.26, 0.36, 0.55, 1], ease: ease.out },
          ),
        ]),
    },
    // a happy rock from trotter to trotter
    wiggle: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pig]",
          { rotate: [0, -7, 6, -4, 2, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the coin waits over the slot, 2px clear of the back */}
      <circle data-part="coin" cx="12" cy="5" r="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      <g data-part="pig" style={pivot("50% 100%")}>
        {/* an octagon body facing right; the back opens on a 4-wide slot over its middle */}
        <path d="M14 10h2l3 3v3l-3 3H8l-3-3v-3l3-3h2" />
        <path d="M19 13h2v3h-2" />
        <path d="M14 10l2-2.5 1.5 4" />
        <path d="M5 14H3v-2" />
        <path d="M8 19v3M16 19v3" />
        <rect x="14" y="13" width="2" height="2" fill={slot.primary} stroke="none" />
      </g>
    </>
  ),
})
