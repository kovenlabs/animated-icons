"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    calculator: "type" | "result" | "shake"
  }
}

/** Two rows of three keys, listed in the order `type` presses them. */
const KEYS = [
  [7, 12],
  [11, 12],
  [15, 12],
  [7, 16],
  [11, 16],
  [15, 16],
] as const

/** 2 colors: body + keys (primary), display (accent). */
export const Calculator = createAnimatedIcon({
  name: "calculator",
  category: "finance",
  keywords: ["math", "calculate", "sum", "total", "accounting", "arithmetic", "budget", "numbers"],
  slots: { primary: "body + keys", accent: "display" },
  defaultVariant: "type",
  variants: {
    // the keys are tapped one after another, then the display blinks with the answer
    type: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=key]",
            { opacity: [1, 0.15, 1] },
            { duration: seconds * 0.25, delay: stagger(seconds * 0.09), ease: "easeInOut" },
          ),
          animate(
            "[data-part=display]",
            { opacity: [1, 0, 1] },
            { duration: seconds * 0.3, delay: seconds * 0.7, ease: "easeInOut" },
          ),
        ]),
    },
    // the display clears and the result runs back in from the left
    result: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=display]",
          { scaleX: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.25, 0.35, 1], ease: "easeOut" },
        ),
    },
    // a wrong sum: it shakes its head
    shake: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=calculator]",
          { x: [0, -1.5, 1.5, -1.5, 1.5, 0], rotate: [0, -3, 3, -3, 3, 0] },
          { duration: seconds, ease: "linear" },
        ),
    },
  },
  render: () => (
    <g data-part="calculator" style={pivot("50% 50%")}>
      <path d="M4 2h16v20H4z" />
      {/* a solid readout, 2px clear of the keys below */}
      <rect data-part="display" x="7" y="6" width="10" height="4" fill={slot.accent} stroke="none" style={pivot("0% 50%")} />
      <g fill={slot.primary} stroke="none">
        {KEYS.map(([x, y]) => (
          <rect key={`${x}-${y}`} data-part="key" x={x} y={y} width="2" height="2" />
        ))}
      </g>
    </g>
  ),
})
