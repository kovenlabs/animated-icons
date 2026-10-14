"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    dessert: "jiggle" | "drop" | "hop"
  }
}

/** 2 colors: plate, pudding and sauce (primary), cherry (accent). */
export const Dessert = createAnimatedIcon({
  name: "dessert",
  category: "commerce",
  keywords: ["pudding", "flan", "jelly", "cherry", "sweet", "treat", "cake", "dessert menu"],
  slots: { primary: "plate + pudding + sauce", accent: "cherry" },
  defaultVariant: "jiggle",
  variants: {
    // the pudding wobbles like jelly on the plate, the cherry riding the top and bouncing on it
    jiggle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pudding]",
            { skewX: [0, -14, 11, -7, 3, 0], scaleY: [1, 0.9, 1.06, 0.95, 1.02, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=cherry]",
            { y: [0, -1.5, 0, -1, 0, 0], rotate: [0, 16, -12, 8, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // the cherry is flicked up out of view and drops back on top; the pudding squashes under the hit
    drop: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cherry]",
            { y: [0, 0, -14, 0, 0, 0], scaleY: [1, 0.8, 1.2, 1.1, 0.7, 1] },
            {
              duration: seconds,
              times: [0, 0.1, 0.38, 0.62, 0.7, 1],
              ease: ["easeOut", ease.out, ease.in, "easeOut", ease.overshoot],
            },
          ),
          animate(
            "[data-part=pudding]",
            { scaleY: [1, 0.94, 1.03, 1, 0.84, 1.06, 0.98, 1], scaleX: [1, 1.03, 0.98, 1, 1.07, 0.97, 1.01, 1] },
            { duration: seconds, times: [0, 0.1, 0.2, 0.62, 0.7, 0.8, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the whole dessert hops; the cherry is thrown higher, spins a full turn and lands back on top
    hop: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dessert]",
            { y: [0, 0.8, -3, 0, 0.6, 0, 0], scaleY: [1, 0.92, 1.05, 1, 0.94, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.12, 0.35, 0.55, 0.62, 0.75, 1],
              ease: ["easeOut", ease.out, ease.in, "easeOut", "easeInOut", "linear"],
            },
          ),
          animate(
            "[data-part=cherry]",
            { y: [0, 0, -7, 0, 0] },
            { duration: seconds, times: [0, 0.18, 0.5, 0.82, 1], ease: ["linear", ease.out, ease.in, "linear"] },
          ),
          animate(
            "[data-part=spin]",
            { rotate: [0, 0, 360, 360] },
            { duration: seconds, times: [0, 0.18, 0.82, 1], ease: ["linear", "easeInOut", "linear"] },
          ),
          animate(
            "[data-part=cherry]",
            { scaleY: [1, 1, 0.7, 1] },
            { duration: seconds, times: [0, 0.82, 0.88, 1], ease: ["linear", "easeOut", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="dessert" style={pivot("50% 100%")}>
      {/* a shallow dish */}
      <path d="M2 18h20l-3 3H5Z" />
      <g data-part="pudding" style={pivot("50% 100%")}>
        {/* a flan: flat top, raked sides standing on the dish */}
        <path d="M5.5 18 8 7.5h8l2.5 10.5" />
        {/* a band of sauce running round it, one drip hanging down */}
        <path d="M7.05 11.5H10l1.5 2.5 1.5-2.5h3.95" />
        {/* a cherry on top, with its stalk */}
        <g data-part="cherry" stroke={slot.accent} style={pivot("50% 100%")}>
          <g data-part="spin" style={pivot("44.4% 63.6%")}>
            <circle cx="12" cy="5.5" r="2" />
            <path d="M13 3.8 14.5 2" />
          </g>
        </g>
      </g>
    </g>
  ),
})
