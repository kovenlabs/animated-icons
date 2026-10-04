"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    battery: "charge" | "low" | "zap"
  }
}

/** Sparks thrown off to the left of the bolt. */
const SPARKS = ["M13 2.5l1 1", "M11.5 6h2"]

/** 3 colors: shell (primary), bolt and sparks (secondary), level (accent). Charges on its own. */
export const Battery = createAnimatedIcon({
  name: "battery",
  category: "devices",
  keywords: ["power", "charge", "energy", "level", "low battery", "electric"],
  slots: { primary: "shell + terminal", secondary: "bolt + sparks", accent: "level" },
  defaultVariant: "charge",
  defaults: { trigger: "auto", interval: 1500 },
  variants: {
    // empties in a blink, then fills back up while the bolt pulses
    charge: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=level]",
            { scaleX: [1, 0, 1] },
            { duration: seconds * 0.85, times: [0, 0.15, 1], ease: ease.out },
          ),
          animate("[data-part=bolt]", { opacity: [1, 0.4, 1] }, { duration: seconds * 0.8, ease: "easeInOut" }),
          animate("[data-part=spark]", blink, {
            duration: seconds * 0.4,
            delay: stagger(seconds * 0.06, { startDelay: seconds * 0.6 }),
            ease: "easeOut",
          }),
        ]),
    },
    // drains, blinks once, refills
    low: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=level]",
          { scaleX: [1, 0.2, 0.2, 0.2, 1], opacity: [1, 1, 0.3, 1, 1] },
          { duration: seconds, times: [0, 0.3, 0.45, 0.6, 1], ease: "easeInOut" },
        ),
    },
    zap: {
      duration: 550,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=bolt]", { scale: [1, 1.2, 1], rotate: [0, -8, 0] }, { duration: seconds, ease: ease.out }),
          animate("[data-part=spark]", blink, { duration: seconds, delay: stagger(seconds * 0.06), ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.secondary}>
        {SPARKS.map((d) => (
          <path key={d} data-part="spark" d={d} style={flash("100% 50%")} />
        ))}
      </g>
      {/* the top-right corner stays open for the bolt */}
      <path d="M13 9H3v10h15v-6" />
      <rect x="19" y="12" width="2" height="4" fill={slot.primary} stroke="none" />
      <rect data-part="level" x="6" y="12" width="9" height="4" fill={slot.accent} stroke="none" style={pivot("0% 50%")} />
      <path data-part="bolt" d="M20 2l-5 4.5h2.5L16 10l5-5h-2.5Z" fill={slot.secondary} stroke="none" style={pivot("50% 50%")} />
    </>
  ),
})
