"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    phone: "ring" | "lift" | "shake"
  }
}

/**
 * A faceted handset, symmetric about the anti-diagonal: earpiece top-left, mouthpiece bottom-right,
 * a stepped inner edge and a three-facet outer back.
 */
const HANDSET = "M3 3h5l2 5-2.5 2.5 6 6L16 14l5 2v5h-5l-7-3-3-3-3-7Z"

/** Two octagonal quarter-waves around (14, 10), 4 apart, in the corner the handset leaves open. */
const WAVES = ["M14 6h1.5l2.5 2.5V10", "M14 2h3.5l4.5 4.5V10"]

/** 2 colors: handset (primary), ring waves (accent). */
export const Phone = createAnimatedIcon({
  name: "phone",
  category: "communication",
  keywords: ["call", "telephone", "ring", "contact", "dial", "handset", "incoming call"],
  slots: { primary: "handset", accent: "ring waves" },
  defaultVariant: "ring",
  variants: {
    // the handset rattles in place while the waves pulse out from it, inner first
    ring: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handset]",
            { rotate: [0, -12, 10, -8, 6, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=wave]",
            { opacity: [1, 0.15, 1, 0.15, 1], scale: [1, 0.8, 1, 0.8, 1] },
            { duration: seconds * 0.85, delay: stagger(seconds * 0.12), ease: "easeInOut" },
          ),
        ]),
    },
    // picked up: the handset lifts and tips back, the ringing stops, then it settles back down
    lift: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handset]",
            { y: [0, -2.5, -2.5, 0], rotate: [0, -8, -8, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=wave]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.15, 0.8, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a quick buzz, like a phone on silent
    shake: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=handset]",
          { x: [0, -1, 1, -1, 1, 0], rotate: [0, -4, 4, -4, 4, 0] },
          { duration: seconds, ease: "linear" },
        ),
    },
  },
  render: () => (
    <>
      <path data-part="handset" d={HANDSET} style={pivot("50% 50%")} />
      <g stroke={slot.accent}>
        {WAVES.map((d) => (
          // each wave breathes from the centre the waves share, their bottom-left corner
          <path key={d} data-part="wave" d={d} style={pivot("0% 100%")} />
        ))}
      </g>
    </>
  ),
})
