"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cookie: "bite" | "dunk" | "flip"
  }
}

/**
 * A round cookie (centre 12 12, r 10) with a bite out of its top right: the bite is a circle of r 4.5
 * centred just outside the rim, cutting it at P1 (21.41, 8.61) and P2 (15.39, 2.59).
 */
const RIM = "M21.41 8.61A10 10 0 1 1 15.39 2.59"
/** The bitten edge, curving in towards the middle. */
const BITE = "M15.39 2.59A4.5 4.5 0 0 0 21.41 8.61"
/** The rim the bite took away: shown only while the cookie is whole. */
const CHUNK = "M15.39 2.59A10 10 0 0 1 21.41 8.61"

/** Chocolate chips, 2×2 squares at least 2 clear of the rim, the bite and each other. */
const CHIPS = [
  [7, 7],
  [12, 10],
  [6, 13],
  [11, 16],
  [16, 14],
] as const

/** Crumbs that fly out of the bite: where each starts, and where it ends up (out of the frame). */
const CRUMBS = [
  { x: 16, y: 5, to: { x: [0, 1, 2], y: [0, -4, -9] } },
  { x: 18, y: 7, to: { x: [0, 3, 7], y: [0, -3, -6] } },
  { x: 19, y: 9.5, to: { x: [0, 4, 8], y: [0, -1, 1] } },
]

const turnTimes = [0, 0.139, 0.14, 0.55, 0.551, 1]
const turnEase: Easing[] = ["linear", snap, "linear", snap, "linear"]

/** 2 colors: cookie (primary), chocolate chips (accent). */
export const Cookie = createAnimatedIcon({
  name: "cookie",
  category: "commerce",
  keywords: ["biscuit", "snack", "food", "dessert", "treat", "sweet", "consent", "tracking"],
  slots: { primary: "cookie + crumbs", accent: "chocolate chips" },
  defaultVariant: "bite",
  variants: {
    // turned edge-on, the cookie comes round whole; it leans in, and CHOMP: the bite is gone again, with
    // a jolt and a spray of crumbs
    bite: {
      duration: 1400,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cookie]",
            {
              scaleX: [1, 0.05, 1, 1, 1.06, 0.9, 1.04, 1],
              scaleY: [1, 1, 1, 1, 1.06, 0.92, 1.03, 1],
              rotate: [0, 0, 0, 0, -8, 6, -2, 0],
            },
            {
              duration: seconds,
              times: [0, 0.14, 0.28, 0.32, 0.5, 0.58, 0.72, 1],
              ease: [ease.in, ease.out, "linear", "easeInOut", ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate("[data-part=chunk]", { opacity: [0, 0, 1, 1, 0, 0] }, { duration: seconds, times: turnTimes, ease: turnEase }),
          animate("[data-part=bite]", { opacity: [1, 1, 0, 0, 1, 1] }, { duration: seconds, times: turnTimes, ease: turnEase }),
          ...CRUMBS.map(({ to }, i) =>
            animate(
              `[data-part=crumb]:nth-of-type(${i + 1})`,
              { ...to, opacity: [0, 1, 0], rotate: [0, 90, 200] },
              { duration: seconds * 0.4, delay: seconds * (0.55 + i * 0.03), ease: "easeOut" },
            ),
          ),
        ]),
    },
    // dunked: it sinks out of the bottom of the frame, comes back up, and shakes off the drips
    dunk: {
      duration: 1400,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cookie]",
            { y: [0, -1.5, 11, 11, 0, 0, 0], rotate: [0, 0, 0, 0, 0, -10, 0] },
            {
              duration: seconds,
              times: [0, 0.1, 0.32, 0.45, 0.65, 0.78, 1],
              ease: ["easeOut", ease.in, "linear", ease.out, "easeInOut", ease.overshoot],
            },
          ),
          animate(
            "[data-part=drip]",
            { y: [0, 0, 5], opacity: [0, 1, 0] },
            { duration: seconds * 0.35, delay: seconds * 0.63, ease: "easeIn" },
          ),
        ]),
    },
    // flipped like a coin, end over end: the underside is plain, so the chips vanish while it shows
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cookie]",
            { scaleY: [1, 0, -1, 0, 1, 0.9, 1], y: [0, -2, -3, -2, 0, 0, 0] },
            {
              duration: seconds,
              times: [0, 0.18, 0.36, 0.54, 0.72, 0.84, 1],
              ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=chips]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.179, 0.18, 0.539, 0.54, 1], ease: turnEase },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="cookie" style={pivot("50% 50%")}>
        <path d={RIM} />
        <path data-part="bite" d={BITE} />
        <path data-part="chunk" d={CHUNK} style={flash()} />
        <g data-part="chips" fill={slot.accent} stroke="none">
          {CHIPS.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" />
          ))}
        </g>
      </g>
      <g fill={slot.primary} stroke="none">
        {CRUMBS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} data-part="crumb" x={x} y={y} width="2" height="2" style={flash()} />
        ))}
        <rect data-part="drip" x="11" y="20" width="2" height="2" style={flash()} />
      </g>
    </>
  ),
})
