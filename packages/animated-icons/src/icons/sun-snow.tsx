"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    "sun-snow": "frost" | "thaw" | "flip"
  }
}

/** The sun is the left half of a disc round (11, 12), with five rays 7 to 9 out on its open side. */
const SUN = { x: 11, y: 12, r: 3 }
const RAYS = [-90, -135, 180, 135, 90].map((deg) => {
  const [cos, sin] = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
  const at = (r: number) => `${+(SUN.x + r * cos).toFixed(3)} ${+(SUN.y + r * sin).toFixed(3)}`
  return `M${at(7)}L${at(9)}`
})

/**
 * The sun's box runs from the left ray's tip (x 2) to the vertical rays (x 11), and from y 3 to y 21:
 * the disc's centre sits on its right edge, half way down.
 */
const SUN_ORIGIN = "100% 50%"

/** A six-armed snowflake round (18.5, 12): three strokes through its centre, 4 out each way. */
const FLAKE = { x: 18.5, y: 12, r: 4 }
const ARMS = [90, 30, -30].map((deg) => {
  const [dx, dy] = [FLAKE.r * Math.cos((deg * Math.PI) / 180), FLAKE.r * Math.sin((deg * Math.PI) / 180)]
  const f = (n: number) => +n.toFixed(3)
  return `M${f(FLAKE.x - dx)} ${f(FLAKE.y - dy)}L${f(FLAKE.x + dx)} ${f(FLAKE.y + dy)}`
})

const TURN = spin(2, "out")

/** 2 colors: sun (primary), snowflake (accent). */
export const SunSnow = createAnimatedIcon({
  name: "sun-snow",
  family: "sun",
  category: "weather",
  keywords: ["sun and snow", "winter sun", "cold", "frost", "weather", "forecast", "snow", "chilly"],
  slots: { primary: "sun", accent: "snowflake" },
  defaultVariant: "frost",
  variants: {
    // a cold snap: the snowflake whirls a full turn, flying off into the distance and back up close,
    // while the sun shivers and pulls its rays in against the cold
    frost: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flake]",
            { rotate: [0, 360] },
            { duration: seconds, ease: ease.inOut },
          ),
          animate(
            "[data-part=flake]",
            { scale: [1, 0.55, 1.06, 1] },
            { duration: seconds, times: [0, 0.4, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=rays]",
            { scale: [1, 0.75, 0.75, 1] },
            { duration: seconds, times: [0, 0.25, 0.7, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=sun]",
            { x: [0, -0.6, 0.6, -0.6, 0.6, -0.3, 0] },
            { duration: seconds * 0.7, delay: seconds * 0.1, ease: "linear" },
          ),
        ]),
    },
    // the sun warms up: its rays draw in and flare out one after another and the snowflake slumps into a puddle,
    // then freezes back into shape with a snap
    thaw: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ray]",
            { scale: [1, 0.4, 1.15, 1], opacity: [1, 0.5, 1, 1] },
            { duration: seconds * 0.45, delay: stagger(seconds * 0.06), ease: "easeInOut" },
          ),
          animate(
            "[data-part=disc]",
            { scale: [1, 1.15, 1] },
            { duration: seconds * 0.6, ease: "easeInOut" },
          ),
          animate(
            "[data-part=melt]",
            { scaleY: [1, 0.25, 0.25, 1.1, 1], scaleX: [1, 1.06, 1.06, 0.95, 1], opacity: [1, 0.45, 0.45, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.35, 0.6, 0.8, 1],
              ease: [ease.in, "linear", ease.out, "easeInOut"],
            },
          ),
          animate(
            "[data-part=flake]",
            { rotate: [0, 0, -30, 0] },
            { duration: seconds, times: [0, 0.6, 0.8, 1], ease: ["linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // the snowflake is flicked like a coin and spins twice on its upright axis, slowing as it settles,
    // and the sun ducks back out of its way
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: TURN.scaleX },
            { duration: seconds, times: TURN.times, ease: TURN.ease },
          ),
          animate(
            "[data-part=sun]",
            { scale: [1, 0.85, 1.02, 1] },
            { duration: seconds, times: [0, 0.3, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="sun" style={pivot(SUN_ORIGIN)}>
        {/* the sun is round, so its half disc is a true arc */}
        <path
          data-part="disc"
          d={`M${SUN.x} ${SUN.y - SUN.r}a${SUN.r} ${SUN.r} 0 0 0 0 ${SUN.r * 2}`}
          style={pivot("100% 50%")}
        />
        <g data-part="rays" style={pivot(SUN_ORIGIN)}>
          {RAYS.map((d) => (
            <path key={d} data-part="ray" d={d} style={pivot("50% 50%")} />
          ))}
        </g>
      </g>
      <g data-part="melt" stroke={slot.accent} style={pivot("50% 100%")}>
        <g data-part="turn" style={pivot("50% 50%")}>
          <g data-part="flake" style={pivot("50% 50%")}>
            {ARMS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </g>
      </g>
    </>
  ),
})
