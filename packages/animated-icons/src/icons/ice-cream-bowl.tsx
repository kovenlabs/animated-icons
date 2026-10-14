"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "ice-cream-bowl": "plop" | "wobble" | "serve"
  }
}

/** 2 colors: bowl (primary), scoops (accent). */
export const IceCreamBowl = createAnimatedIcon({
  name: "ice-cream-bowl",
  family: "ice",
  category: "food",
  keywords: ["ice cream", "sundae", "gelato", "dessert", "scoops", "sweet", "treat", "frozen"],
  slots: { primary: "bowl", accent: "scoops" },
  defaultVariant: "plop",
  variants: {
    // the scoops shoot up out of the bowl and plop back in with a big squash, the bowl giving under them
    plop: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=scoops]",
            {
              y: [0, 0, -18, 0, 0, 0, 0],
              scaleY: [1, 0.85, 1.2, 1.1, 0.72, 1.08, 1],
              scaleX: [1, 1.08, 0.88, 0.92, 1.12, 0.97, 1],
            },
            {
              duration: seconds,
              times: [0, 0.12, 0.35, 0.58, 0.68, 0.84, 1],
              ease: ["easeInOut", ease.out, ease.in, "easeOut", "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=cup]",
            { y: [0, 0.6, 0, 0, 1, 0, 0] },
            { duration: seconds, times: [0, 0.12, 0.3, 0.58, 0.68, 0.9, 1], ease: ["easeOut", "easeOut", "linear", "easeOut", ease.overshoot, "linear"] },
          ),
          animate(
            "[data-part=stem]",
            { scaleY: [1, 0.85, 1, 1, 0.75, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.3, 0.58, 0.68, 0.9, 1], ease: ["easeOut", "easeOut", "linear", "easeOut", ease.overshoot, "linear"] },
          ),
        ]),
    },
    // the scoops wobble in the bowl like jelly, settling slowly
    wobble: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=scoops]",
          { skewX: [0, 16, -12, 8, -4, 0], scaleY: [1, 0.88, 1.08, 0.95, 1.02, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // slid across the counter: out to the right, in from the left, the scoops leaning against the slide
    serve: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) => {
        const times = [0, 0.1, 0.4, 0.401, 0.75, 0.88, 1]
        return Promise.all([
          animate(
            "[data-part=sundae]",
            { x: [0, -1.5, 22, -22, 1, 0, 0], rotate: [0, -4, 6, -6, 3, 0, 0] },
            { duration: seconds, times, ease: ["easeOut", ease.in, snap, ease.out, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=scoops]",
            { skewX: [0, 8, -16, 16, -10, 5, 0] },
            { duration: seconds, times, ease: ["easeOut", ease.in, snap, ease.out, "easeInOut", "easeInOut"] },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="sundae" style={pivot("50% 100%")}>
      <g data-part="cup" style={pivot("50% 100%")}>
        {/* three round scoops as one scalloped outline: two side by side, one riding on top */}
        <path
          data-part="scoops"
          d="M4 11A4 4 0 0 1 8 7A4 4 0 0 1 16 7A4 4 0 0 1 20 11"
          stroke={slot.accent}
          style={pivot("50% 100%")}
        />
        {/* a faceted bowl: wide rim tapering to a flat base */}
        <path d="M3 11h18l-3 6H6Z" />
      </g>
      <path data-part="stem" d="M12 17v4" style={pivot("50% 100%")} />
      <path d="M8 21h8" />
    </g>
  ),
})
