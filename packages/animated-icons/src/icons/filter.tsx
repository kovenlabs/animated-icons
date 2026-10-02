"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    filter: "drip" | "tilt" | "squeeze"
  }
}

/** A 2px drop, 2px clear of the spout's mouth (which ends at y 16). */
const DROP = { x: 11, y: 19, width: 2, height: 2 } as const

/** 2 colors: funnel (primary), drops (accent). */
export const FilterIcon = createAnimatedIcon({
  name: "filter",
  category: "actions",
  keywords: ["funnel", "sort", "refine", "narrow", "search filter", "facets"],
  slots: { primary: "funnel", accent: "drops" },
  defaultVariant: "drip",
  variants: {
    // the drop falls away and fades; a new one swells at the spout's mouth, with a quicker one
    // falling through in between. Drops live only below the neck, never inside the funnel
    drip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=drop]",
            { y: [0, 2.5, 0, 0], opacity: [1, 0, 0, 1], scale: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.35, 0.36, 1], ease: ["easeIn", "linear", "easeOut"] },
          ),
          animate(
            "[data-part=fall]",
            { y: [0, 2.5], opacity: [0, 1, 0], scale: [0.5, 1, 1] },
            { duration: seconds * 0.35, delay: stagger(seconds * 0.2, { startDelay: seconds * 0.3 }), ease: "easeIn" },
          ),
        ]),
    },
    // the funnel rocks about its spout, which barely moves above the drop
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=funnel]", { rotate: [0, -8, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the funnel is squeezed narrow and the drop is pressed out a little bigger
    squeeze: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=funnel]",
            { scaleX: [1, 0.85, 1.04, 1], scaleY: [1, 1.04, 0.98, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=drop]",
            { scale: [1, 1, 1.3, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a wide rim, a cone, then a straight neck open at the bottom; pivots on the spout's mouth */}
      <path data-part="funnel" d="M10 16v-5L4 4h16l-6 7v5" style={pivot("50% 100%")} />
      <g fill={slot.accent} stroke="none">
        <rect data-part="drop" {...DROP} style={pivot("50% 0%")} />
        {/* quick drops that fall through only while it drips */}
        <rect data-part="fall" {...DROP} style={flash("50% 0%")} />
        <rect data-part="fall" {...DROP} style={flash("50% 0%")} />
      </g>
    </>
  ),
})
