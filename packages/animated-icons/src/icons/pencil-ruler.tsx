"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "pencil-ruler": "flip" | "tally" | "shuffle"
  }
}

/** Tick marks along the ruler's inner edge, one every 4px, each 2px clear of its neighbours and the frame. */
const TICKS = [6, 10, 14, 18] as const

/** 2 colors: ruler and pencil body (primary), pencil tip (accent). */
export const PencilRuler = createAnimatedIcon({
  name: "pencil-ruler",
  family: "pencil",
  category: "design",
  keywords: ["design", "drafting", "measure", "draw", "sketch", "architect", "stationery", "tools"],
  slots: { primary: "ruler + pencil body", accent: "pencil tip" },
  defaultVariant: "flip",
  variants: {
    // the pencil is tossed end over end beside the ruler: it turns tip-up and back, then lands squashed
    flip: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=pencil]", { scaleY: [1, -1, 1] }, { duration: seconds * 0.7, ease: "easeInOut" }),
          animate(
            "[data-part=pencil]",
            { scaleX: [1, 0.85, 1, 1.12, 1], y: [0, -1, 0, 0.5, 0] },
            { duration: seconds, times: [0, 0.35, 0.7, 0.82, 1], ease: ["easeOut", "easeIn", "easeOut", ease.overshoot] },
          ),
        ]),
    },
    // the pencil taps out a count and the ruler's ticks stretch one after another down its length
    tally: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tick]",
            { scaleX: [1, 1.4, 1] },
            { duration: seconds * 0.35, delay: stagger(seconds * 0.18, { startDelay: seconds * 0.05 }), ease: "easeInOut" },
          ),
          animate(
            "[data-part=pencil]",
            { y: [0, -1.5, 1, -1.5, 1, 0], rotate: [0, -4, 0, -4, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the two swap depth: the pencil comes forward as the ruler sinks back, then the pencil drops behind
    shuffle: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pencil]",
            { scale: [1, 1.12, 0.88, 1], x: [0, 0.5, 0, 0], opacity: [1, 1, 0.5, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ruler]",
            { scale: [1, 0.9, 1, 1], x: [0, -1, 0, 0], opacity: [1, 0.5, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="ruler" style={pivot("50% 50%")}>
        {/* a tall ruler standing on the left */}
        <path d="M4 2h6v20H4Z" />
        {TICKS.map((y) => (
          <path key={y} data-part="tick" d={`M10 ${y}H8`} style={pivot("100% 50%")} />
        ))}
      </g>
      <g data-part="pencil" style={pivot("50% 50%")}>
        {/* a square-ended body with a ferrule band, then the sharpened cone */}
        <path d="M14 4h6v9h-6Z" />
        <path d="M14 8h6" />
        <path d="M14 13l3 6 3-6" stroke={slot.accent} />
      </g>
    </>
  ),
})
