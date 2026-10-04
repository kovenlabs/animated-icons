"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    home: "open" | "puff" | "bounce"
  }
}

const puff = { opacity: [0, 1, 0], scale: [0.6, 1.4, 1.8], x: [0, 2], y: [0, -4] }

/** 2 colors: house (primary), door and smoke (accent). */
export const Home = createAnimatedIcon({
  name: "home",
  category: "navigation",
  keywords: ["house", "start", "main", "dashboard", "homepage", "back home"],
  slots: { primary: "house", accent: "door + smoke" },
  defaultVariant: "open",
  variants: {
    // swings open on its left hinge, holds a beat, closes
    open: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=door]",
          { scaleX: [1, 0.3, 0.3, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
    // two squares of smoke drift up and away from the chimney
    puff: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=smoke]", puff, { duration: seconds * 0.75, delay: stagger(seconds * 0.25), ease: "easeOut" }),
    },
    // a small hop that lands with a squash
    bounce: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=house]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.03, 0.95, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        <rect data-part="smoke" x="16.5" y="1.5" width="2" height="2" style={flash()} />
        <rect data-part="smoke" x="16.5" y="1.5" width="2" height="2" style={flash()} />
      </g>
      <g data-part="house" style={pivot("50% 100%")}>
        {/* chimney: its foot follows the roof's slope */}
        <path d="M16 4h3v6l-3-3z" fill={slot.primary} stroke="none" />
        <path d="M3 12l9-9 9 9" />
        {/* the walls start inside the roof stroke so their square caps never poke through */}
        <path d="M5 11v10h14V11" />
        <rect data-part="door" x="10" y="14" width="4" height="6" fill={slot.accent} stroke="none" style={pivot("0% 50%")} />
      </g>
    </>
  ),
})
