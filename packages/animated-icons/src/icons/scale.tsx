"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    scale: "weigh" | "load" | "sway"
  }
}

/** The beam's tilt in degrees, and how far each pan rises or drops with it (7 = half the beam). */
const TILT = [0, -12, 6, -2, 0]
const LEFT = TILT.map((deg) => -7 * Math.sin((deg * Math.PI) / 180))
const RIGHT = LEFT.map((y) => -y)

/** How far a chain stretches under a load, and the pan riding its lower end (a chain is 8 tall). */
const STRETCH = [1, 1.25, 0.97, 1]
const DROP = STRETCH.map((s) => 8 * (s - 1))

/** 2 colors: stand, beam + chains (primary), pans (accent). */
export const Scale = createAnimatedIcon({
  name: "scale",
  category: "finance",
  keywords: ["balance", "justice", "law", "weigh", "fair", "compare", "equality", "rules"],
  slots: { primary: "stand + beam + chains", accent: "pans" },
  defaultVariant: "weigh",
  variants: {
    // the beam tips under the left pan's weight, swings past level and settles; the pans hang straight
    weigh: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=beam]", { rotate: TILT }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=left]", { y: LEFT }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=right]", { y: RIGHT }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // a weight lands in each pan in turn: its chains stretch and the pan dips 2px, then springs back
    load: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["left", "right"].flatMap((side, i) => {
            const timing = { duration: seconds * 0.6, delay: seconds * 0.4 * i, times: [0, 0.35, 0.75, 1], ease: "easeInOut" as const }
            return [
              animate(`[data-part=${side}] [data-part=chains]`, { scaleY: STRETCH }, timing),
              animate(`[data-part=${side}] [data-part=pan]`, { y: DROP }, timing),
            ]
          }),
        ),
    },
    // a draught: both pans swing on their chains from the beam ends while the beam holds level
    sway: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate("[data-part=hanger]", { rotate: [0, -6, 5, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <g>
      <path d="M12 3v18M7 21h10" />
      <path data-part="beam" d="M5 7h14" style={pivot("50% 50%")} />
      {/* each pan hangs from a beam end on two straight chains, and swings from that point */}
      <g data-part="left">
        <g data-part="hanger" style={pivot("50% 0%")}>
          <path data-part="chains" d="M2 15l3-8 3 8" style={pivot("50% 0%")} />
          <path data-part="pan" d="M2 15h6l-1.5 2.5h-3z" fill={slot.accent} stroke="none" />
        </g>
      </g>
      <g data-part="right">
        <g data-part="hanger" style={pivot("50% 0%")}>
          <path data-part="chains" d="M16 15l3-8 3 8" style={pivot("50% 0%")} />
          <path data-part="pan" d="M16 15h6l-1.5 2.5h-3z" fill={slot.accent} stroke="none" />
        </g>
      </g>
    </g>
  ),
})
