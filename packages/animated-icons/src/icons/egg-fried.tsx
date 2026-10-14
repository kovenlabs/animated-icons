"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "egg-fried": "flip" | "jiggle" | "sizzle"
  }
}

/** 2 colors: white (primary), yolk (accent). */
export const EggFried = createAnimatedIcon({
  name: "egg-fried",
  family: "egg",
  category: "commerce",
  keywords: ["fried egg", "breakfast", "sunny side up", "brunch", "yolk", "cooking", "pan", "food"],
  slots: { primary: "white", accent: "yolk" },
  defaultVariant: "flip",
  variants: {
    // flipped in the pan: it crouches, flies away from you turning a full somersault (the yolk vanishes
    // while its plain back shows), and lands with a squash that sets the yolk wobbling
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=egg]",
            { scaleY: [1, 1, -1, 1, 1], scale: [1, 1, 0.78, 1, 1] },
            { duration: seconds, times: [0, 0.1, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=yolk]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.24, 0.26, 0.54, 0.56, 1], ease: "linear" },
          ),
          animate(
            "[data-part=pan]",
            { scaleY: [1, 0.92, 1, 1, 0.9, 1.03, 1], scaleX: [1, 1.04, 1, 1, 1.05, 0.98, 1] },
            { duration: seconds, times: [0, 0.08, 0.16, 0.7, 0.78, 0.88, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=yolk]",
            { scaleX: [1, 1, 1.2, 0.9, 1.05, 1], scaleY: [1, 1, 0.82, 1.1, 0.96, 1] },
            { duration: seconds, times: [0, 0.72, 0.8, 0.88, 0.94, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the yolk is poked: it dents in, bounces out past its size and wobbles, and a ripple runs through the white
    jiggle: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=yolk]",
            { scale: [1, 0.65, 1.25, 0.9, 1.06, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=white]",
            { scale: [1, 1, 1.04, 0.98, 1.01, 1] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // spitting in hot fat: the white rattles in the pan while the yolk quivers, squashing one way then the other
    sizzle: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=white]",
            {
              x: [0, -0.6, 0.6, -0.6, 0.6, -0.4, 0.4, 0],
              rotate: [0, -3, 3, -3, 3, -2, 2, 0],
              scaleX: [1, 1.03, 0.97, 1.03, 0.97, 1.02, 0.99, 1],
              scaleY: [1, 0.97, 1.03, 0.97, 1.03, 0.98, 1.01, 1],
            },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=yolk]",
            { scaleX: [1, 1.15, 0.88, 1.12, 0.9, 1.05, 1], scaleY: [1, 0.88, 1.15, 0.9, 1.12, 0.96, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="pan" style={pivot("50% 100%")}>
      <g data-part="egg" style={pivot("50% 50%")}>
        {/* an irregular faceted white, spread wider at the bottom right */}
        <path
          data-part="white"
          d="M8 3.5l6-.5 4.5 2.5L21 10l-1.5 5 1 3.5L16 21l-6-.5-4.5-1.5L3 14l1-5.5Z"
          style={pivot("50% 50%")}
        />
        {/* the yolk is genuinely round */}
        <circle data-part="yolk" cx="12" cy="12" r="3.5" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
