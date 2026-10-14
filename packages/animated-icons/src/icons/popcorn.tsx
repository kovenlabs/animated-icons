"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    popcorn: "pop" | "burst" | "shake"
  }
}

/** A faceted kernel: an octagon of radius `r` round (cx, cy). */
function kernel(cx: number, cy: number, r: number) {
  const k = r * 0.42
  const pts = [
    [cx - k, cy - r],
    [cx + k, cy - r],
    [cx + r, cy - k],
    [cx + r, cy + k],
    [cx + k, cy + r],
    [cx - k, cy + r],
    [cx - r, cy + k],
    [cx - r, cy - k],
  ]
  return `M${pts.map(([x, y]) => `${+x!.toFixed(2)} ${+y!.toFixed(2)}`).join(" ")}Z`
}

/** Three kernels heaped on the rim, the middle one highest. */
const KERNELS = [
  { cx: 7.5, cy: 7.5 },
  { cx: 12, cy: 5 },
  { cx: 16.5, cy: 7.5 },
]

/** Bits flung out of the bucket in a fan for `burst`. */
const FAN = [
  { x: -7, y: -3 },
  { x: -4, y: -7 },
  { x: 4, y: -7 },
  { x: 7, y: -3 },
]

/** The rim (y 10) sits 11.5 above the base the bucket stretches from. */
const RIM = 11.5

/** 2 colors: bucket (primary), popcorn (accent). */
export const Popcorn = createAnimatedIcon({
  name: "popcorn",
  category: "food",
  keywords: ["cinema", "movie", "snack", "theater", "film", "food", "corn"],
  slots: { primary: "bucket", accent: "popcorn" },
  defaultVariant: "pop",
  variants: {
    // the kernels pop out of the heap one after the other, somersaulting up out of the frame and back,
    // each landing with a squash that jolts the bucket
    pop: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=kernel]",
            {
              y: [0, -6, 0, 0],
              rotate: [0, 200, 360, 360],
              scaleY: [1, 1.15, 0.72, 1],
              scaleX: [1, 0.9, 1.22, 1],
            },
            {
              duration: seconds * 0.55,
              times: [0, 0.42, 0.72, 1],
              ease: ["easeOut", ease.in, ease.overshoot],
              delay: stagger(seconds * 0.18),
            },
          ),
          animate(
            "[data-part=bucket]",
            { scaleY: [1, 1, 0.92, 1, 0.92, 1, 0.92, 1, 1] },
            { duration: seconds, times: [0, 0.38, 0.42, 0.5, 0.6, 0.68, 0.78, 0.86, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the bucket crouches and springs, flinging a fan of popcorn out of the top while the heap puffs up
    burst: {
      duration: 1000,
      clip: true,
      run: ({ animate, seconds }) => {
        const scaleY = [1, 0.85, 1.12, 0.96, 1]
        const options = { duration: seconds, times: [0, 0.25, 0.45, 0.7, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=bucket]", { scaleY, scaleX: [1, 1.1, 0.94, 1.02, 1] }, options),
          // the heap rides the rim up and down, swelling as it is flung
          animate(
            "[data-part=kernel]",
            { y: scaleY.map((s) => RIM * (1 - s)), scale: [1, 0.95, 1.3, 0.95, 1] },
            options,
          ),
          ...FAN.map((to, i) =>
            animate(
              `[data-part=bit][data-i="${i}"]`,
              { x: [0, to.x], y: [0, to.y], rotate: [0, 180], ...blink },
              { duration: seconds * 0.5, delay: seconds * (0.4 + i * 0.03), ease: "easeOut" },
            ),
          ),
        ])
      },
    },
    // given a shake: the bucket rocks on its base and the popcorn hops about inside it
    shake: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=popcorn]",
            { rotate: [0, -10, 9, -7, 4, 0] },
            { duration: seconds, times: [0, 0.18, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=kernel]",
            { y: [0, -2.5, 0, -1.5, 0], rotate: [0, -20, 0, 15, 0] },
            { duration: seconds * 0.7, ease: "easeInOut", delay: stagger(seconds * 0.08) },
          ),
        ]),
    },
  },
  render: () => (
    // the popcorn's box runs 5..19 × 2.5..21.5: it rocks on its base at 50% 100%
    <g data-part="popcorn" style={pivot("50% 100%")}>
      <g fill={slot.accent} stroke="none">
        {FAN.map((_, i) => (
          <rect key={i} data-part="bit" data-i={i} x="11" y="6" width="2" height="2" style={flash()} />
        ))}
        {KERNELS.map(({ cx, cy }) => (
          <path key={cx} data-part="kernel" d={kernel(cx, cy, 2.5)} style={pivot("50% 50%")} />
        ))}
      </g>
      {/* a tapered, striped bucket */}
      <g data-part="bucket" style={pivot("50% 100%")}>
        <path d="M5 10h14l-2 11.5H7Z" />
        <path d="M10 10l.5 11.5M14 10l-.5 11.5" />
      </g>
    </g>
  ),
})
