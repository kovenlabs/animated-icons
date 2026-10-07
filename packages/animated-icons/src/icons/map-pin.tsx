"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "map-pin": "drop" | "ping" | "wobble"
  }
}

const fmt = (n: number) => Number(n.toFixed(2))

/** The head is round, so it is a true arc; two straight flanks leave it on its tangents to a sharp point. */
const HEAD = { cx: 12, cy: 9.5, r: 6.5 }
const TIP = 20
const SPREAD = Math.acos(HEAD.r / (TIP - HEAD.cy))
const TX = fmt(HEAD.r * Math.sin(SPREAD))
const TY = fmt(HEAD.cy + HEAD.r * Math.cos(SPREAD))
const PIN = `M12 ${TIP}L${fmt(12 - TX)} ${TY}A${HEAD.r} ${HEAD.r} 0 1 1 ${fmt(12 + TX)} ${TY}Z`

/** The ping: a wider arc over the head, ending 25° below its middle so it never reaches the flanks. */
const RING_R = 8.5
const DROP = (25 * Math.PI) / 180
const RX = fmt(RING_R * Math.cos(DROP))
const RY = fmt(HEAD.cy + RING_R * Math.sin(DROP))
const RING = `M${fmt(12 - RX)} ${RY}A${RING_R} ${RING_R} 0 1 1 ${fmt(12 + RX)} ${RY}`
/** Grows from the head's centre: its box runs from the arc's top to its ends. */
const RING_PIVOT = `50% ${fmt((RING_R / (RY - (HEAD.cy - RING_R))) * 100)}%`

/** 2 colors: pin (primary), dot and ping (accent). */
export const MapPin = createAnimatedIcon({
  name: "map-pin",
  family: "map",
  category: "navigation",
  keywords: ["location", "place", "marker", "address", "map", "gps", "destination"],
  slots: { primary: "pin", accent: "dot + ping" },
  defaultVariant: "drop",
  variants: {
    // lifts, drops onto its point with a squash, bounces once and settles
    drop: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pin]",
          { y: [0, -3, 0, -1, 0], scaleY: [1, 1.04, 0.9, 1.02, 1], scaleX: [1, 0.97, 1.06, 0.99, 1] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the dot pops and a ring pulses out over the head, fading as it grows
    ping: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=dot]", { scale: [1, 1.2, 1] }, { duration: seconds * 0.5, ease: ease.out }),
          animate(
            "[data-part=ring]",
            { opacity: [0, 1, 0], scale: [0.92, 1.02, 1.12] },
            { duration: seconds * 0.85, delay: seconds * 0.15, ease: "easeOut" },
          ),
        ]),
    },
    // rocks on its point and settles upright
    wobble: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=pin]", { rotate: [0, -10, 8, -5, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      <path data-part="ring" d={RING} stroke={slot.accent} style={flash(RING_PIVOT)} />
      <g data-part="pin" style={pivot("50% 100%")}>
        <path d={PIN} />
        <rect data-part="dot" x="10" y="7.5" width="4" height="4" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
