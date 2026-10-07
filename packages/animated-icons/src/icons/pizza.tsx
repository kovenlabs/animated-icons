"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    pizza: "lift" | "flip" | "toppings"
  }
}

/** Three slices of pepperoni, 2px clear of the crust and the slice's edges. */
const PEPPERONI = [
  { cx: 9, cy: 10.5 },
  { cx: 15, cy: 10.5 },
  { cx: 12, cy: 15.5 },
]

/** 2 colors: slice and crust (primary), pepperoni (accent). */
export const Pizza = createAnimatedIcon({
  name: "pizza",
  category: "commerce",
  keywords: ["slice", "food", "pepperoni", "italian", "takeaway", "delivery", "restaurant", "lunch"],
  slots: { primary: "slice + crust", accent: "pepperoni" },
  defaultVariant: "lift",
  variants: {
    // picked up towards you: the slice swells and tilts, the pepperoni riding on top of it rises a little
    // more (they sit higher, so they move further), then it is set back down with a squash
    lift: {
      duration: 1100,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slice]",
            {
              scale: [1, 1.1, 1.1, 1, 1],
              rotate: [0, -10, -6, 0, 0],
              y: [0, -1, -1, 0, 0],
              scaleY: [1, 1, 1, 0.9, 1],
            },
            {
              duration: seconds,
              times: [0, 0.3, 0.55, 0.75, 1],
              ease: ["easeOut", "easeInOut", ease.in, ease.overshoot],
            },
          ),
          animate(
            "[data-part=pepperoni]",
            { y: [0, -1.5, -1.5, 0.5, 0], scale: [1, 1.35, 1.35, 0.9, 1] },
            {
              duration: seconds,
              times: [0, 0.3, 0.55, 0.78, 1],
              ease: ["easeOut", "easeInOut", ease.in, "easeOut"],
              delay: stagger(seconds * 0.03),
            },
          ),
        ]),
    },
    // a full turn on its long axis: the underside is bare, so the pepperoni are gone while it shows,
    // and come back as the topped side swings round
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slice]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=pepperoni]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.249, 0.25, 0.749, 0.75, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
        ]),
    },
    // the pepperoni drop on one after another, each with a bounce
    toppings: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pepperoni]",
            { scale: [1, 0, 0, 1.5, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.15, 0.3, 0.65, 1],
              ease: ["easeIn", "linear", "easeOut", ease.overshoot],
              delay: stagger(seconds * 0.12),
            },
          ),
          animate(
            "[data-part=slice]",
            { scaleY: [1, 1, 0.93, 1, 0.94, 1, 0.95, 1, 1] },
            { duration: seconds, times: [0, 0.42, 0.47, 0.53, 0.59, 0.65, 0.71, 0.78, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="slice" style={pivot("50% 50%")}>
      {/* a thick crust along the top, the slice tapering to a point below it */}
      <path d="M2 2h20v4H2z" />
      <path d="M2 6l10 16 10-16" />
      <g fill={slot.accent} stroke="none">
        {PEPPERONI.map((p) => (
          <circle key={p.cx + p.cy} data-part="pepperoni" {...p} r="1.25" style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
