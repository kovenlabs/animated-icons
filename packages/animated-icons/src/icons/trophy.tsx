"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    trophy: "shine" | "bounce" | "cheer"
  }
}

/** A small five-pointed star on the cup. */
const STAR = "M12 5.3 12.8 7.2 14.9 7.4 13.2 8.7 13.8 10.7 12 9.6 10.2 10.7 10.8 8.7 9.2 7.4 11.2 7.2Z"

/** Diamonds either side of the stem that only exist in motion. */
const SPARKLES = ["M3.5 12 5 13.5 3.5 15 2 13.5Z", "M20.5 12 22 13.5 20.5 15 19 13.5Z"]

/** 2 colors: cup, handles and base (primary), star and sparkles (accent). */
export const Trophy = createAnimatedIcon({
  name: "trophy",
  category: "social",
  keywords: ["award", "winner", "prize", "champion", "achievement", "cup", "victory"],
  slots: { primary: "cup + handles + base", accent: "star + sparkles" },
  defaultVariant: "shine",
  variants: {
    // the star swells and settles while a sparkle winks either side
    shine: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=star]",
            { scale: [1, 1.3, 1], rotate: [0, -12, 0] },
            { duration: seconds * 0.7, ease: ease.out },
          ),
          animate("[data-part=sparkle]", blink, {
            duration: seconds * 0.6,
            delay: stagger(seconds * 0.15, { startDelay: seconds * 0.15 }),
            ease: "easeOut",
          }),
        ]),
    },
    // a hop that lands with a squash
    bounce: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=trophy]",
          { y: [0, -3, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
    // held up and rocked side to side in celebration
    cheer: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=trophy]",
          { y: [0, -1.5, -1.5, 0], rotate: [0, -10, 8, 0] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {SPARKLES.map((d) => (
          <path key={d} data-part="sparkle" d={d} style={flash()} />
        ))}
      </g>
      <g data-part="trophy" style={pivot("50% 100%")}>
        {/* a cup with straight flanks tapering to the stem, square handles, a flared foot */}
        <path d="M7 3h10v7l-3 4h-4l-3-4Z" />
        <path d="M7 5H3v3l4 2" />
        <path d="M17 5h4v3l-4 2" />
        <path d="M12 14v3" />
        <path d="M8.5 17h7l1.5 4H7Z" />
        <path data-part="star" d={STAR} fill={slot.accent} stroke="none" style={pivot("50% 55%")} />
      </g>
    </>
  ),
})
