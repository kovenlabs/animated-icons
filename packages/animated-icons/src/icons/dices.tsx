"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    dices: "roll" | "shake" | "pips"
  }
}

/**
 * Two dice: an upright one in front (2..13 × 11..22) and a diamond-turned one behind it, centred on
 * (16, 8). The back die is cut where it would pass behind the front one, its two ends stopping 2px clear
 * of it. Each shows a single pip in its middle, so a quarter turn maps the front die onto itself.
 */
const FRONT = "M2 11h11v11H2z"
const BACK = "M11 7l5-5 6 6-5 5"
const FRONT_PIP = "M6 15h3v3H6z"
const BACK_PIP = "M16 6.5l1.5 1.5-1.5 1.5-1.5-1.5z"

/** 2 colors: dice (primary), pips (accent). */
export const Dices = createAnimatedIcon({
  name: "dices",
  family: "dice",
  category: "gaming",
  keywords: ["dice", "random", "shuffle", "randomize", "roll", "chance", "game", "luck"],
  slots: { primary: "dice", accent: "pips" },
  defaultVariant: "roll",
  variants: {
    // the front die hops and tumbles a quarter turn, landing with a squash; the turn ends in its own pose
    // and snaps back unseen
    roll: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=front]",
            { y: [0, 0, -1.5, 0, 0, 0], scaleY: [1, 0.9, 1.04, 1, 0.9, 1], scaleX: [1, 1.06, 0.97, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.72, 0.82, 1], ease: ["easeOut", "easeOut", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=front-turn]",
            { rotate: [0, 0, 90, 90, 0] },
            { duration: seconds, times: [0, 0.15, 0.72, 0.999, 1], ease: ["linear", "easeInOut", "linear", snap] },
          ),
        ]),
    },
    // rattled in a cup: both dice rock against each other, then settle
    shake: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=front]",
            { rotate: [0, -8, 7, -5, 2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=back]",
            { rotate: [0, 7, -8, 5, -2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // the pips press in and pop back, one die after the other
    pips: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pip]",
          { scale: [1, 0.4, 1.25, 1] },
          { duration: seconds * 0.75, delay: stagger(seconds * 0.25), times: [0, 0.3, 0.65, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="back" style={pivot("50% 50%")}>
        <path d={BACK} />
        <path data-part="pip" d={BACK_PIP} fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
      <g data-part="front" style={pivot("50% 100%")}>
        <g data-part="front-turn" style={pivot("50% 50%")}>
          <path d={FRONT} />
          <path data-part="pip" d={FRONT_PIP} fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
