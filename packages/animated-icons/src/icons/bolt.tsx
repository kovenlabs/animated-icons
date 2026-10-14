"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bolt: "tighten" | "flip" | "rattle"
  }
}

/** A point-up hexagon nut, 2..22 tall, its flats at x 3.5 and 20.5. */
const NUT = "M12 2 20.5 7v10L12 22l-8.5-5V7Z"

/**
 * The nut seen edge-on: a slab as tall as the hexagon, the lines where its faces meet at y 7 and 17.
 * Shown only while the nut is turned side-on, so the flip has depth.
 */
const SIDE = "M9.5 2h5v20h-5ZM9.5 7h5M9.5 17h5"

/** 2 colors: nut (primary), threaded hole (accent). */
export const Bolt = createAnimatedIcon({
  name: "bolt",
  category: "tools",
  keywords: ["nut", "hex", "hardware", "screw", "fastener", "settings", "mechanic", "tighten"],
  slots: { primary: "nut", accent: "threaded hole" },
  defaultVariant: "tighten",
  variants: {
    // spun a full turn onto its thread, sinking away from you as it bites, then popping back up
    tighten: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=nut]",
            { rotate: [0, 360, 360] },
            { duration: seconds, times: [0, 0.75, 1], ease: [ease.inOut, "linear"] },
          ),
          animate(
            "[data-part=nut]",
            { scale: [1, 0.78, 0.78, 1.06, 1] },
            { duration: seconds, times: [0, 0.6, 0.75, 0.88, 1], ease: ["easeIn", "linear", ease.overshoot, "easeOut"] },
          ),
          animate(
            "[data-part=hole]",
            { scale: [1, 1, 1.3, 1] },
            { duration: seconds, times: [0, 0.72, 0.84, 1], ease: "easeOut" },
          ),
        ]),
    },
    // flipped like a coin: it narrows to its edge, the slab of its side swings past, and its other
    // face turns back to you at the top of a hop
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bolt]",
            { y: [0, -4, 0] },
            { duration: seconds, ease: ["easeOut", "easeIn"] },
          ),
          animate(
            "[data-part=nut]",
            { scaleX: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: ["easeIn", "linear", "easeOut"] },
          ),
          animate(
            "[data-part=side]",
            { scaleX: [0, 0, 1, 0, 0], opacity: [0, 1, 1, 1, 0] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.7, 1], ease: ["linear", "easeOut", "easeIn", "linear"] },
          ),
        ]),
    },
    // shaken loose: it jitters and twists back and forth on its thread, the hole knocking about
    rattle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=nut]",
            {
              rotate: [0, -14, 12, -10, 8, -4, 0],
              x: [0, -1.2, 1.2, -1, 0.8, -0.4, 0],
              scale: [1, 1.08, 1.04, 1.08, 1.04, 1.02, 1],
            },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=hole]",
            { x: [0, 0.8, -0.8, 0.6, -0.6, 0], y: [0, -0.6, 0.6, -0.4, 0.4, 0] },
            { duration: seconds, delay: seconds * 0.05, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="bolt">
      <path data-part="side" d={SIDE} style={flash()} />
      <g data-part="nut" style={pivot("50% 50%")}>
        <path d={NUT} />
        <circle data-part="hole" cx="12" cy="12" r="4" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
