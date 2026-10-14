"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "chef-hat": "puff" | "toss" | "wobble"
  }
}

/** 2 colors: puffed crown (primary), band (accent). */
export const ChefHat = createAnimatedIcon({
  name: "chef-hat",
  category: "commerce",
  keywords: ["chef", "cook", "kitchen", "cooking", "restaurant", "recipe", "toque", "food"],
  slots: { primary: "crown", accent: "band" },
  defaultVariant: "puff",
  variants: {
    // the band squashes and the crown sinks fat onto it, then springs up tall and wobbles back
    puff: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const beat = { duration: seconds, times: [0, 0.2, 0.42, 0.6, 0.78, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate(
            "[data-part=crown]",
            {
              y: [0, 1, 0, 0, 0, 0],
              scaleY: [1, 0.8, 1.07, 0.95, 1.02, 1],
              scaleX: [1, 1.12, 0.94, 1.03, 0.99, 1],
            },
            beat,
          ),
          animate("[data-part=band]", { scaleY: [1, 0.75, 1, 1, 1, 1], scaleX: [1, 1.1, 0.97, 1, 1, 1] }, beat),
        ])
      },
    },
    // tossed in the air: it crouches, flies up and away from you spinning a full turn, and lands with a squash
    toss: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hat]",
            {
              y: [0, 0, -2.5, -2.5, 0, 0, 0],
              scaleY: [1, 0.86, 1, 1, 1, 0.9, 1],
              scaleX: [1, 1.08, 1, 1, 1, 1.07, 1],
            },
            {
              duration: seconds,
              times: [0, 0.14, 0.32, 0.55, 0.74, 0.84, 1],
              ease: ["easeOut", ease.out, "easeInOut", ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=spin]",
            { scale: [1, 1, 0.8, 0.8, 1, 1] },
            { duration: seconds, times: [0, 0.14, 0.32, 0.55, 0.74, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=spin]",
            { scaleX: [1, 1, -1, 1, 1] },
            { duration: seconds, times: [0, 0.14, 0.44, 0.74, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the soft crown sways like jelly over its stiff band, bouncing as it settles
    wobble: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=crown]",
          { skewX: [0, -12, 10, -6, 3, 0], scaleY: [1, 0.94, 1.04, 0.98, 1.01, 1] },
          { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.82, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="hat" style={pivot("50% 100%")}>
      <g data-part="spin" style={pivot("50% 50%")}>
        {/* a faceted three-lobed puff on two straight stems; its box is 5..19 × 3..17, so it squashes onto the band */}
        <path data-part="crown" d="M8 17v-4l-3-2V7.5L7.5 5H10l2-2 2 2h2.5L19 7.5V11l-3 2v4" style={pivot("50% 100%")} />
        <path data-part="band" d="M7 17h10v4H7Z" stroke={slot.accent} style={pivot("50% 100%")} />
      </g>
    </g>
  ),
})
