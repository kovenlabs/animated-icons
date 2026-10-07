"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    scan: "sweep" | "focus" | "tilt"
  }
}

/** Perspective poses for a corner on the left (near first) and on the right (far first) of the tilt. */
const LEFT = { x: [0, -1, 2, 0], scale: [1, 1.15, 0.85, 1] }
const RIGHT = { x: [0, -2, 1, 0], scale: [1, 0.85, 1.15, 1] }

/**
 * The four corner brackets, each pivoting on its own corner. `inward` is where it closes in to when it
 * locks on; `tilt` is its pose as the scanner swings round its vertical axis: the near side grows taller
 * and wider, the far side shrinks and slides in.
 */
const CORNERS = [
  { part: "top-left", d: "M3 8V3h5", origin: "0% 0%", inward: { x: 2.5, y: 2.5 }, tilt: { ...LEFT, y: [0, -1.5, 1.5, 0] } },
  { part: "top-right", d: "M16 3h5v5", origin: "100% 0%", inward: { x: -2.5, y: 2.5 }, tilt: { ...RIGHT, y: [0, 1.5, -1.5, 0] } },
  { part: "bottom-right", d: "M21 16v5h-5", origin: "100% 100%", inward: { x: -2.5, y: -2.5 }, tilt: { ...RIGHT, y: [0, -1.5, 1.5, 0] } },
  { part: "bottom-left", d: "M8 21H3v-5", origin: "0% 100%", inward: { x: 2.5, y: -2.5 }, tilt: { ...LEFT, y: [0, 1.5, -1.5, 0] } },
]

/** 2 colors: brackets (primary), scan beam, its glow and the focus point (accent). */
export const Scan = createAnimatedIcon({
  name: "scan",
  category: "actions",
  keywords: ["scanner", "qr code", "barcode", "capture", "viewfinder", "focus", "document scan", "read"],
  slots: { primary: "brackets", accent: "beam + glow + focus point" },
  defaultVariant: "sweep",
  variants: {
    // a beam sweeps down the window trailing a glow, then back up and out; the brackets snap in once
    // the scan is done
    sweep: {
      duration: 1400,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=beam]",
            { y: [-6, 6, 0], opacity: [0, 1, 1, 0] },
            { duration: seconds * 0.75, ease: "easeInOut" },
          ),
          animate(
            "[data-part=glow]",
            { scaleY: [0, 1, 1], opacity: [0, 1, 0] },
            { duration: seconds * 0.75, times: [0, 0.5, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=brackets]",
            { scale: [1, 1, 0.86, 1.04, 1] },
            { duration: seconds, times: [0, 0.7, 0.8, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the brackets close in to lock on, overshoot back out past the frame and settle, as a focus point
    // blinks in the middle
    focus: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...CORNERS.map(({ part, inward }) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, inward.x, -inward.x * 0.5, 0], y: [0, inward.y, -inward.y * 0.5, 0] },
              { duration: seconds, times: [0, 0.35, 0.65, 1], ease: [ease.in, ease.out, "easeInOut"] },
            ),
          ),
          animate("[data-part=point]", blink, { duration: seconds * 0.5, delay: seconds * 0.25, ease: "easeOut" }),
        ]),
    },
    // swings round its vertical axis in perspective, one side looming as the other recedes, then the
    // other way, and springs flat
    tilt: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all(
          CORNERS.map(({ part, tilt }) =>
            animate(
              `[data-part=${part}]`,
              { ...tilt },
              { duration: seconds, times: [0, 0.3, 0.7, 1], ease: ["easeInOut", "easeInOut", ease.overshoot] },
            ),
          ),
        ),
    },
  },
  render: () => (
    <>
      {/* the swept window, filled from the top behind the beam: only exists in motion */}
      <path data-part="glow" d="M6 6h12v12H6Z" fill={slot.accent} fillOpacity={0.2} stroke="none" style={flash("50% 0%")} />
      <path data-part="beam" d="M6 12h12" stroke={slot.accent} style={flash()} />
      <path data-part="point" d="M12 10v4M10 12h4" stroke={slot.accent} style={flash()} />
      <g data-part="brackets" style={pivot("50% 50%")}>
        {CORNERS.map(({ part, d, origin }) => (
          <path key={part} data-part={part} d={d} style={pivot(origin)} />
        ))}
      </g>
    </>
  ),
})
