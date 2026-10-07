"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "ice-cream-cone": "plop" | "jiggle" | "offer"
  }
}

/** 2 colors: cone (primary), scoop (accent). */
export const IceCreamCone = createAnimatedIcon({
  name: "ice-cream-cone",
  category: "commerce",
  keywords: ["ice cream", "gelato", "dessert", "summer", "sweet", "treat", "frozen", "scoop"],
  slots: { primary: "cone", accent: "scoop" },
  defaultVariant: "plop",
  variants: {
    // the scoop pops up off the cone, drops back in with a big squash, and wobbles like jelly while the
    // whole cone gives under it
    plop: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=scoop]",
            {
              y: [0, 0, -6, 0, 0, 0, 0],
              scaleY: [1, 0.85, 1.12, 0.7, 1.1, 0.96, 1],
              scaleX: [1, 1.12, 0.92, 1.25, 0.94, 1.03, 1],
              skewX: [0, 0, 0, 0, 10, -6, 0],
            },
            {
              duration: seconds,
              times: [0, 0.12, 0.36, 0.56, 0.7, 0.84, 1],
              ease: ["easeInOut", "easeOut", ease.in, "easeOut", "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=cone-scoop]",
            { y: [0, 0, 1.5, 0, 0] },
            { duration: seconds, times: [0, 0.56, 0.64, 0.82, 1], ease: ["linear", "easeOut", ease.overshoot, "linear"] },
          ),
        ]),
    },
    // the scoop wobbles on the cone like jelly, settling slowly
    jiggle: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=scoop]",
          { skewX: [0, 16, -12, 8, -4, 0], scaleY: [1, 0.9, 1.06, 0.95, 1.02, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // held out to you: the cone tips and comes up close, the scoop swinging after it, then draws back
    offer: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cone-scoop]",
            { scale: [1, 1.22, 1.22, 1], rotate: [0, -14, -14, 0], y: [0, -1, -1, 0] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=scoop]",
            { skewX: [0, 0, 14, -10, 0, 8, -4, 0] },
            { duration: seconds, times: [0, 0.1, 0.32, 0.5, 0.6, 0.78, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="cone-scoop" style={pivot("50% 100%")}>
      {/* a waffle cone: an upturned triangle crossed by two strands, each running edge to edge */}
      <g>
        <path d="M6 10h12l-6 12Z" />
        <path d="M10 10l4 8M14 10l-4 8" />
      </g>
      {/* a scoop is round: a true half-circle sitting on the cone's rim, squashing from its base */}
      <path data-part="scoop" d="M5 10A7 7 0 0 1 19 10Z" stroke={slot.accent} style={pivot("50% 100%")} />
    </g>
  ),
})
