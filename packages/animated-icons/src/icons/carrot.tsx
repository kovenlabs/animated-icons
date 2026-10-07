"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    carrot: "pluck" | "rustle" | "twirl"
  }
}

/** 2 colors: root (primary), leaves (accent). */
export const Carrot = createAnimatedIcon({
  name: "carrot",
  category: "nature",
  keywords: ["vegetable", "veggie", "food", "healthy", "garden", "harvest", "vegan", "rabbit"],
  slots: { primary: "root", accent: "leaves" },
  defaultVariant: "pluck",
  variants: {
    // pushed down, then yanked up out of the ground with a stretch; the leaves whip behind it and flop
    // over as it drops back with a squash
    pluck: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=carrot]",
            { y: [0, 1.5, -5, -5, 0, 0], scaleY: [1, 0.92, 1.1, 1, 0.88, 1] },
            {
              duration: seconds,
              times: [0, 0.15, 0.35, 0.55, 0.75, 1],
              ease: ["easeInOut", ease.out, "easeInOut", ease.in, ease.overshoot],
            },
          ),
          animate(
            "[data-part=leaves]",
            { skewX: [0, 0, 22, -16, 12, -6, 0], scaleY: [1, 1, 0.8, 1.1, 0.9, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.55, 0.78, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the leaves sway one after another, like a breeze through the patch
    rustle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=leaf]",
          { rotate: [0, -18, 14, -8, 4, 0] },
          { duration: seconds * 0.8, delay: stagger(seconds * 0.1), ease: "easeInOut" },
        ),
    },
    // spun twice about its own length: the leaves swing round edge-on and back, and the ridges round
    // the root mirror across it, while the root's outline holds still
    twirl: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=leaves], [data-part=ridge]",
          { scaleX: [1, 0, -1, 0, 1, 0, -1, 0, 1] },
          { duration: seconds, ease: "linear" },
        ),
    },
  },
  render: () => (
    // drawn upright and turned 45°, so every move runs along the root: its tip lands bottom-left
    <g transform="rotate(45 12 12)">
      <g data-part="carrot" style={pivot("50% 100%")}>
        <path d="M7 9h10l-5 13Z" />
        {/* notches into the root from either side; each turns about the root's axis (x 12) */}
        <path data-part="ridge" d="M8.2 12H11" style={pivot("135.7% 50%")} />
        <path data-part="ridge" d="M14.5 15.5H12" style={pivot("0% 50%")} />
        <g data-part="leaves" stroke={slot.accent} style={pivot("50% 100%")}>
          <path data-part="leaf" d="M12 9 8 4" style={pivot("100% 100%")} />
          <path data-part="leaf" d="M12 9V2" style={pivot("50% 100%")} />
          <path data-part="leaf" d="M12 9l4-5" style={pivot("0% 100%")} />
        </g>
      </g>
    </g>
  ),
})
