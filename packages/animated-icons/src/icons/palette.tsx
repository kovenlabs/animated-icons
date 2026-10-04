"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    palette: "dab" | "tilt"
  }
}

/** Top-left corners of the four 3×3 paint dots, in an arc from the thumb side round to the top. */
const DOTS = [
  { x: 5, y: 11 },
  { x: 7, y: 6 },
  { x: 12, y: 5 },
  { x: 16, y: 10 },
] as const

/** 2 colors: palette (primary), paint dots (accent). */
export const Palette = createAnimatedIcon({
  name: "palette",
  category: "design",
  keywords: ["paint", "color", "colour", "theme", "art", "swatches", "appearance"],
  slots: { primary: "palette", accent: "paint dots" },
  defaultVariant: "dab",
  variants: {
    // each dot of paint is dabbed in turn: it shrinks away and pops back a little proud
    dab: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=dot]",
          { scale: [1, 0, 1.2, 1] },
          { duration: seconds * 0.55, times: [0, 0.35, 0.75, 1], delay: stagger(seconds * 0.15), ease: "easeOut" },
        ),
    },
    // held by the thumb notch, the palette tips one way, then the other, and settles
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=palette]", { rotate: [0, -12, 8, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <g data-part="palette" style={pivot("75% 80%")}>
      {/* an octagon with a square bite out of the lower right, where the thumb goes */}
      <path d="M7 2h10l5 5v6l-3 3h-5v6H7l-5-5V7Z" />
      <g fill={slot.accent} stroke="none">
        {DOTS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} data-part="dot" x={x} y={y} width="3" height="3" style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
