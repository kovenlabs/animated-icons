"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    radiation: "spin" | "emit" | "flip"
  }
}

const INNER = 3.5
const OUTER = 7
const round = (n: number) => Math.round(n * 1000) / 1000
const at = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return { x: round(12 + r * Math.cos(a)), y: round(12 + r * Math.sin(a)) }
}

/** The trefoil: three 60° annular blades, one pointing down, each with its outward direction. */
const BLADES = [90, 210, 330].map((deg) => {
  const [a, b, c, d] = [at(INNER, deg - 30), at(OUTER, deg - 30), at(OUTER, deg + 30), at(INNER, deg + 30)]
  const out = at(1.5, deg)
  return {
    d: `M${a.x} ${a.y}L${b.x} ${b.y}A${OUTER} ${OUTER} 0 0 1 ${c.x} ${c.y}L${d.x} ${d.y}A${INNER} ${INNER} 0 0 0 ${a.x} ${a.y}Z`,
    dx: round(out.x - 12),
    dy: round(out.y - 12),
  }
})

/** The trefoil's box runs from the upper blades' tips down to the bottom blade: its centre is the core. */
const TOP = 12 - OUTER * Math.sin(Math.PI / 3)
const CORE = `50% ${round(((12 - TOP) / (12 + OUTER - TOP)) * 100)}%`

/** 2 colors: ring (primary), trefoil (accent). */
export const Radiation = createAnimatedIcon({
  name: "radiation",
  category: "education",
  keywords: ["radioactive", "nuclear", "hazard", "trefoil", "danger", "atomic", "warning", "x-ray"],
  slots: { primary: "ring", accent: "trefoil" },
  defaultVariant: "spin",
  variants: {
    // the trefoil winds back, then whirls a full turn inside its ring and overshoots into place
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=trefoil]",
            { rotate: [0, -25, 380, 360] },
            { duration: seconds, times: [0, 0.2, 0.8, 1], ease: ["easeOut", "easeInOut", "easeOut"] },
          ),
          animate(
            "[data-part=core]",
            { scale: [1, 1, 1.6, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // it emits twice: the core flares, the blades burst out toward the ring and the ring throbs
    emit: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.2, 0.45, 0.65, 1], ease: ["easeOut", "easeIn", "easeOut", "easeInOut"] as Easing[] }
        return Promise.all([
          ...BLADES.map(({ dx, dy }, i) =>
            animate(`[data-blade="${i}"]`, { x: [0, dx, 0, dx, 0], y: [0, dy, 0, dy, 0] }, timing),
          ),
          animate("[data-part=core]", { scale: [1, 1.7, 1, 1.7, 1] }, timing),
          animate("[data-part=ring]", { scale: [1, 1.05, 1, 1.05, 1] }, timing),
        ])
      },
    },
    // tossed like a token: it lifts toward you and turns over twice on its vertical axis
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: [1, -1, 1, -1, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=token]",
            { scale: [1, 0.85, 0.85, 1.06, 1] },
            { duration: seconds, times: [0, 0.2, 0.7, 0.88, 1], ease: ["easeOut", "linear", ease.overshoot, "easeOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="token" style={pivot("50% 50%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        <circle data-part="ring" cx="12" cy="12" r="10" style={pivot("50% 50%")} />
        <g data-part="trefoil" fill={slot.accent} stroke="none" style={pivot(CORE)}>
          <circle data-part="core" cx="12" cy="12" r="1.5" style={pivot("50% 50%")} />
          {BLADES.map(({ d }, i) => (
            <path key={d} data-blade={i} d={d} />
          ))}
        </g>
      </g>
    </g>
  ),
})
