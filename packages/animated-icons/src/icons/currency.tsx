"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    currency: "radiate" | "spin" | "exchange"
  }
}

const TURN = spin(2, "inOut")

/** The four rays, each pointing out from the coin along a diagonal; `dx`/`dy` is its outward direction. */
const RAYS = [
  { d: "M3 3l2 2", dx: -1, dy: -1 },
  { d: "M21 3l-2 2", dx: 1, dy: -1 },
  { d: "M21 21l-2-2", dx: 1, dy: 1 },
  { d: "M3 21l2-2", dx: -1, dy: 1 },
]

/** 2 colors: coin (primary), rays and rim (accent). */
export const Currency = createAnimatedIcon({
  name: "currency",
  category: "finance",
  keywords: ["money", "exchange", "forex", "generic currency", "price", "payment", "cash", "currency sign"],
  slots: { primary: "coin", accent: "rays + rim" },
  defaultVariant: "radiate",
  variants: {
    // the coin draws in on itself, pulling the rays in with it, then bursts out bigger and flings
    // them back past their places before everything settles
    radiate: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=coin]",
            { scale: [1, 0.7, 1.25, 0.95, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.78, 1], ease: ["easeInOut", ease.out, "easeInOut", "easeInOut"] },
          ),
          ...RAYS.map(({ dx, dy }, i) =>
            animate(
              `[data-part=ray-${i}]`,
              { x: [0, -2 * dx, dx, 0], y: [0, -2 * dy, dy, 0] },
              { duration: seconds, times: [0, 0.3, 0.58, 1], ease: ["easeInOut", ease.out, ease.overshoot] },
            ),
          ),
        ]),
    },
    // the coin spins on its edge, two turns that wind up and down again; side-on it shows its rim,
    // and the rays pulse out each time it does
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=coin]", { scaleX: TURN.scaleX }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate("[data-part=rim]", { opacity: TURN.edge }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate(
            "[data-part=rays]",
            { scale: TURN.edge.map((edge) => 1 - 0.12 * edge) },
            { duration: seconds, times: TURN.times, ease: TURN.ease },
          ),
        ]),
    },
    // one currency for another: the rays orbit a quarter turn, drawn in close while the coin
    // shrinks out of their way, then the coin pops back as they land on the next corners
    exchange: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=rays]",
            { rotate: [0, 90, 0] },
            { duration: seconds * 0.75, times: [0, 0.999, 1], ease: ["easeInOut", snap] },
          ),
          animate(
            "[data-part=rays]",
            { scale: [1, 0.75, 1] },
            { duration: seconds * 0.75, ease: "easeInOut" },
          ),
          animate(
            "[data-part=coin]",
            { scale: [1, 0.75, 0.75, 1.15, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.8, 1], ease: ["easeInOut", "linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the coin is genuinely round: a true circle */}
      <circle data-part="coin" cx="12" cy="12" r="5.5" style={pivot("50% 50%")} />
      <g data-part="rays" stroke={slot.accent} style={pivot("50% 50%")}>
        {RAYS.map(({ d }, i) => (
          <path key={d} data-part={`ray-${i}`} d={d} />
        ))}
      </g>
      {/* the coin's rim, seen only side-on */}
      <rect data-part="rim" x="11" y="6.5" width="2" height="11" fill={slot.accent} stroke="none" style={flash()} />
    </>
  ),
})
