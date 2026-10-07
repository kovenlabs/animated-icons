"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-snow": "fall" | "flurry" | "twinkle"
  }
}

/** Five flakes, each a small solid diamond, scattered out of the cloud's open base: two high, one between, two low. */
const FLAKES = [
  { x: 8, y: 14.5 },
  { x: 16, y: 14.5 },
  { x: 12, y: 17.5 },
  { x: 8, y: 20.5 },
  { x: 16, y: 20.5 },
]
const flake = ({ x, y }: { x: number; y: number }) => `M${x} ${y - 1.5}l1.5 1.5-1.5 1.5-1.5-1.5z`

/** 2 colors: cloud (primary), snowflakes (accent). */
export const CloudSnow = createAnimatedIcon({
  name: "cloud-snow",
  family: "cloud",
  category: "weather",
  keywords: ["snow", "snowy", "winter", "weather", "snowfall", "cold", "blizzard", "forecast"],
  slots: { primary: "cloud", accent: "snowflakes" },
  defaultVariant: "fall",
  variants: {
    // the flakes sink in turn and fade, and fresh ones drift back in from above
    fall: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=flake]",
          { y: [0, 4, -2, 0], opacity: [1, 0, 0, 1] },
          {
            duration: seconds * 0.7,
            times: [0, 0.5, 0.55, 1],
            delay: stagger(seconds * 0.075),
            ease: ["easeIn", "linear", ease.out],
          },
        ),
    },
    // a flurry: the flakes are tossed sideways one after another and swirl back
    flurry: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=flake]",
          { x: [0, 1.5, -1, 0], y: [0, 1, 0.5, 0] },
          { duration: seconds * 0.7, delay: stagger(seconds * 0.075), ease: "easeInOut" },
        ),
    },
    // the flakes glint in turn
    twinkle: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=flake]",
          { scale: [1, 1.6, 1], rotate: [0, 45, 0] },
          { duration: seconds * 0.6, delay: stagger(seconds * 0.1), ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the faceted cloud of the cloud family, open along its base for the snow */}
      <path data-part="cloud" d="M5 18l-3-3v-2l3-3h1l2-4 3-2h2l3 2 2 4h1l3 3v2l-3 3" />
      <g fill={slot.accent} stroke="none">
        {FLAKES.map((p) => (
          <path key={`${p.x}-${p.y}`} data-part="flake" d={flake(p)} style={pivot("50% 50%")} />
        ))}
      </g>
    </>
  ),
})
