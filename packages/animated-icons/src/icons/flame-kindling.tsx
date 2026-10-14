"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "flame-kindling": "ignite" | "flicker" | "roar"
  }
}

/** A faceted flame leaning on a lick to its left, standing 4 clear of the logs. */
const FLAME = "M12 4l3.5 4 1 3-1.5 3H9l-1.5-3 1-2.5 2 1.5z"

/** Sparks either side of the flame, listed in the order they fly. */
const SPARKS = [
  { x: 4, y: 8, to: { x: -1, y: -3 } },
  { x: 18, y: 4.5, to: { x: 1, y: -2 } },
  { x: 18.5, y: 10, to: { x: 1, y: -2.5 } },
] as const

/** 2 colors: logs (primary), flame and sparks (accent). */
export const FlameKindling = createAnimatedIcon({
  name: "flame-kindling",
  family: "flame",
  category: "nature",
  keywords: ["campfire", "bonfire", "fire", "kindling", "firewood", "camping", "logs", "burn"],
  slots: { primary: "logs", accent: "flame + sparks" },
  defaultVariant: "ignite",
  variants: {
    // a spark catches: the flame bursts up out of the logs stretched tall, sways as it settles, and
    // the logs sink under the sudden heat while sparks spit out to the sides
    ignite: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flame]",
            { scaleY: [0, 1.2, 0.9, 1.05, 1], scaleX: [0.4, 0.85, 1.12, 0.97, 1], skewX: [0, -8, 6, -3, 0] },
            { duration: seconds * 0.85, times: [0, 0.3, 0.55, 0.78, 1], ease: [ease.out, "easeInOut", "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=logs]",
            { y: [0, 0, 0.8, 0], scaleX: [1, 1, 1.04, 1] },
            { duration: seconds * 0.6, times: [0, 0.2, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=spark]",
            { opacity: [0, 1, 0], scale: [0.5, 1.2, 0.6], y: [0, -2.5] },
            { duration: seconds * 0.5, delay: stagger(seconds * 0.1, { startDelay: seconds * 0.2 }), ease: "easeOut" },
          ),
        ]),
    },
    // the fire licks from side to side: the flame leans and stretches on its base like a dancer, and
    // sparks drift up off it one after another
    flicker: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flame]",
            {
              skewX: [0, -10, 8, -6, 4, 0],
              scaleY: [1, 1.15, 0.9, 1.12, 0.95, 1],
              scaleX: [1, 0.9, 1.1, 0.92, 1.04, 1],
            },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=spark]",
            { opacity: [0, 1, 0], y: [0, -3], scale: [1, 0.5] },
            { duration: seconds * 0.45, delay: stagger(seconds * 0.22), ease: "easeOut" },
          ),
        ]),
    },
    // the fire roars: the whole pile jumps as the flame crouches, then the flame flares up twice its
    // width, flinging sparks out in every direction, and shrinks back down
    roar: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=fire]",
            { y: [0, 0.6, -1.5, 0, 0], scaleX: [1, 1.04, 0.97, 1.03, 1] },
            { duration: seconds * 0.5, times: [0, 0.25, 0.55, 0.85, 1], ease: ["easeOut", ease.out, ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=flame]",
            { scaleY: [1, 0.7, 0.85, 1.2, 0.92, 1], scaleX: [1, 1.2, 1.1, 0.88, 1.06, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.62, 0.82, 1], ease: "easeInOut" },
          ),
          ...SPARKS.map(({ to }, i) =>
            animate(
              `[data-part=spark]:nth-of-type(${i + 1})`,
              { opacity: [0, 0, 1, 0], x: [0, 0, to.x, to.x * 1.5], y: [0, 0, to.y, to.y * 1.5], scale: [0.5, 0.5, 1.3, 0.6] },
              { duration: seconds, times: [0, 0.5, 0.7, 1], ease: "easeOut" },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="fire" style={pivot("50% 100%")}>
      <path data-part="logs" d="M4 21 20 17M4 17l16 4" style={pivot("50% 50%")} />
      <path data-part="flame" d={FLAME} stroke={slot.accent} style={pivot("50% 100%")} />
      <g fill={slot.accent} stroke="none">
        {SPARKS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} data-part="spark" x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
    </g>
  ),
})
