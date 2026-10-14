"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bath: "bubble" | "fill" | "rock"
  }
}

/** Three bubbles floating above the rim, listed in the order they rise. */
const BUBBLES = [
  { x: 14, y: 6 },
  { x: 11, y: 8 },
  { x: 17, y: 7 },
]

/** 2 colors: tub and tap (primary), water, drip and bubbles (accent). */
export const Bath = createAnimatedIcon({
  name: "bath",
  category: "home",
  keywords: ["bathtub", "bathroom", "tub", "soak", "spa", "relax", "hotel", "amenities"],
  slots: { primary: "tub + tap", accent: "water + bubbles" },
  defaultVariant: "bubble",
  variants: {
    // bubbles swell out of the tub and drift up toward you, growing and fading, while the water bobs
    bubble: {
      clip: false,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bubble]",
            { opacity: [0, 1, 1, 0], y: [0, -1.5, -3.5, -5], scale: [0.3, 1, 1.3, 1.6] },
            { duration: seconds * 0.7, times: [0, 0.25, 0.7, 1], delay: stagger(seconds * 0.14), ease: "easeOut" },
          ),
          animate(
            "[data-part=water]",
            { y: [0, -0.8, 0.6, -0.4, 0], scaleX: [1, 0.92, 1.08, 0.96, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // the tap drips three times, each drop stretching as it falls, and the water swells up to meet them
    fill: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=drip]",
            { opacity: [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0], y: [0, 0, 0.3, 0.3, 0, 0, 0.3, 0.3, 0, 0, 0.3, 0.3], scaleY: [0.4, 1, 1.3, 1.3, 0.4, 1, 1.3, 1.3, 0.4, 1, 1.3, 1.3] },
            { duration: seconds * 0.8, ease: "easeIn" },
          ),
          animate(
            "[data-part=water]",
            { y: [0, -0.25, -0.4, -0.5, 0.3, 0], scaleX: [1, 1.04, 1.08, 1.12, 0.96, 1] },
            { duration: seconds, times: [0, 0.27, 0.54, 0.8, 0.9, 1], ease: "easeOut" },
          ),
          animate("[data-part=tap]", { scaleY: [1, 0.9, 1] }, { duration: seconds * 0.3, ease: "easeOut" }),
        ]),
    },
    // the tub rocks on its feet and the water sloshes the other way, tilting against the swing
    rock: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tub]",
            { rotate: [0, -9, 7, -4, 2, 0], y: [0, -1, -0.5, -0.5, 0, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=water]",
            { rotate: [0, 10, -9, 5, -2, 0], x: [0, 0.8, -0.8, 0.5, -0.2, 0], scaleX: [1, 0.85, 0.85, 0.92, 0.98, 1] },
            { duration: seconds, delay: seconds * 0.05, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {BUBBLES.map(({ x, y }) => (
          <rect key={x} data-part="bubble" x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="tub" style={pivot("50% 100%")}>
        {/* a pipe rising from the rim, bent over into a spout */}
        <path data-part="tap" d="M5 12V4h4v2" style={pivot("50% 100%")} />
        <rect data-part="drip" x="8" y="8" width="2" height="2" fill={slot.accent} stroke="none" style={flash("50% 0%")} />
        {/* the rim, a basin chamfered into the base, two feet */}
        <path d="M2 12h20" />
        <path d="M4 12v4l2 3h12l2-3v-4" />
        <path d="M7 19v2M17 19v2" />
        <path data-part="water" d="M7 15h10" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
