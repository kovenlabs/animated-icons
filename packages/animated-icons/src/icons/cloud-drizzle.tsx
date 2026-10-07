"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-drizzle": "drizzle" | "sprinkle" | "sway"
  }
}

/**
 * Five short drops, three across the cloud's open base and two staggered beneath it, listed in the
 * order they fall so the drizzle patters unevenly.
 */
const DROPS = [
  { x: 8, y: 13 },
  { x: 14, y: 19 },
  { x: 12, y: 13 },
  { x: 10, y: 19 },
  { x: 16, y: 13 },
]

/** 2 colors: cloud (primary), drizzle (accent). */
export const CloudDrizzle = createAnimatedIcon({
  name: "cloud-drizzle",
  family: "cloud",
  category: "weather",
  keywords: ["drizzle", "light rain", "showers", "weather", "drops", "mist", "forecast", "rainy"],
  slots: { primary: "cloud", accent: "drizzle" },
  defaultVariant: "drizzle",
  variants: {
    // each drop falls toward you, swelling as it passes and fading out, and a fresh one appears far
    // off in its place, so the drizzle comes at you in depth while the cloud bobs
    drizzle: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=drop]",
            { y: [0, 4, 0, 0], scale: [1, 1.6, 0.3, 1], opacity: [1, 0, 0, 1] },
            {
              duration: seconds * 0.65,
              times: [0, 0.5, 0.55, 1],
              delay: stagger(seconds * 0.085),
              ease: [ease.in, "linear", ease.overshoot],
            },
          ),
          animate("[data-part=cloud]", { y: [0, -1, 0.5, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the cloud squashes down onto its base, springs up past its height, and shakes the drops out:
    // each one stretches as it is flung down and snaps back
    sprinkle: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cloud]",
            { scaleX: [1, 1.1, 0.94, 1.02, 1], scaleY: [1, 0.8, 1.12, 0.97, 1] },
            { duration: seconds * 0.8, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=drop]",
            { y: [0, 2, 0], scaleY: [1, 1.8, 1] },
            { duration: seconds * 0.45, delay: stagger(seconds * 0.05, { startDelay: seconds * 0.3 }), ease: "easeOut" },
          ),
        ]),
    },
    // a gust tilts the cloud on its top like a swinging sign, and the drizzle trails a beat behind
    sway: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=shower]",
            { skewX: [0, -14, 9, -4, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=drizzle]",
            { x: [0, 0, 0.8, -0.6, 0] },
            { duration: seconds, times: [0, 0.2, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="shower" style={pivot("50% 0%")}>
      {/* the faceted cloud of the cloud family, open along its base for the drizzle */}
      <path data-part="cloud" d="M5 18l-3-3v-2l3-3h1l2-4 3-2h2l3 2 2 4h1l3 3v2l-3 3" style={pivot("50% 100%")} />
      <g data-part="drizzle" stroke={slot.accent}>
        {DROPS.map(({ x, y }) => (
          <path key={`${x}-${y}`} data-part="drop" d={`M${x} ${y}v1.5`} style={pivot("50% 0%")} />
        ))}
      </g>
    </g>
  ),
})
