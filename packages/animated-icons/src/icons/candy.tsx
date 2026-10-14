"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    candy: "twist" | "flip" | "crinkle"
  }
}

/** 2 colors: wrapper ends (primary), sweet and stripe (accent). */
export const Candy = createAnimatedIcon({
  name: "candy",
  category: "commerce",
  keywords: ["sweet", "sweets", "bonbon", "treat", "halloween", "sugar", "kids", "confectionery"],
  slots: { primary: "wrapper ends", accent: "sweet + stripe" },
  defaultVariant: "twist",
  variants: {
    // the sweet spins a full turn inside its wrapper while the two ends twist flat and back, in turn
    twist: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=sweet]", { rotate: [0, 360] }, { duration: seconds, ease: ease.inOut }),
          animate(
            "[data-part=end-l]",
            { scaleY: [1, 0.2, 1, 0.3, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=end-r]",
            { scaleY: [1, 1, 0.2, 1, 0.3, 1] },
            { duration: seconds, times: [0, 0.12, 0.37, 0.62, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // tossed like a coin: crouches, flips end over end in the air and lands with a squash
    flip: {
      duration: 1000,
      clip: false,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=candy]",
          {
            y: [0, 1, -3.5, 0, 0, 0],
            scaleY: [1, 0.8, -1, 1, 0.8, 1],
            scaleX: [1, 1, 0.92, 1, 1, 1],
          },
          {
            duration: seconds,
            times: [0, 0.15, 0.45, 0.72, 0.84, 1],
            ease: ["easeOut", "easeOut", ease.in, "easeOut", ease.overshoot],
          },
        ),
    },
    // the sweet squashes and wobbles in its wrapper while the ends flutter like crinkled paper
    crinkle: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.4, 0.6, 0.8, 1]
        return Promise.all([
          animate(
            "[data-part=sweet]",
            { scaleY: [1, 0.82, 1.1, 0.88, 1.04, 1], rotate: [0, -12, 10, -8, 4, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=end-l]",
            { skewY: [0, 16, -16, 12, -8, 0], scaleY: [1, 0.8, 1.1, 0.85, 1.05, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=end-r]",
            { skewY: [0, -16, 16, -12, 8, 0], scaleY: [1, 1.1, 0.8, 1.05, 0.85, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="candy" style={pivot("50% 50%")}>
      {/* the wrapper's twisted ends: two triangles, each pointing in at the sweet */}
      <path data-part="end-l" d="M6 12 2 8v8Z" style={pivot("100% 50%")} />
      <path data-part="end-r" d="M18 12l4-4v8Z" style={pivot("0% 50%")} />
      {/* a round sweet with two raked stripes, like a mint */}
      <g data-part="sweet" stroke={slot.accent} style={pivot("50% 50%")}>
        <circle cx="12" cy="12" r="6" />
        <path d="M16.56 8.1 10.9 17.9M13.1 6.1 7.44 15.9" />
      </g>
    </g>
  ),
})
