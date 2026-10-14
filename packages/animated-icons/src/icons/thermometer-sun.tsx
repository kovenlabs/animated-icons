"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "thermometer-sun": "heat" | "flare" | "shake"
  }
}

/**
 * The sun is the left half of a disc round (11, 12), with four rays 7 to 9 out on its open side: up,
 * up-left, left and down-left. Down is left out, where it would crowd the bulb.
 */
const SUN = { x: 11, y: 12, r: 3 }
const RAYS = [-90, -135, 180, 135].map((deg) => {
  const [cos, sin] = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
  const at = (r: number) => `${+(SUN.x + r * cos).toFixed(3)} ${+(SUN.y + r * sin).toFixed(3)}`
  return `M${at(7)}L${at(9)}`
})

/**
 * The sun's box runs from the left ray's tip (x 2) to the up ray (x 11), and from the up ray's tip
 * (y 3) to the down-left ray's tip; the disc's centre sits on its right edge.
 */
const SUN_TOP = SUN.y - 9
const SUN_BOTTOM = SUN.y + 9 * Math.SQRT1_2
const SUN_ORIGIN = `100% ${(((SUN.y - SUN_TOP) / (SUN_BOTTOM - SUN_TOP)) * 100).toFixed(3)}%`

/** 2 colors: glass (primary), sun and mercury (accent). */
export const ThermometerSun = createAnimatedIcon({
  name: "thermometer-sun",
  family: "thermometer",
  category: "weather",
  keywords: ["hot", "heat", "heatwave", "temperature", "summer", "sunny", "warm", "weather"],
  slots: { primary: "glass", accent: "sun + mercury" },
  defaultVariant: "heat",
  variants: {
    // the sun beats down: its disc swells and its rays draw in and flare out one after another, and
    // the mercury dips, then shoots up the tube past its mark and settles back on it
    heat: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=disc]", { scale: [1, 1.2, 1] }, { duration: seconds * 0.7, ease: "easeInOut" }),
          animate(
            "[data-part=ray]",
            { scale: [1, 0.4, 1.15, 1], opacity: [1, 0.5, 1, 1] },
            { duration: seconds * 0.5, delay: stagger(seconds * 0.07), ease: "easeInOut" },
          ),
          animate(
            "[data-part=column]",
            { scaleY: [1, 0.6, 1.3, 1.3, 1] },
            {
              duration: seconds,
              times: [0, 0.2, 0.55, 0.75, 1],
              ease: [ease.in, ease.out, "linear", "easeInOut"],
            },
          ),
        ]),
    },
    // a solar flare: the sun winds itself up, shrinking and turning back, then bursts out to full size;
    // the heat reaches the thermometer a beat later and the mercury jumps
    flare: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sun]",
            { scale: [1, 0.5, 1], rotate: [0, -40, 0] },
            { duration: seconds * 0.7, times: [0, 0.45, 1], ease: [ease.inOut, ease.overshoot] },
          ),
          animate(
            "[data-part=column]",
            { scaleY: [1, 1, 1.3, 0.9, 1] },
            {
              duration: seconds,
              times: [0, 0.45, 0.65, 0.85, 1],
              ease: ["linear", ease.out, "easeInOut", "easeInOut"],
            },
          ),
        ]),
    },
    // shaken down like a fever thermometer: it rocks on its bulb and the mercury sloshes, while the sun
    // bobs beside it
    shake: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=thermometer]",
            { rotate: [0, -6, 5, -3, 1.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=column]",
            { scaleY: [1, 0.7, 1.2, 0.9, 1.05, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=sun]",
            { y: [0, 1, -1, 0.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="sun" stroke={slot.accent} style={pivot(SUN_ORIGIN)}>
        {/* the sun is round, so its half disc is a true arc */}
        <path
          data-part="disc"
          d={`M${SUN.x} ${SUN.y - SUN.r}a${SUN.r} ${SUN.r} 0 0 0 0 ${SUN.r * 2}`}
          style={pivot("100% 50%")}
        />
        {RAYS.map((d) => (
          <path key={d} data-part="ray" d={d} style={pivot("50% 50%")} />
        ))}
      </g>
      {/* the thermometer of the thermometer family, moved to the right; its bulb's centre is 80% down its box */}
      <g data-part="thermometer" style={pivot("50% 80%")}>
        {/* the mercury sits under the glass, filling the bulb and the tube up to its mark */}
        <g fill={slot.accent} stroke="none">
          <rect data-part="column" x="16.5" y="7" width="3" height="10" style={pivot("50% 100%")} />
          <circle cx="18" cy="18" r="3.5" />
        </g>
        {/* a flat-topped tube into a round bulb: the bulb is round, so it is a true arc */}
        <path d="M16 14.54V2h4v12.54a4 4 0 1 1-4 0z" />
      </g>
    </>
  ),
})
