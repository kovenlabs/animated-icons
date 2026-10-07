"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "square-check": "draw" | "pop" | "press"
  }
}

/** 2 colors: box (primary), tick (accent). */
export const SquareCheck = createAnimatedIcon({
  name: "square-check",
  family: "square",
  category: "actions",
  keywords: ["checkbox", "select all", "checked", "done", "tick", "complete", "todo"],
  slots: { primary: "box", accent: "tick" },
  defaultVariant: "draw",
  variants: {
    // the tick fades out, then redraws from the short leg; hidden while the stroke is too short to read
    draw: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tick]",
            { opacity: [1, 0, 0, 1] },
            {
              duration: seconds * 0.45,
              times: [0, 0.3, 0.45, 1],
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=tick]",
            { pathLength: [1, 1, 0, 1] },
            {
              duration: seconds * 0.8,
              times: [0, 0.18, 0.2, 1],
              ease: "easeOut",
            },
          ),
        ]),
    },
    // the tick punches out from its elbow and settles
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=tick]", { scale: [1, 1.2, 0.95, 1] }, { duration: seconds, ease: ease.out }),
    },
    // the whole box is pressed like a clicked checkbox and springs back
    press: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=box]",
          { scale: [1, 0.86, 1.04, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="box" style={pivot("50% 50%")}>
      <path d="M3 3h18v18H3z" />
      {/* a short 45° leg and a long, steeper one meeting in a hard mitered elbow, 2px+ clear of the box */}
      <path d="M7 12.5 10.5 16 17 8.5" data-part="tick" stroke={slot.accent} style={pivot("40% 100%")} />
    </g>
  ),
})
