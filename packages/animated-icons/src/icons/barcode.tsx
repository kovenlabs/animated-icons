"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    barcode: "scan" | "beep" | "print"
  }
}

/** Bars of two widths, 2px apart, left to right: [x, width]. */
const BARS = [
  [2, 2],
  [6, 3],
  [11, 2],
  [15, 3],
  [20, 2],
] as const

/** 2 colors: bars (primary), scanner laser (accent). The laser only exists in motion. */
export const Barcode = createAnimatedIcon({
  name: "barcode",
  category: "commerce",
  keywords: ["scan", "scanner", "product", "sku", "upc", "checkout", "inventory", "label"],
  slots: { primary: "bars", accent: "scanner laser" },
  defaultVariant: "scan",
  variants: {
    // a laser line sweeps down the code and back up, then goes out
    scan: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=laser]", { y: [-7, 7, -7] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=laser]",
            { opacity: [0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.1, 0.9, 1], ease: "linear" },
          ),
        ]),
    },
    // read in one go: the laser flashes across the middle and the code gives a small pop
    beep: {
      duration: 600,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=laser]", blink, { duration: seconds * 0.6, ease: "easeOut" }),
          animate(
            "[data-part=code]",
            { scale: [1, 1, 1.08, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: "easeOut" },
          ),
        ]),
    },
    // printed again: each bar retracts to the top and runs back down, left to right
    print: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bar]",
          { scaleY: [1, 0, 1] },
          { duration: seconds * 0.6, delay: stagger(seconds * 0.1), times: [0, 0.3, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="code" fill={slot.primary} stroke="none" style={pivot("50% 50%")}>
        {BARS.map(([x, width]) => (
          <rect key={x} data-part="bar" x={x} y="4" width={width} height="16" style={pivot("50% 0%")} />
        ))}
      </g>
      <path data-part="laser" d="M2 12h20" stroke={slot.accent} style={flash("50% 50%")} />
    </>
  ),
})
