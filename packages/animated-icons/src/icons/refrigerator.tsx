"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    refrigerator: "open" | "slam" | "hop"
  }
}

/** Shelves revealed only while a door stands open. */
const SHELVES = { freezer: "M8 6h7", fridge: "M8 14h7M8 18h7" }

/** 2 colors: cabinet and doors (primary), handles and shelves (accent). */
export const Refrigerator = createAnimatedIcon({
  name: "refrigerator",
  category: "devices",
  keywords: ["fridge", "freezer", "kitchen", "appliance", "cold", "food", "cooler"],
  slots: { primary: "cabinet + doors", accent: "handles + shelves" },
  defaultVariant: "open",
  variants: {
    // the main door swings open toward you on its hinge, the shelves show, and it shuts with a thud
    open: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=fridge-door]",
            { scaleX: [1, 0.15, 0.15, 1], skewY: [0, -14, -14, 0] },
            { duration: seconds * 0.85, times: [0, 0.3, 0.7, 1], ease: ["easeOut", "linear", ease.in] },
          ),
          animate(
            "[data-part=fridge-shelf]",
            { opacity: [0, 0, 1, 1, 0, 0] },
            { duration: seconds * 0.85, times: [0, 0.22, 0.32, 0.65, 0.72, 1], ease: "linear" },
          ),
          animate(
            "[data-part=fridge]",
            { scaleY: [1, 1, 0.94, 1.02, 1], scaleX: [1, 1, 1.04, 0.99, 1] },
            { duration: seconds, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the freezer is flung open and slammed shut, and the whole fridge rocks on its base from the blow
    slam: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=freezer-door]",
            { scaleX: [1, 0.15, 0.15, 1], skewY: [0, -18, -18, 0] },
            { duration: seconds * 0.5, times: [0, 0.3, 0.6, 1], ease: ["easeOut", "linear", ease.in] },
          ),
          animate(
            "[data-part=freezer-shelf]",
            { opacity: [0, 0, 1, 1, 0, 0] },
            { duration: seconds * 0.5, times: [0, 0.22, 0.32, 0.55, 0.65, 1], ease: "linear" },
          ),
          animate(
            "[data-part=fridge]",
            { rotate: [0, 0, -6, 4, -2, 0] },
            { duration: seconds, times: [0, 0.5, 0.62, 0.76, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // it hops on the spot: a squash, a stretched leap and a landing, the handles rattling a beat late
    hop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=fridge]",
            { y: [0, 0, -3, 0, 0], scaleY: [1, 0.86, 1.08, 0.9, 1], scaleX: [1, 1.08, 0.95, 1.06, 1] },
            { duration: seconds, times: [0, 0.2, 0.5, 0.75, 1], ease: ["easeOut", "easeOut", ease.in, ease.overshoot] },
          ),
          animate(
            "[data-part=handle]",
            { y: [0, 0, 0.8, -0.8, 0] },
            { duration: seconds, times: [0, 0.45, 0.65, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="fridge" style={pivot("50% 100%")}>
      {/* the cabinet stays put while a door swings away from it */}
      <path d="M5 2h14v20H5Z" />
      <g stroke={slot.accent}>
        <path data-part="freezer-shelf" d={SHELVES.freezer} style={flash()} />
        <path data-part="fridge-shelf" d={SHELVES.fridge} style={flash()} />
      </g>
      {/* both doors hinge on the right, their handles on the left */}
      <g data-part="freezer-door" style={pivot("100% 50%")}>
        <path d="M5 2h14v8H5Z" />
        <path data-part="handle" d="M9 5v2" stroke={slot.accent} />
      </g>
      <g data-part="fridge-door" style={pivot("100% 50%")}>
        <path d="M5 10h14v12H5Z" />
        <path data-part="handle" d="M9 13v4" stroke={slot.accent} />
      </g>
    </g>
  ),
})
