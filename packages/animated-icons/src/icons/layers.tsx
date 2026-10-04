"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    layers: "stack" | "wave" | "swap"
  }
}

/** 2 colors: lower layers (primary), top layer (accent). */
export const Layers = createAnimatedIcon({
  name: "layers",
  category: "design",
  keywords: ["stack", "layer", "levels", "arrange", "depth", "z-index", "overlay"],
  slots: { primary: "lower layers", accent: "top layer" },
  defaultVariant: "stack",
  variants: {
    // the lower layers slide up under the top one into a tight stack, then fan back out. The bottom
    // layer travels twice as far as the middle, so the gaps shrink evenly and never close (4px to 2.5px)
    stack: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=middle]",
            { y: [0, -1.5, -1.5, 0] },
            { duration: seconds, times: [0, 0.35, 0.5, 1], ease: ["easeInOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=bottom]",
            { y: [0, -3, -3, 0] },
            { duration: seconds, times: [0, 0.35, 0.5, 1], ease: ["easeInOut", "linear", ease.overshoot] },
          ),
        ]),
    },
    // a ripple runs down the stack: each layer dips and comes back, top first (document order)
    wave: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=top], [data-part=middle], [data-part=bottom]",
          { y: [0, 1.5, 0] },
          { duration: seconds * 0.6, delay: stagger(seconds * 0.2), ease: "easeInOut" },
        ),
    },
    // the top sheet lifts off out of the frame and a fresh one drops onto the stack. It only ever
    // moves up and away from the sheet below, so the two never touch
    swap: {
      duration: 900,
      clip: true,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=top]",
          { y: [0, -9, -9, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.4, 0.5, 1], ease: [ease.in, "linear", ease.overshoot] },
        ),
    },
  },
  render: () => (
    <>
      {/* the top sheet: a full rhombus */}
      <path data-part="top" d="M12 3.5l9 4.5-9 4.5L3 8Z" stroke={slot.accent} />
      {/* two chevrons: the edges of the sheets underneath */}
      <path data-part="middle" d="M3 12l9 4.5 9-4.5" />
      <path data-part="bottom" d="M3 16l9 4.5 9-4.5" />
    </>
  ),
})
