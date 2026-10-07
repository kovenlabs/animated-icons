"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cherry: "dangle" | "swing" | "hop"
  }
}

/** Each stalk hangs 10.5 from the joint at (12, 4) to the top of its cherry. */
const STALK = 10.5

/**
 * A pendulum swinging towards you and away: the stalks foreshorten (scaleY), each cherry rides up the
 * stalk's shortened end and grows as it nears you, shrinks as it swings away.
 */
const reach = [1, 0.72, 1, 0.76, 1, 0.9, 1]
const DANGLE = {
  stalk: { scaleY: reach },
  cherry: { y: reach.map((s) => -STALK * (1 - s)), scale: [1, 1.25, 1, 0.8, 1, 1.1, 1] },
}

/** A hop: the cherry jumps 3 up its stalk, which shortens to keep hold of it, and lands with a squash. */
const HOP = {
  stalk: { scaleY: [1, (STALK - 3) / STALK, 1, 1] },
  cherry: { y: [0, -3, 0, 0], scaleY: [1, 1.08, 0.8, 1], scaleX: [1, 0.94, 1.18, 1] },
}

/** 2 colors: stalks and leaf (primary), cherries (accent). */
export const Cherry = createAnimatedIcon({
  name: "cherry",
  category: "nature",
  keywords: ["cherries", "fruit", "berry", "food", "sweet", "summer", "dessert"],
  slots: { primary: "stalks + leaf", accent: "cherries" },
  defaultVariant: "dangle",
  variants: {
    // the pair swings towards you and away on their stalks, growing as they come near and shrinking as
    // they swing back, while the leaf flutters behind
    dangle: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.18, 0.36, 0.54, 0.72, 0.86, 1],
          ease: ["easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeInOut"] as Easing[],
        }
        return Promise.all([
          animate("[data-part=stalk]", DANGLE.stalk, options),
          animate("[data-part=cherry]", DANGLE.cherry, options),
          animate(
            "[data-part=leaf]",
            { rotate: [0, -16, 10, -6, 0] },
            { duration: seconds * 0.8, delay: seconds * 0.12, ease: "easeInOut" },
          ),
        ])
      },
    },
    // swung from the joint like a pendulum; the leaf lags behind and settles last
    swing: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bunch]",
            { rotate: [0, 16, -12, 7, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=leaf]",
            { rotate: [0, -14, 14, -9, 4, 0] },
            { duration: seconds, delay: seconds * 0.08, ease: "easeInOut" },
          ),
        ]),
    },
    // one cherry hops, then the other, each landing with a squash
    hop: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const options = (delay: number) => ({
          duration: seconds * 0.55,
          delay,
          times: [0, 0.4, 0.75, 1],
          ease: ["easeOut", ease.in, "easeOut"] as Easing[],
        })
        return Promise.all([
          animate("[data-part=left] [data-part=stalk]", HOP.stalk, options(0)),
          animate("[data-part=left] [data-part=cherry]", HOP.cherry, options(0)),
          animate("[data-part=right] [data-part=stalk]", HOP.stalk, options(seconds * 0.45)),
          animate("[data-part=right] [data-part=cherry]", HOP.cherry, options(seconds * 0.45)),
        ])
      },
    },
  },
  render: () => (
    // the bunch's box runs 3.5..20.5 × 2..21.5, so the joint (12, 4) sits at 50% 10.3%
    <g data-part="bunch" style={pivot("50% 10.3%")}>
      {/* each stalk pivots on the joint; each cherry hangs from its top */}
      <g data-part="left">
        <path data-part="stalk" d="M12 4 7 14.5" style={pivot("100% 0%")} />
        <circle data-part="cherry" cx="7" cy="18" r="3.5" fill={slot.accent} stroke="none" style={pivot("50% 0%")} />
      </g>
      <g data-part="right">
        <path data-part="stalk" d="M12 4l5 10.5" style={pivot("0% 0%")} />
        <circle data-part="cherry" cx="17" cy="18" r="3.5" fill={slot.accent} stroke="none" style={pivot("50% 0%")} />
      </g>
      <path data-part="leaf" d="M12 4l3-2h5l-3 2.5Z" fill={slot.primary} stroke="none" style={pivot("0% 100%")} />
    </g>
  ),
})
