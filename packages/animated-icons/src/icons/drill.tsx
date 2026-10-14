"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    drill: "spin" | "bore" | "twirl"
  }
}

/**
 * The twist bit as a zigzag off the chuck. Mirroring it top to bottom over and over reads as the
 * flutes turning, the drill's spin faked in 2D.
 */
const BIT = "M17 6.5 18.5 5 20 8 21.5 6.5"

/** A full turn of the bit: four mirror flips about its axis. */
const FLUTES = { scaleY: [1, -1, 1, -1, 1, -1, 1, -1, 1] }

/** 2 colors: drill (primary), bit, chips and speed lines (accent). */
export const Drill = createAnimatedIcon({
  name: "drill",
  category: "tools",
  keywords: ["power drill", "tool", "diy", "construction", "screwdriver", "bore", "repair", "build"],
  slots: { primary: "drill", accent: "bit + chips" },
  defaultVariant: "spin",
  variants: {
    // trigger pulled: the bit whirls, the body kicks back and buzzes in the hand, speed lines flicker
    spin: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=bit]", FLUTES, { duration: seconds, ease: "linear" }),
          animate(
            "[data-part=drill]",
            { x: [0, -0.8, -0.4, -0.8, -0.4, -0.8, 0], rotate: [0, -4, -3, -4, -3, -4, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=whirl]",
            { opacity: [0, 1, 0, 1, 0], x: [0, 1, 0, 1, 0] },
            { duration: seconds * 0.8, delay: seconds * 0.1, ease: "linear" },
          ),
        ]),
    },
    // driven forward into the wall in two hard pushes, the bit spinning, chips spraying from the tip
    bore: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=bit]", FLUTES, { duration: seconds, ease: "linear" }),
          animate(
            "[data-part=drill]",
            { x: [0, 2, 1, 2, 0], scaleX: [1, 0.95, 1, 0.95, 1] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.75, 1], ease: ["easeOut", "easeInOut", "easeOut", ease.inOut] },
          ),
          animate(
            "[data-part=chip]",
            { opacity: [0, 1, 0], x: [1.5, 0, -1], y: [-5, 0, 2.5], rotate: [0, 90, 180] },
            { duration: seconds * 0.5, delay: stagger(seconds * 0.18, { startDelay: seconds * 0.25 }), ease: "easeOut" },
          ),
        ]),
    },
    // twirled round the finger like a gunslinger's pistol, drawn in so it stays in frame
    twirl: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=drill-body]", { rotate: [0, -360] }, { duration: seconds, ease: ease.inOut }),
          // shrunk before it swings off square and held small until it is square again, so no corner
          // ever reaches past the frame
          animate(
            "[data-part=drill-body]",
            { scale: [1, 0.7, 0.7, 1] },
            { duration: seconds, times: [0, 0.25, 0.75, 1], ease: "easeInOut" },
          ),
          animate("[data-part=bit]", FLUTES, { duration: seconds, ease: "linear" }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="whirl" d="M18.5 2.5h3" style={flash()} />
        <path data-part="whirl" d="M18.5 10.5h3" style={flash()} />
      </g>
      <g fill={slot.accent} stroke="none">
        <rect data-part="chip" x="18" y="11" width="2" height="2" style={flash()} />
        <rect data-part="chip" x="20" y="13.5" width="2" height="2" style={flash()} />
      </g>
      <g data-part="drill-body" style={pivot("50% 50%")}>
        {/* kicks back nose-up about the back of the housing, so nothing swings past the left edge */}
        <g data-part="drill" style={pivot("0% 0%")}>
          {/* motor housing, chuck, slanted grip and battery */}
          <path d="M2 3h12v7H2Z" />
          <path d="M14 4.5h3v4h-3" />
          <path d="M5 10 3.5 17M9.5 10 8 17" />
          <path d="M2 17h8v4H2Z" />
          <path data-part="bit" d={BIT} stroke={slot.accent} style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
