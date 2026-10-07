"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "paw-print": "step" | "beans" | "trail"
  }
}

/**
 * Four round toe beans (true circles: they are round) fanned over a solid, faceted pad. `splay` is how
 * far each toe spreads out from the pad's centre when the paw lands.
 */
const TOES = [
  { cx: 4.5, cy: 11, splay: { x: -1, y: -0.8 } },
  { cx: 8.5, cy: 5, splay: { x: -0.5, y: -1.2 } },
  { cx: 15.5, cy: 5, splay: { x: 0.5, y: -1.2 } },
  { cx: 19.5, cy: 11, splay: { x: 1, y: -0.8 } },
]

/** 2 colors: pad (primary), toe beans (accent). */
export const PawPrint = createAnimatedIcon({
  name: "paw-print",
  category: "nature",
  keywords: ["paw", "pet", "dog", "cat", "footprint", "animal", "track", "pet friendly"],
  slots: { primary: "pad", accent: "toe beans" },
  defaultVariant: "step",
  variants: {
    // the paw lifts towards you (it grows and dims a little), then stamps down with a squash and the toes
    // splay out on impact before they settle
    step: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const times = [0, 0.35, 0.52, 0.72, 1]
        return Promise.all([
          animate(
            "[data-part=paw]",
            {
              scale: [1, 1.15, 0.88, 1.03, 1],
              rotate: [0, -10, 0, 0, 0],
              opacity: [1, 0.8, 1, 1, 1],
            },
            { duration: seconds, times, ease: ["easeOut", ease.in, "easeOut", "easeInOut"] },
          ),
          ...TOES.map(({ splay }, i) =>
            animate(
              `[data-part=toe-${i}]`,
              { x: [0, 0, splay.x, 0], y: [0, 0, splay.y, 0] },
              { duration: seconds, times: [0, 0.52, 0.62, 0.85], ease: ["linear", "easeOut", "easeInOut"] },
            ),
          ),
        ])
      },
    },
    // the toe beans flex one at a time, left to right, like a cat kneading, the pad pressing as they go
    beans: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=toe]",
            { scale: [1, 1.3, 0.9, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.15), ease: "easeInOut" },
          ),
          animate(
            "[data-part=pad]",
            { scaleY: [1, 0.9, 1, 0.9, 1], scaleX: [1, 1.06, 1, 1.06, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // the print walks off through the top edge and the next one steps in from below, landing with a twist
    trail: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=paw]",
            { y: [0, -12, 12, 0], opacity: [1, 0, 0, 1], rotate: [0, 0, 14, 0] },
            { duration: seconds, times: [0, 0.4, 0.44, 1], ease: [ease.in, "linear", ease.out] },
          ),
          ...TOES.map(({ splay }, i) =>
            animate(
              `[data-part=toe-${i}]`,
              { x: [0, 0, splay.x, 0], y: [0, 0, splay.y, 0] },
              { duration: seconds, times: [0, 0.8, 0.88, 1], ease: ["linear", "easeOut", "easeInOut"] },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="paw" style={pivot("50% 50%")}>
      <path data-part="pad" d="M7 17l3.5-5h3L17 17v2.5L15 21H9l-2-1.5z" fill={slot.primary} style={pivot("50% 100%")} />
      <g fill={slot.accent} stroke="none">
        {TOES.map(({ cx, cy }, i) => (
          <g key={cx} data-part={`toe-${i}`}>
            <circle data-part="toe" cx={cx} cy={cy} r="2.5" style={pivot("50% 50%")} />
          </g>
        ))}
      </g>
    </g>
  ),
})
