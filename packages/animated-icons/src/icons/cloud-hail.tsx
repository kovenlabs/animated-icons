"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-hail": "pelt" | "bounce" | "rattle"
  }
}

/**
 * Three columns of hail out of the cloud's open base: a short streak inside the cloud and a solid
 * stone on the ground under it. The middle streak hangs lower than the outer two, so the fall reads uneven.
 */
const COLUMNS = [
  { x: 8, streak: 13.5 },
  { x: 12, streak: 15 },
  { x: 16, streak: 13.5 },
]
const GROUND = 20

/** 2 colors: cloud (primary), hail (accent). */
export const CloudHail = createAnimatedIcon({
  name: "cloud-hail",
  family: "cloud",
  category: "weather",
  keywords: ["hail", "hailstorm", "sleet", "ice", "storm", "weather", "forecast", "hailstones"],
  slots: { primary: "cloud", accent: "hail" },
  defaultVariant: "pelt",
  variants: {
    // the hail pelts down: each column whips out through the bottom in turn and a fresh one drops in
    // from the cloud with a hard landing, while the cloud shudders as it lets them go
    pelt: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=column]",
            { y: [0, 6, -2, 0], opacity: [1, 0, 0, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.45, 0.5, 1],
              delay: stagger(seconds * 0.12),
              ease: [ease.in, "linear", ease.overshoot],
            },
          ),
          animate(
            "[data-part=cloud]",
            { x: [0, -0.8, 0.8, -0.6, 0.4, 0], scaleY: [1, 0.9, 1.05, 0.97, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
        ]),
    },
    // the stones hit the ground: they squash flat, spring up stretched, and land again with a smaller
    // squash, while the cloud kicks up out of their way and the streaks flick
    bounce: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sky]",
            { y: [0, -2, -2, 0] },
            { duration: seconds, times: [0, 0.15, 0.6, 0.85], ease: ["easeOut", "linear", "easeInOut"] },
          ),
          animate(
            "[data-part=streak]",
            { scaleY: [1, 1.5, 1] },
            { duration: seconds * 0.35, ease: "easeOut" },
          ),
          animate(
            "[data-part=stone]",
            {
              y: [0, 0, -1, -2, 0, 0, 0],
              scaleY: [1, 0.5, 1.3, 1, 0.6, 1.1, 1],
              scaleX: [1, 1.4, 0.8, 1, 1.35, 0.92, 1],
            },
            {
              duration: seconds,
              times: [0, 0.15, 0.3, 0.45, 0.62, 0.8, 1],
              delay: stagger(seconds * 0.04),
              ease: ["easeOut", "easeOut", "easeOut", ease.in, "easeOut", "easeInOut"],
            },
          ),
        ]),
    },
    // hail rattles on a roof: the stones skitter and spin in place one after another, the streaks
    // flicker, and the cloud leans into the gust and back
    rattle: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stone]",
            { rotate: [0, -35, 25, -15, 0], y: [0, -1.5, 0, -0.8, 0] },
            { duration: seconds * 0.6, delay: stagger(seconds * 0.1), ease: "easeInOut" },
          ),
          animate(
            "[data-part=streak]",
            { opacity: [1, 0.2, 1, 0.3, 1] },
            { duration: seconds * 0.6, delay: stagger(seconds * 0.12), ease: "linear" },
          ),
          animate(
            "[data-part=cloud]",
            { skewX: [0, -8, 6, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="sky">
        {/* the faceted cloud of the cloud family, open along its base for the hail */}
        <path data-part="cloud" d="M5 18l-3-3v-2l3-3h1l2-4 3-2h2l3 2 2 4h1l3 3v2l-3 3" style={pivot("50% 100%")} />
      </g>
      {COLUMNS.map(({ x, streak }) => (
        <g key={x} data-part="column">
          <g data-part="sky">
            <path data-part="streak" d={`M${x} ${streak}v2`} stroke={slot.accent} style={pivot("50% 0%")} />
          </g>
          {/* a hailstone is a solid square, sitting on the ground */}
          <rect
            data-part="stone"
            x={x - 1}
            y={GROUND}
            width="2"
            height="2"
            fill={slot.accent}
            stroke="none"
            style={pivot("50% 100%")}
          />
        </g>
      ))}
    </>
  ),
})
