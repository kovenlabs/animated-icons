"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    factory: "smoke" | "lights" | "rumble"
  }
}

/** Three windows along the shop floor, left to right, on the same 2px grid as the walls. */
const WINDOWS = [6, 11, 16] as const

/** 2 colors: factory (primary), windows + smoke (accent). The smoke only exists in motion. */
export const Factory = createAnimatedIcon({
  name: "factory",
  category: "navigation",
  keywords: ["industry", "manufacturing", "plant", "production", "industrial", "mill", "works", "warehouse"],
  slots: { primary: "factory", accent: "windows + smoke" },
  defaultVariant: "smoke",
  variants: {
    // two puffs of smoke rise from the chimney and drift off downwind, over the roof
    smoke: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=smoke]",
          { opacity: [0, 1, 0], scale: [0.6, 1.3, 1.6], x: [0, 3], y: [0, -2] },
          { duration: seconds * 0.7, delay: stagger(seconds * 0.3), ease: "easeOut" },
        ),
    },
    // the shift ends and the floor goes dark at once, then the windows come back on one by one, left to right
    lights: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          WINDOWS.map((_, i) =>
            animate(
              `[data-part=window]:nth-of-type(${i + 1})`,
              { opacity: [1, 0, 0, 1, 1], scale: [1, 1, 1, 1.25, 1] },
              {
                duration: seconds,
                times: [0, 0.12, 0.35 + i * 0.2, 0.45 + i * 0.2, 1],
                ease: "easeInOut",
              },
            ),
          ),
        ),
    },
    // the machines start up: the whole works shudders side to side and settles
    rumble: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=factory]", { x: [0, -1, 1, -1, 1, -0.5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      {/* the smoke waits just above the chimney's mouth, centred on it */}
      <g fill={slot.accent} stroke="none">
        {[0, 1].map((i) => (
          <rect key={i} data-part="smoke" x="5" y="3" width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="factory">
        {/* a chimney stack on the left, then a sawtooth roof of two north-light bays */}
        <path d="M3 21V6h6v7l6-4v4l6-4v12z" />
        {/* 2px clear of the walls, the floor and the roof's valleys */}
        <g fill={slot.accent} stroke="none">
          {WINDOWS.map((x) => (
            <rect key={x} data-part="window" x={x} y="16" width="2" height="2" style={pivot("50% 50%")} />
          ))}
        </g>
      </g>
    </>
  ),
})
