"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    flower: "bloom" | "flip" | "spin"
  }
}

/** The flower's centre: a little low, so the five petals sit evenly in the frame. */
const C = { x: 12, y: 12.5 }

/**
 * Five faceted petals in one outline, the first pointing up. Each petal runs out from a notch near the
 * centre, widens, and ends in a flat, two-cornered tip. Points are [angle off the petal's axis, radius].
 */
const PETAL: Array<[number, number]> = [
  [-36, 5],
  [-22, 8.5],
  [-9, 10],
  [9, 10],
  [22, 8.5],
]
const PETALS = `M${Array.from({ length: 5 }, (_, k) =>
  PETAL.map(([offset, r]) => {
    const angle = ((-90 + 72 * k + offset) * Math.PI) / 180
    return `${(C.x + r * Math.cos(angle)).toFixed(2)} ${(C.y + r * Math.sin(angle)).toFixed(2)}`
  }).join(" "),
).join(" ")}z`

/** 2 colors: petals (primary), centre (accent). */
export const Flower = createAnimatedIcon({
  name: "flower",
  category: "nature",
  keywords: ["blossom", "bloom", "daisy", "spring", "garden", "plant", "floral", "nature"],
  slots: { primary: "petals", accent: "centre" },
  defaultVariant: "bloom",
  variants: {
    // the petals curl shut into a bud and burst open past full size with a twist, then the centre pops
    bloom: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=petals]",
            { scale: [1, 0.3, 0.3, 1.22, 0.95, 1], rotate: [0, -50, -50, 14, -4, 0] },
            { duration: seconds, times: [0, 0.22, 0.32, 0.62, 0.82, 1], ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"] },
          ),
          // shrinks with the petals so it always stays inside them, then pops once they're open
          animate(
            "[data-part=centre]",
            { scale: [1, 0.3, 0.3, 1, 1.45, 1] },
            { duration: seconds, times: [0, 0.22, 0.32, 0.62, 0.8, 1], ease: [ease.in, "linear", ease.out, "easeOut", ease.overshoot] },
          ),
        ]),
    },
    // tossed up, it turns a full circle on a vertical axis like a coin and lands with a squash
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=flower]",
          {
            y: [0, -3, 0, 0, 0],
            scaleX: [1, -1, 1, 1, 1],
            scaleY: [1, 1, 1, 0.86, 1],
          },
          { duration: seconds, times: [0, 0.35, 0.7, 0.8, 1], ease: ["easeOut", "easeIn", "easeOut", ease.overshoot] },
        ),
    },
    // a pinwheel whirl: one full turn that winds up and coasts to a stop, swelling as it spins
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=petals]", { rotate: [0, -12, 360] }, { duration: seconds, times: [0, 0.2, 1], ease: ["easeOut", ease.out] }),
          animate(
            "[data-part=petals], [data-part=centre]",
            { scale: [1, 0.92, 1.15, 1] },
            { duration: seconds, times: [0, 0.2, 0.5, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="flower" style={pivot("50% 100%")}>
      <path data-part="petals" d={PETALS} style={pivot("50% 52.6%")} />
      {/* the centre is round: a true circle */}
      <circle data-part="centre" cx={C.x} cy={C.y} r="2.5" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </g>
  ),
})
