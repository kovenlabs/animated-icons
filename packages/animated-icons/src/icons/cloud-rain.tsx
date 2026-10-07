"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-rain": "pour" | "gust" | "wring"
  }
}

/** Three streaks out of the cloud's open base, the middle one lower, in the order they fall: left, middle, right. */
const DROPS = ["M8 13v4", "M12 16v4", "M16 13v4"]

/** 2 colors: cloud (primary), rain (accent). */
export const CloudRain = createAnimatedIcon({
  name: "cloud-rain",
  family: "cloud",
  category: "weather",
  keywords: ["rain", "rainy", "weather", "shower", "drizzle", "storm", "precipitation", "forecast"],
  slots: { primary: "cloud", accent: "rain" },
  defaultVariant: "pour",
  variants: {
    // each streak falls out through the bottom of the frame and a fresh one slides down out of the cloud
    pour: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=drop]",
          { y: [0, 6, -3, 0], opacity: [1, 0, 0, 1] },
          {
            duration: seconds * 0.7,
            times: [0, 0.45, 0.5, 1],
            delay: stagger(seconds * 0.15),
            ease: [ease.in, "linear", "easeOut"],
          },
        ),
    },
    // a gust catches the rain: the streaks slant from the cloud while the cloud is pushed a touch along
    gust: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=rain]",
            { skewX: [0, 20, -5, 0], x: [0, 1, 0, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=cloud]",
            { x: [0, 1.5, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the cloud is wrung out: it squeezes and the streaks stretch down from it, then both spring back
    wring: {
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cloud]",
            { scaleX: [1, 0.92, 1.03, 1], scaleY: [1, 0.9, 1.02, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=drop]",
            { scaleY: [1, 1.5, 1] },
            { duration: seconds * 0.8, delay: seconds * 0.15, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the faceted cloud of the cloud family, open along its base for the rain */}
      <path data-part="cloud" d="M5 18l-3-3v-2l3-3h1l2-4 3-2h2l3 2 2 4h1l3 3v2l-3 3" style={pivot("50% 100%")} />
      <g data-part="rain" stroke={slot.accent} style={pivot("50% 0%")}>
        {DROPS.map((d) => (
          <path key={d} data-part="drop" d={d} style={pivot("50% 0%")} />
        ))}
      </g>
    </>
  ),
})
