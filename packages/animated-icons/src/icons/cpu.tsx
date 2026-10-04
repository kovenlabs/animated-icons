"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cpu: "sweep" | "pulse"
  }
}

/** Three pins a side, 4 apart, each reaching from the 2px padding into the body's stroke. */
const AT = [8, 12, 16] as const

/** Listed clockwise from the top-left pin, so a stagger in DOM order runs round the chip. */
const SIDES: Array<{ side: string; pins: string[]; out: Record<string, number[]> }> = [
  { side: "top", pins: AT.map((x) => `M${x} 3v2`), out: { y: [0, -1.5, 0] } },
  { side: "right", pins: AT.map((y) => `M19 ${y}h2`), out: { x: [0, 1.5, 0] } },
  { side: "bottom", pins: [...AT].reverse().map((x) => `M${x} 19v2`), out: { y: [0, 1.5, 0] } },
  { side: "left", pins: [...AT].reverse().map((y) => `M3 ${y}h2`), out: { x: [0, -1.5, 0] } },
]

/** 2 colors: chip and pins (primary), core (accent). */
export const Cpu = createAnimatedIcon({
  name: "cpu",
  category: "development",
  keywords: ["processor", "chip", "microchip", "hardware", "computing", "performance", "silicon"],
  slots: { primary: "chip + pins", accent: "core + pin lights" },
  defaultVariant: "sweep",
  variants: {
    // the pins light up one after another, clockwise round the chip, each pushing out as it lights
    sweep: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const step = seconds * 0.06
        const each = seconds * 0.3
        return Promise.all([
          ...SIDES.map(({ side, out }, i) =>
            animate(`[data-part=pin-${side}]`, out, {
              duration: each,
              delay: stagger(step, { startDelay: i * 3 * step }),
              ease: "easeInOut",
            }),
          ),
          animate(
            "[data-part=lit]",
            { opacity: [0, 1, 0] },
            { duration: each, delay: stagger(step), ease: "easeInOut" },
          ),
        ])
      },
    },
    // the core swells and glows, then settles
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=core]",
            { scale: [1, 1.2, 0.95, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=glow]",
            { opacity: [0, 1, 0] },
            { duration: seconds, times: [0, 0.35, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {SIDES.map(({ side, pins }) =>
        pins.map((d) => (
          <g key={d} data-part={`pin-${side}`}>
            <path d={d} />
            <path data-part="lit" d={d} stroke={slot.accent} style={flash()} />
          </g>
        )),
      )}
      <path d="M5 5h14v14H5Z" />
      <g data-part="core" stroke={slot.accent} style={pivot("50% 50%")}>
        <path d="M9 9h6v6H9Z" />
        <rect data-part="glow" x="9" y="9" width="6" height="6" fill={slot.accent} stroke="none" style={flash()} />
      </g>
    </>
  ),
})
