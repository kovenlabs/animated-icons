"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    contrast: "flip" | "spin" | "toss"
  }
}

/** 2 colors: ring (primary), dark half (accent). */
export const Contrast = createAnimatedIcon({
  name: "contrast",
  category: "design",
  keywords: ["brightness", "dark mode", "light mode", "theme", "invert", "half circle", "display", "accessibility"],
  slots: { primary: "ring", accent: "dark half" },
  defaultVariant: "flip",
  variants: {
    // the dark half swings over on the vertical diameter like a page, holds on the left, and swings home
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=half]",
          { scaleX: [1, 0, -1, -1, 0, 1] },
          { duration: seconds, times: [0, 0.18, 0.36, 0.6, 0.78, 1], ease: ["easeIn", "easeOut", "linear", "easeIn", "easeOut"] },
        ),
    },
    // the dark half sweeps a full turn round the centre, winding back a touch before it goes
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=half]",
          { rotate: [0, -25, 360] },
          { duration: seconds, times: [0, 0.22, 1], ease: ["easeOut", [0.5, 0, 0.3, 1.25]] },
        ),
    },
    // the whole dial is flipped like a coin: it hops, turns over about its vertical axis, and lands
    toss: {
      duration: 1200,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=contrast]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 1],
              ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"],
            },
          ),
          animate(
            "[data-part=contrast]",
            { y: [0, -3.5, 0, 0, 0], scaleY: [1, 1.06, 1, 0.88, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 0.8, 1], ease: ["easeOut", "easeIn", "easeOut", "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="contrast" style={pivot("50% 50%")}>
      <circle cx={12} cy={12} r={10} />
      {/* a solid half disc, 3 clear of the ring; it hinges on its straight edge, the centre line */}
      <path data-part="half" d="M12 6a6 6 0 0 1 0 12z" fill={slot.accent} stroke="none" style={pivot("0% 50%")} />
    </g>
  ),
})
