"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    power: "press" | "boot" | "flip"
  }
}

/** The ring's centre and radius: it reaches the frame's bottom edge (y 22). */
const CX = 12
const CY = 13
const R = 9
const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** A true arc, open 40° either side of straight up so the bar drops in through the gap. */
const OPEN = (40 * Math.PI) / 180
const RING = `M${fmt(CX + R * Math.sin(OPEN))} ${fmt(CY - R * Math.cos(OPEN))}A${R} ${R} 0 1 1 ${fmt(CX - R * Math.sin(OPEN))} ${fmt(CY - R * Math.cos(OPEN))}`

/** 2 colors: ring (primary), bar and glow (accent). */
export const Power = createAnimatedIcon({
  name: "power",
  category: "devices",
  keywords: ["on", "off", "shutdown", "switch", "standby", "restart", "boot", "turn on"],
  slots: { primary: "ring", accent: "bar + glow" },
  defaultVariant: "press",
  variants: {
    // pressed like a real button: the whole symbol sinks and squashes, the bar plunges into the ring,
    // then everything springs back past rest as the ring glows on
    press: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.25, 0.55, 0.78, 1], ease: ["easeIn", ease.overshoot, "easeInOut", "easeOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=power]", { scaleX: [1, 1.1, 0.95, 1.02, 1], scaleY: [1, 0.78, 1.08, 0.98, 1] }, timing),
          animate("[data-part=bar]", { y: [0, 3, -1.5, 0.5, 0] }, timing),
          animate(
            "[data-part=glow]",
            { opacity: [0, 0, 1, 0], scale: [0.3, 0.3, 1, 1.15] },
            { duration: seconds, times: [0, 0.3, 0.55, 1], ease: "easeOut" },
          ),
        ])
      },
    },
    // a cold boot: the bar lifts away and fades, the ring sweeps itself back on, and the bar drops in
    // from above the frame through the gap and lands with a squash
    boot: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=ring]", { opacity: [1, 0, 0, 1] }, { duration: seconds, times: [0, 0.12, 0.2, 0.24], ease: "easeOut" }),
          animate(
            "[data-part=ring]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.18, 0.2, 0.6], ease: ["linear", "linear", ease.out] },
          ),
          animate(
            "[data-part=bar]",
            { y: [0, -4, -11, 1.5, 0], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.55, 0.8, 1], ease: [ease.in, "linear", ease.in, ease.overshoot] },
          ),
          animate(
            "[data-part=bar]",
            { scaleY: [1, 1, 1.25, 0.7, 1] },
            { duration: seconds, times: [0, 0.6, 0.75, 0.85, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=glow]",
            { opacity: [0, 0, 1, 0], scale: [0.3, 0.3, 1, 1.15] },
            { duration: seconds, times: [0, 0.78, 0.86, 1], ease: "easeOut" },
          ),
        ]),
    },
    // tossed like a coin: it hops, turns a full face around its upright axis with the bar sliding
    // ahead of the ring for depth, and lands with a squash
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=power]",
            { y: [0, 1, -3, 0, 0], scaleY: [1, 0.85, 1.08, 0.85, 1] },
            { duration: seconds, times: [0, 0.12, 0.5, 0.82, 1], ease: ["easeOut", "easeOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=face]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.45, 0.6, 0.78, 1], ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"] },
          ),
          animate(
            "[data-part=bar]",
            { x: [0, 0, 2, 0, -2, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.45, 0.6, 0.78, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="power" style={pivot("50% 100%")}>
      <g data-part="face" style={pivot("50% 50%")}>
        <circle data-part="glow" cx={CX} cy={CY} r="6" fill={slot.accent} fillOpacity={0.25} stroke="none" style={flash()} />
        {/* a power ring is round, so it is a true arc */}
        <path data-part="ring" d={RING} />
        <path data-part="bar" d="M12 2v9" stroke={slot.accent} style={pivot("50% 100%")} />
      </g>
    </g>
  ),
})
