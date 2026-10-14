"use client"

import { stagger, type Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "ferris-wheel": "spin" | "rock" | "lights"
  }
}

/** Four cabins on the rim at the spoke ends (top, right, bottom, left), listed clockwise. */
const CABINS = [
  [12, 3],
  [19, 10],
  [12, 17],
  [5, 10],
] as const

/** 2 colors: wheel and stand (primary), cabins (accent). */
export const FerrisWheel = createAnimatedIcon({
  name: "ferris-wheel",
  category: "navigation",
  keywords: ["fair", "carnival", "amusement park", "funfair", "ride", "big wheel", "theme park", "entertainment"],
  slots: { primary: "wheel + stand", accent: "cabins" },
  defaultVariant: "spin",
  variants: {
    // winds up, turns a full revolution and coasts past the stop before settling back, the cabins
    // swinging level the whole way round
    spin: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, times: [0, 0.12, 0.85, 1], ease: ["easeOut", ease.inOut, "easeInOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=wheel]", { rotate: [0, -15, 375, 360] }, options),
          animate("[data-part=cabin]", { rotate: [0, 30, -390, -360] }, options),
        ])
      },
    },
    // rocks back and forth at the top of the ride, the cabins swinging on their hangers a beat behind
    rock: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=wheel]", { rotate: [0, 40, -28, 14, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=cabin]",
            { rotate: [0, -55, 42, -22, 8, 0] },
            { duration: seconds, times: [0, 0.27, 0.52, 0.74, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the wheel ticks round a quarter turn while its cabins light up one after another, popping big
    lights: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=wheel]",
            { rotate: [0, 96, 90, 90, 0] },
            { duration: seconds, times: [0, 0.4, 0.6, 0.999, 1], ease: [ease.inOut, "easeInOut", "linear", snap] },
          ),
          animate(
            "[data-part=cabin]",
            { rotate: [0, -96, -90, -90, 0] },
            { duration: seconds, times: [0, 0.4, 0.6, 0.999, 1], ease: [ease.inOut, "easeInOut", "linear", snap] },
          ),
          animate(
            "[data-part=lamp]",
            { scale: [1, 1.7, 1], opacity: [1, 0.4, 1] },
            { duration: seconds * 0.35, delay: stagger(seconds * 0.12, { startDelay: seconds * 0.45 }), ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* an A-frame stand behind the wheel: its legs aim at the hub and show only below the rim */}
      <path d="M7.8 15.6 3 22M16.2 15.6 21 22" />
      <g data-part="wheel" style={pivot("50% 50%")}>
        <circle cx="12" cy="10" r="7" />
        <path d="M12 3v14M5 10h14" />
        <g fill={slot.accent} stroke="none">
          {CABINS.map(([x, y]) => (
            <g key={`${x}-${y}`} data-part="cabin" style={pivot("50% 50%")}>
              <rect data-part="lamp" x={x - 1.5} y={y - 1.5} width="3" height="3" style={pivot("50% 50%")} />
            </g>
          ))}
        </g>
      </g>
    </>
  ),
})
