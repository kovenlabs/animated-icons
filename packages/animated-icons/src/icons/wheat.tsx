"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    wheat: "sway" | "ripen" | "thresh"
  }
}

/**
 * The grains of the ear, listed from the bottom up: pairs leave the stalk at 40° (each a slim
 * rhombus touching the stalk with its near tip, 2 clear of the pair above), crowned by an upright
 * grain. `out` is the way each one is flung when the ear is threshed, `hinge` its near tip.
 */
const GRAINS = [19.5, 14, 8.5]
  .flatMap((y) => [
    { d: `M11 ${y}l-1.5-2.5-2.75-1 1.5 2.5Z`, hinge: "100% 100%", out: { x: -1.5, y: -0.9 } },
    { d: `M13 ${y}l2.75-1 1.5-2.5-2.75 1Z`, hinge: "0% 100%", out: { x: 1.5, y: -0.9 } },
  ])
  .concat({ d: "M12 2l1.1 2L12 6l-1.1-2Z", hinge: "50% 100%", out: { x: 0, y: -1 } })

/** 2 colors: stalk (primary), grains (accent). */
export const Wheat = createAnimatedIcon({
  name: "wheat",
  category: "nature",
  keywords: ["grain", "harvest", "crop", "farm", "agriculture", "gluten", "bread", "cereal"],
  slots: { primary: "stalk", accent: "grains" },
  defaultVariant: "sway",
  variants: {
    // a gust bends the ear over on its stalk and it swings back and forth to a stop, every grain
    // fluttering in the wind a beat after the one below it
    sway: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ear]",
            { skewX: [0, -12, 9, -5, 2, 0] },
            { duration: seconds, times: [0, 0.22, 0.46, 0.66, 0.84, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=grain]",
            { rotate: [0, 12, -8, 4, 0] },
            { duration: seconds * 0.7, delay: stagger(seconds * 0.04, { startDelay: seconds * 0.1 }), ease: "easeInOut" },
          ),
        ]),
    },
    // it grows: the stalk shoots up out of the ground, then the grains burst open up the ear, one pair
    // after another, and the crown pops last
    ripen: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stalk]",
            { scaleY: [0, 1.06, 1] },
            { duration: seconds * 0.4, times: [0, 0.75, 1], ease: ["easeOut", "easeInOut"] },
          ),
          ...GRAINS.map((_, i) => {
            const start = 0.22 + i * 0.09
            return animate(
              `[data-part=grain]:nth-of-type(${i + 1})`,
              { scale: [0, 0, 1.4, 0.9, 1] },
              { duration: seconds, times: [0, start, start + 0.12, start + 0.2, 1], ease: ["linear", ease.out, "easeInOut", "easeOut"] },
            )
          }),
        ]),
    },
    // threshed: the ear is beaten down onto its stalk, then springs up tall as every grain is shaken
    // loose, flung outwards, and snaps back into place
    thresh: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ear]",
            { scaleY: [1, 0.86, 1.04, 0.98, 1], scaleX: [1, 1.08, 0.96, 1.01, 1] },
            { duration: seconds * 0.7, times: [0, 0.25, 0.55, 0.8, 1], ease: ["easeIn", ease.out, "easeInOut", "easeInOut"] },
          ),
          ...GRAINS.map(({ out }, i) =>
            animate(
              `[data-part=grain]:nth-of-type(${i + 1})`,
              { x: [0, 0, out.x, 0, 0], y: [0, 0, out.y, 0, 0], rotate: [0, 0, out.x * 6, -out.x * 3, 0] },
              { duration: seconds, times: [0, 0.25, 0.45, 0.72, 1], ease: ["linear", ease.out, ease.overshoot, "easeInOut"] },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="ear" style={pivot("50% 100%")}>
      <path data-part="stalk" d="M12 21.5V6" style={pivot("50% 100%")} />
      <g fill={slot.accent} stroke="none">
        {GRAINS.map(({ d, hinge }) => (
          <path key={d} data-part="grain" d={d} style={pivot(hinge)} />
        ))}
      </g>
    </g>
  ),
})
