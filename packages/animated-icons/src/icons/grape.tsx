"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    grape: "twist" | "swing" | "pop"
  }
}

/** Six grapes stacked 3-2-1 under the stem, 2 clear of each other, listed top row first. */
const GRAPES = [
  { cx: 6, cy: 7.5 },
  { cx: 12, cy: 7.5 },
  { cx: 18, cy: 7.5 },
  { cx: 9, cy: 13 },
  { cx: 15, cy: 13 },
  { cx: 12, cy: 18.5 },
]

/**
 * The bunch twisting on its stem, as angles about the vertical axis through x = 12. A grape `dx` off the
 * axis slides to dx·cos θ, and comes towards you by dx·sin θ: it swells as it nears, shrinks and dims as
 * it turns away. The twist stays within ±32°, so no grape ever passes behind another or closes the gap to its neighbour.
 */
const THETA = [0, 32, -28, 15, -5, 0]
const TWIST_TIMES = [0, 0.22, 0.5, 0.72, 0.88, 1]
const rad = (deg: number) => (deg * Math.PI) / 180
function twist(dx: number) {
  const depth = THETA.map((t) => dx * Math.sin(rad(t)))
  return {
    x: THETA.map((t) => dx * (Math.cos(rad(t)) - 1)),
    scale: depth.map((z) => 1 + 0.035 * z),
    opacity: depth.map((z) => 1 + 0.06 * Math.min(0, z)),
  }
}
const OFFSETS = [-6, -3, 3, 6] as const

/** 2 colors: stem and leaf (primary), grapes (accent). */
export const Grape = createAnimatedIcon({
  name: "grape",
  category: "food",
  keywords: ["grapes", "fruit", "bunch", "vine", "wine", "berry", "food"],
  slots: { primary: "stem + leaf", accent: "grapes" },
  defaultVariant: "twist",
  variants: {
    // the bunch twists on its stem one way and the other: grapes coming round to the front swell, those
    // going round the back shrink and dim, and the leaf foreshortens with the turn
    twist: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, times: TWIST_TIMES, ease: "easeInOut" as const }
        return Promise.all([
          ...OFFSETS.map((dx) => animate(`[data-part=grape][data-dx="${dx}"]`, twist(dx), options)),
          animate("[data-part=leaf]", { scaleX: THETA.map((t) => Math.cos(rad(t))) }, options),
        ])
      },
    },
    // swung from the top of the stem like a pendulum, the leaf flapping against the swing
    swing: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=bunch]", { rotate: [0, 18, -14, 8, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=leaf]",
            { rotate: [0, -22, 18, -10, 4, 0] },
            { duration: seconds, delay: seconds * 0.08, ease: "easeInOut" },
          ),
        ]),
    },
    // the grapes swell and pop one after the other, top row down, and the bunch bounces on its stem
    pop: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=grape]",
            { scale: [1, 1.22, 0.75, 1.08, 1] },
            {
              duration: seconds * 0.5,
              times: [0, 0.35, 0.6, 0.8, 1],
              ease: ["easeOut", ease.in, "easeOut", "easeInOut"],
              delay: stagger(seconds * 0.09),
            },
          ),
          animate(
            "[data-part=bunch]",
            { scaleY: [1, 1.06, 0.94, 1.03, 1], scaleX: [1, 0.97, 1.04, 0.99, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.82, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // the bunch's box runs 4..20 × 2..20.5, so the stem's top (12, 2) sits at 50% 0%
    <g data-part="bunch" style={pivot("50% 0%")}>
      <path d="M12 2v3.5" />
      <path data-part="leaf" d="M12 4l2-2h4l-2 2Z" fill={slot.primary} stroke="none" style={pivot("0% 100%")} />
      <g fill={slot.accent} stroke="none">
        {GRAPES.map(({ cx, cy }) => (
          <circle
            key={`${cx}-${cy}`}
            data-part="grape"
            data-dx={cx - 12}
            cx={cx}
            cy={cy}
            r="2"
            style={pivot("50% 50%")}
          />
        ))}
      </g>
    </g>
  ),
})
