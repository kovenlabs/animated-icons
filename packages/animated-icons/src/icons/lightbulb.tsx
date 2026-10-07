"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    lightbulb: "glow" | "flicker" | "hop"
  }
}

/** Rays beside and above the glass, each drawn from its inner end outward (the end it scales from). */
const RAYS = [
  { d: "M4 8H2", origin: "100% 50%" },
  { d: "M5.5 3.5 4 2", origin: "100% 100%" },
  { d: "M20 8h2", origin: "0% 50%" },
  { d: "M18.5 3.5 20 2", origin: "0% 100%" },
]

/** 2 colors: bulb (primary), light rays (accent). */
export const Lightbulb = createAnimatedIcon({
  name: "lightbulb",
  category: "education",
  keywords: ["idea", "tip", "hint", "insight", "light", "bulb", "innovation", "creative"],
  slots: { primary: "bulb", accent: "light rays" },
  defaultVariant: "glow",
  variants: {
    // switched on: the glass swells a touch from its neck and the rays burst out around it
    glow: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=glass]", { scale: [1, 1.08, 1] }, { duration: seconds * 0.7, ease: "easeInOut" }),
          animate("[data-part=ray]", blink, { duration: seconds * 0.8, delay: seconds * 0.15, ease: "easeOut" }),
        ]),
    },
    // a loose filament: the glass stutters out twice, then catches and the rays blink on
    flicker: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glass]",
            { opacity: [1, 0.2, 1, 0.5, 0.15, 1] },
            { duration: seconds * 0.6, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "linear" },
          ),
          animate("[data-part=ray]", blink, { duration: seconds * 0.4, delay: seconds * 0.6, ease: "easeOut" }),
        ]),
    },
    // a eureka hop that lands with a squash
    hop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bulb]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {RAYS.map(({ d, origin }) => (
          <path key={d} data-part="ray" d={d} style={flash(origin)} />
        ))}
      </g>
      <g data-part="bulb" style={pivot("50% 100%")}>
        {/* the glass is round: a true arc over the top, straight flanks down to a flat neck */}
        <path data-part="glass" d="M9 14v-2A5 5 0 1 1 15 12v2Z" style={pivot("50% 100%")} />
        {/* the screw base: a collar and a narrower tip */}
        <path d="M9 18h6M10 22h4" />
      </g>
    </>
  ),
})
