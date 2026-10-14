"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    hotel: "lights" | "revolve" | "bounce"
  }
}

/** Two columns of lit rooms, listed bottom row first so the lights come on floor by floor. */
const WINDOWS = [
  [8, 9],
  [14, 9],
  [8, 5],
  [14, 5],
] as const

/** 2 colors: building and canopy (primary), lit rooms and door (accent). */
export const Hotel = createAnimatedIcon({
  name: "hotel",
  category: "navigation",
  keywords: ["inn", "motel", "lodging", "stay", "booking", "travel", "accommodation", "resort"],
  slots: { primary: "building + canopy", accent: "rooms + door" },
  defaultVariant: "lights",
  variants: {
    // night falls and every room goes dark, then the lights snap on floor by floor, each window
    // popping a size too big before it settles
    lights: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=window]",
            { scale: [1, 0, 0, 1.6, 1], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds * 0.75, times: [0, 0.2, 0.4, 0.7, 1], delay: stagger(seconds * 0.08), ease: "easeOut" },
          ),
          animate(
            "[data-part=door]",
            { scaleY: [1, 1, 0.6, 1] },
            { duration: seconds, times: [0, 0.55, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // a guest pushes through the revolving door: it whirls edge-on three times under a canopy that
    // jumps with each turn
    revolve: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=door]",
            { scaleX: [1, 0.1, 1, 0.1, 1, 0.1, 1] },
            { duration: seconds * 0.85, ease: "easeInOut" },
          ),
          animate(
            "[data-part=awning]",
            { scaleX: [1, 1.2, 1, 1.2, 1, 1.2, 1], y: [0, -1, 0, -1, 0, -1, 0] },
            { duration: seconds * 0.85, ease: "easeInOut" },
          ),
          animate(
            "[data-part=window]",
            { scale: [1, 1, 1.4, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.06, { startDelay: seconds * 0.55 }), ease: "easeOut" },
          ),
        ]),
    },
    // the whole block squashes down on its foundations and springs back, the rooms bouncing a beat late
    bounce: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=block]",
            { scaleY: [1, 0.84, 1.02, 0.97, 1], scaleX: [1, 1.1, 0.96, 1.02, 1] },
            { duration: seconds, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=window]",
            { y: [0, 0, 1, -1, 0] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.7, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path d="M2 22h20" />
      <g data-part="block" style={pivot("50% 100%")}>
        <path d="M5 22V2h14v20" />
        <g fill={slot.accent} stroke="none">
          {WINDOWS.map(([x, y]) => (
            <rect key={`${x}-${y}`} data-part="window" x={x} y={y} width="2" height="2" style={pivot("50% 50%")} />
          ))}
        </g>
        {/* a canopy over the entrance, 2px clear of the rooms and the walls */}
        <path data-part="awning" d="M8 16h8" style={pivot("50% 50%")} />
        <path data-part="door" d="M10 22v-4h4v4" stroke={slot.accent} style={pivot("50% 100%")} />
      </g>
    </>
  ),
})
