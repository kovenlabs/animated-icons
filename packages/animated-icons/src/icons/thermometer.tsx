"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    thermometer: "rise" | "heat" | "shake"
  }
}

/** Two short heat lines off the tube's right side, the outer one higher. */
const HEAT = ["M18 11V8", "M21 9V6"]

/** 2 colors: glass (primary), mercury and heat lines (accent). */
export const Thermometer = createAnimatedIcon({
  name: "thermometer",
  category: "weather",
  keywords: ["temperature", "heat", "hot", "cold", "fever", "climate", "degrees", "weather"],
  slots: { primary: "glass", accent: "mercury + heat lines" },
  defaultVariant: "rise",
  variants: {
    // the mercury drains into the bulb, then climbs past its mark and settles back on it
    rise: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=column]",
          { scaleY: [1, 0.2, 1.15, 1] },
          { duration: seconds, times: [0, 0.25, 0.75, 1], ease: ["easeIn", ease.out, "easeInOut"] },
        ),
    },
    // it heats up: the mercury runs up the tube while heat lines float up off its side
    heat: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=column]",
            { scaleY: [1, 1.2, 1.2, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=heat]",
            { y: [1, -1, -3], opacity: [0, 1, 0] },
            { duration: seconds * 0.7, delay: stagger(seconds * 0.15, { startDelay: seconds * 0.1 }), ease: "easeOut" },
          ),
        ]),
    },
    // shaken down like a fever thermometer: it rocks on its bulb
    shake: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=thermometer]",
          { rotate: [0, -10, 8, -6, 3, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {HEAT.map((d) => (
          <path key={d} data-part="heat" d={d} style={flash()} />
        ))}
      </g>
      <g data-part="thermometer" style={pivot("50% 100%")}>
        {/* the mercury sits under the glass, filling the bulb and the tube up to its mark */}
        <g fill={slot.accent} stroke="none">
          <rect data-part="column" x="10.5" y="7" width="3" height="10" style={pivot("50% 100%")} />
          <circle cx="12" cy="18" r="3.5" />
        </g>
        {/* a flat-topped tube into a round bulb: the bulb is round, so it is a true arc */}
        <path d="M10 14.54V2h4v12.54a4 4 0 1 1-4 0z" />
      </g>
    </>
  ),
})
