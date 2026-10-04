"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    building: "lights" | "open" | "settle"
  }
}

/** Two columns of windows on three floors, listed from the ground floor up. */
const WINDOWS = [
  [8, 13],
  [14, 13],
  [8, 9],
  [14, 9],
  [8, 5],
  [14, 5],
] as const

/** 2 colors: block (primary), windows + door (accent). */
export const Building = createAnimatedIcon({
  name: "building",
  category: "navigation",
  keywords: ["office", "block", "tower", "campus", "headquarters", "company", "premises", "facility"],
  slots: { primary: "block", accent: "windows + door" },
  defaultVariant: "lights",
  variants: {
    // the lights go out floor by floor from the ground, the whole block stands dark for a beat, and they
    // come back on in the same order
    lights: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=window]",
          { opacity: [1, 0, 0, 1] },
          {
            duration: seconds * 0.6,
            delay: (i: number) => Math.floor(i / 2) * seconds * 0.12,
            times: [0, 0.15, 0.65, 1],
            ease: "easeInOut",
          },
        ),
    },
    // the door swings half open on its hinge, turning away into the dark, and closes again
    open: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=door]",
          { scaleX: [1, 0.5, 0.5, 1], opacity: [1, 0.3, 0.3, 1] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // the block sinks onto its foundations and stands back up straight
    settle: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=block]",
          { scaleY: [1, 0.9, 1.04, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <path d="M2 22h20" />
      <g data-part="block" style={pivot("50% 100%")}>
        {/* a tall block standing on the ground line */}
        <path d="M5 22V2h14v20" />
        <g fill={slot.accent} stroke="none">
          {WINDOWS.map(([x, y]) => (
            <rect key={`${x}-${y}`} data-part="window" x={x} y={y} width="2" height="2" />
          ))}
        </g>
        {/* a 4 × 4 doorway, 2px clear of the windows above and of the ground line inside */}
        <path data-part="door" d="M10 22v-4h4v4" stroke={slot.accent} style={pivot("0% 100%")} />
      </g>
    </>
  ),
})
