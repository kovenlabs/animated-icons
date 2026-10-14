"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    salad: "toss" | "fresh" | "rock"
  }
}

/** 2 colors: bowl (primary), leaves and tomato (accent). */
export const Salad = createAnimatedIcon({
  name: "salad",
  category: "food",
  keywords: ["bowl", "greens", "lettuce", "healthy", "vegan", "vegetarian", "diet", "food"],
  slots: { primary: "bowl", accent: "leaves + tomato" },
  defaultVariant: "toss",
  variants: {
    // tossed: the bowl dips, the greens fly up and splay apart while the tomato spins, and the bowl
    // catches them with a squash
    toss: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const beat = {
          duration: seconds,
          times: [0, 0.18, 0.4, 0.6, 0.8, 1],
          ease: ["easeInOut", ease.out, "linear", ease.in, "easeOut"] satisfies Easing[],
        }
        return Promise.all([
          animate(
            "[data-part=bowl]",
            { scaleY: [1, 0.85, 1.04, 1, 0.9, 1], scaleX: [1, 1.08, 0.97, 1, 1.05, 1] },
            { ...beat, ease: "easeInOut" },
          ),
          animate("[data-part=greens]", { y: [0, 1.2, -3, -3, 0.8, 0] }, beat),
          animate("[data-part=leaf-l]", { rotate: [0, 0, -8, -8, 0, 0] }, beat),
          animate("[data-part=leaf-r]", { rotate: [0, 0, 8, 8, 0, 0] }, beat),
          animate("[data-part=tomato]", { y: [0, 0, -1, -1, 0, 0], scaleX: [1, 1, -1, 1, 1, 1] }, beat),
        ])
      },
    },
    // the greens duck into the bowl and spring back up fresh, one after the other, overshooting
    fresh: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds * 0.75, times: [0, 0.25, 0.55, 0.78, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=leaf-l]", { scale: [1, 0.2, 1.15, 0.95, 1] }, options),
          animate("[data-part=tomato]", { scale: [1, 0, 1.4, 0.9, 1] }, { ...options, delay: seconds * 0.1 }),
          animate("[data-part=leaf-r]", { scale: [1, 0.2, 1.15, 0.95, 1] }, { ...options, delay: seconds * 0.2 }),
          animate(
            "[data-part=bowl]",
            { scaleY: [1, 0.94, 1.02, 1], scaleX: [1, 1.04, 0.99, 1] },
            { duration: seconds * 0.7, delay: seconds * 0.15, ease: "easeInOut" },
          ),
        ])
      },
    },
    // the bowl rocks on its base and the greens sway a beat behind it
    rock: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=salad]",
            { rotate: [0, -8, 6, -4, 2, 0] },
            { duration: seconds * 0.9, ease: "easeInOut" },
          ),
          animate(
            "[data-part=greens]",
            { skewX: [0, -8, 6, -4, 2, 0] },
            { duration: seconds * 0.9, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="salad" style={pivot("50% 100%")}>
      {/* a faceted bowl under a flat rim */}
      <path data-part="bowl" d="M3 13h18l-2 5-3.5 3h-7L5 18Z" style={pivot("50% 100%")} />
      <g data-part="greens" style={pivot("50% 100%")}>
        {/* two kite leaves splaying out from the rim, each pivoting on its stem */}
        <g stroke={slot.accent}>
          <path data-part="leaf-l" d="M9 13 5 11 4 6l4 1.5Z" style={pivot("100% 100%")} />
          <path data-part="leaf-r" d="M15 13l4-2 1-5-4 1.5Z" style={pivot("0% 100%")} />
        </g>
        <rect data-part="tomato" x="11" y="5" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
