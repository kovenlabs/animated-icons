"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "satellite-dish": "transmit" | "scan" | "receive"
  }
}

/**
 * The bowl, faceted: its rim is the chord from (4, 10) to (14, 20), and its back bulges toward the
 * lower-left corner in four facets, mirror-symmetric about the dish's axis.
 */
const BOWL = "M4 10l-1 4 2.5 4.5 4.5 2.5 4-1z"

/** The feed arm, from the middle of the rim out along the axis, and the feed horn at its tip. */
const FEED = "M9 15l2-2"
const HORN = "M12 10.5l1.5 1.5-1.5 1.5-1.5-1.5z"

/**
 * The dish's box runs from the bowl's left (x 3) to the horn's right point (x 13.5), and from the
 * horn's top (y 10.5) to the bowl's bottom (y 21); the rim's middle, (9, 15), is the hinge it turns on.
 */
const HINGE = `${(((9 - 3) / 10.5) * 100).toFixed(3)}% ${(((15 - 10.5) / 10.5) * 100).toFixed(3)}%`

/** Two signal waves round (11, 13), true quarter arcs (a radio wave is round): radius 6, then 10. */
const WAVES = ["M11 7a6 6 0 0 1 6 6", "M11 3a10 10 0 0 1 10 10"]

/** 2 colors: dish (primary), feed horn and signal (accent). */
export const SatelliteDish = createAnimatedIcon({
  name: "satellite-dish",
  family: "satellite",
  category: "devices",
  keywords: ["antenna", "broadcast", "signal", "radar", "transmit", "receiver", "dish", "communication"],
  slots: { primary: "dish", accent: "feed horn + signal" },
  defaultVariant: "transmit",
  variants: {
    // it broadcasts: the dish recoils on its hinge as the horn fires, and the waves ripple out of the
    // horn one after the other, swelling past their places and settling back
    transmit: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dish]",
            { rotate: [0, 10, -4, 0] },
            { duration: seconds * 0.7, times: [0, 0.2, 0.6, 1], ease: ["easeOut", "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=horn]",
            { scale: [1, 1.7, 1] },
            { duration: seconds * 0.4, ease: "easeOut" },
          ),
          animate(
            "[data-part=wave]",
            { scale: [1, 0.3, 1.1, 1], opacity: [1, 0, 1, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.2, 0.7, 1],
              delay: stagger(seconds * 0.15),
              ease: [ease.in, ease.out, "easeInOut"],
            },
          ),
        ]),
    },
    // it sweeps the sky for a signal: the dish swings one way and the other on its hinge, and the waves
    // dim while it is off target and flash when it lines up
    scan: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dish]",
            { rotate: [0, -15, -15, 15, 15, 0] },
            { duration: seconds, times: [0, 0.2, 0.3, 0.6, 0.7, 0.9], ease: "easeInOut" },
          ),
          animate(
            "[data-part=wave]",
            { opacity: [1, 0.25, 0.25, 1, 0.25, 0.25, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.45, 0.55, 0.75, 0.9], ease: "easeInOut" },
          ),
          animate(
            "[data-part=horn]",
            { scale: [1, 1, 1.6, 1, 1, 1.6, 1] },
            { duration: seconds, times: [0, 0.4, 0.45, 0.5, 0.88, 0.93, 1], ease: "easeOut" },
          ),
        ]),
    },
    // it picks up a signal: the waves close in on the horn and vanish into it, the horn lights up and
    // the dish dips under the catch, and the next waves roll in from far off
    receive: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=wave]",
            { scale: [1, 0.65, 1.6, 1], opacity: [1, 0, 0, 1] },
            {
              duration: seconds * 0.85,
              times: [0, 0.35, 0.351, 1],
              delay: stagger(seconds * 0.1, { from: "last" }),
              ease: [ease.in, snap, ease.out],
            },
          ),
          animate(
            "[data-part=horn]",
            { scale: [1, 1, 1.8, 1] },
            { duration: seconds * 0.7, times: [0, 0.45, 0.6, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=dish]",
            { rotate: [0, 0, 8, -3, 0] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="dish" style={pivot(HINGE)}>
        <path d={BOWL} />
        <path d={FEED} />
        <path data-part="horn" d={HORN} fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
      {/* each wave's box has the waves' centre, (11, 13), at its bottom-left corner */}
      <g stroke={slot.accent}>
        {WAVES.map((d) => (
          <path key={d} data-part="wave" d={d} style={pivot("0% 100%")} />
        ))}
      </g>
    </>
  ),
})
