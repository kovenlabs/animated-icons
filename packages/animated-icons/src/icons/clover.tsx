"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    clover: "toss" | "pop" | "sway"
  }
}

/**
 * A faceted heart standing on its point at the stem's top (12, 11): straight flanks, square shoulders,
 * two lobes and a notch between them. The other leaves are this one turned about the point.
 */
const LEAF = "M12 11 8.5 5V3.5L10 2l2 2 2-2 1.5 1.5V5z"

/** Up, right and left: the gap below the head leaves room for the stem. */
const TURNS = [0, 90, -90]

/** 2 colors: stem (primary), leaves (accent). */
export const Clover = createAnimatedIcon({
  name: "clover",
  category: "nature",
  keywords: ["shamrock", "luck", "lucky", "irish", "st patricks", "fortune", "plant", "leaf"],
  slots: { primary: "stem", accent: "leaves" },
  defaultVariant: "toss",
  variants: {
    // flipped like a lucky coin: it spins twice round its stem in the air and lands with a squash
    toss: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=clover]",
            { y: [0, -4, 0, 0] },
            { duration: seconds, times: [0, 0.36, 0.72, 1], ease: ["easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=clover]",
            { scaleX: [1, -1, 1, -1, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.36, 0.54, 0.72, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=clover]",
            { scaleY: [1, 1, 0.84, 1] },
            { duration: seconds, times: [0, 0.72, 0.82, 1], ease: ["linear", "easeOut", ease.overshoot] },
          ),
        ]),
    },
    // the leaves pop one after another, round the head
    pop: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=leaf]",
          { scale: [1, 1.35, 0.9, 1], rotate: [0, -10, 4, 0] },
          { duration: seconds * 0.55, delay: stagger(seconds * 0.15), ease: "easeInOut" },
        ),
    },
    // bends in a gust from the foot of its stem, the head lagging behind and swinging on
    sway: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=sway]", { rotate: [0, -10, 7, -4, 1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=head]",
            { rotate: [0, -8, 10, -6, 2, 0] },
            { duration: seconds, times: [0, 0.25, 0.48, 0.7, 0.86, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // the stem's foot is a third of the way across: the gust bends it from there
    <g data-part="clover" style={pivot("50% 100%")}>
      <g data-part="sway" style={pivot("33.33% 100%")}>
        <path d="M12 11v6l-3 4" />
        {/* turns on the leaves' shared point */}
        <g data-part="head" stroke={slot.accent} style={pivot("50% 72%")}>
          {TURNS.map((turn) => (
            <g key={turn} transform={`rotate(${turn} 12 11)`}>
              <path data-part="leaf" d={LEAF} style={pivot("50% 100%")} />
            </g>
          ))}
        </g>
      </g>
    </g>
  ),
})
