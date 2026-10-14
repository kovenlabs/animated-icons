"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sofa: "plop" | "shove" | "fluff"
  }
}

/** 2 colors: sofa (primary), seat cushion (accent). */
export const Sofa = createAnimatedIcon({
  name: "sofa",
  category: "home",
  keywords: ["couch", "settee", "living room", "furniture", "lounge", "seat", "relax"],
  slots: { primary: "sofa", accent: "seat cushion" },
  defaultVariant: "plop",
  variants: {
    // someone flops onto it: the cushion sinks, the sofa squashes wide, the backrest tips away and springs up
    plop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sofa]",
            { scaleY: [1, 0.88, 1.05, 0.98, 1], scaleX: [1, 1.06, 0.97, 1.01, 1] },
            { duration: seconds, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=seat]",
            { y: [0, 2, -0.8, 0.3, 0] },
            { duration: seconds, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=back]",
            { scaleY: [1, 0.75, 1.1, 0.97, 1] },
            { duration: seconds, delay: seconds * 0.05, times: [0, 0.3, 0.6, 0.82, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // shoved sideways: it drags on its feet, leaning into the slide and bunching up, and skids back into
    // place. The arms sit 1px from the frame, so the slide is short and the lean carries the shove
    shove: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sofa]",
          { x: [0, 0, 1, 1, 0, 0], skewX: [0, 4, -4, 2, 4, 0], scaleX: [1, 0.95, 0.9, 0.95, 0.95, 1] },
          { duration: seconds, times: [0, 0.15, 0.4, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
    // the seat cushion is plumped: it pops up, pinched narrow, and drops back with a squash
    fluff: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=seat]",
            { y: [0, -2.5, 0, 0], scaleX: [1, 0.8, 1.05, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
          animate(
            "[data-part=back]",
            { scaleY: [1, 1, 1.12, 1] },
            { duration: seconds, times: [0, 0.55, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="sofa" style={pivot("50% 100%")}>
      {/* a split backrest standing on the arms */}
      <path data-part="back" d="M5 10V5h14v5M12 5v4" style={pivot("50% 100%")} />
      {/* both arms and the base in one stroke, opening onto the seat; two short feet */}
      <path d="M7 14v-4H2v8h20v-8h-5v4" />
      <path d="M4 18v2M20 18v2" />
      <path data-part="seat" d="M7 14h10" stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
