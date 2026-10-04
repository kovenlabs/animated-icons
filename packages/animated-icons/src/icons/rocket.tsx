"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    rocket: "launch" | "float" | "boost"
  }
}

/** Smoke squares either side of the flame tip. */
const PUFFS = [7, 15] as const

const puff = { opacity: [0, 0.8, 0], scale: [0.5, 1, 1.3], y: [0, 2] }

/** 3 colors: hull (primary), fins and smoke (secondary), flame (accent). */
export const Rocket = createAnimatedIcon({
  name: "rocket",
  category: "actions",
  keywords: ["launch", "ship", "deploy", "startup", "boost", "fast"],
  slots: { primary: "hull + window", secondary: "fins + smoke", accent: "flame" },
  defaultVariant: "launch",
  variants: {
    // shoots out the top, comes back up from below
    launch: {
      clip: true,
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=rocket]",
            { y: [0, -7, 7, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.4, 0.6, 1], ease: "easeInOut" },
          ),
          animate("[data-part=flame]", { scaleY: [1, 1.3, 1] }, { duration: seconds * 0.4, ease: "easeOut" }),
          animate("[data-part=puff]", puff, { duration: seconds * 0.5, delay: stagger(seconds * 0.08) }),
        ]),
    },
    // hovers, the flame flickering
    float: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=rocket]", { y: [0, -1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=flame]",
            { scaleY: [1, 1.2, 0.9, 1.1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // revs in place: a light rumble, the flame flaring
    boost: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=rocket]",
            { x: [0, -0.5, 0.5, -0.5, 0.5, 0], y: [0, 0.5, -0.5, 0.5, -0.5, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate("[data-part=flame]", { scaleY: [1, 1.35, 1.1, 1.3, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=puff]", puff, { duration: seconds * 0.6, delay: stagger(seconds * 0.15) }),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.secondary} stroke="none">
        {PUFFS.map((x) => (
          <rect key={x} data-part="puff" x={x} y="20" width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="rocket" style={pivot("50% 50%")}>
        {/* a faceted flame: square shoulders tapering to a point */}
        <path
          data-part="flame"
          d="M9 17h6l-1.5 3-1.5 2-1.5-2Z"
          fill={slot.accent}
          stroke="none"
          style={pivot("50% 0%")}
        />
        {/* a pentagon hull with a right-angled nose and a diamond window */}
        <path d="M12 3.5l4 4V16H8V7.5Z" />
        <path d="M12 9l1.5 1.5L12 12l-1.5-1.5Z" fill={slot.primary} stroke="none" />
        <g stroke={slot.secondary}>
          <path d="M8 11.5l-3 3V19l3-3" />
          <path d="M16 11.5l3 3V19l-3-3" />
        </g>
      </g>
    </>
  ),
})
