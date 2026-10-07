"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bluetooth: "pair" | "search" | "jelly"
  }
}

/** A pairing wave either side of the rune, each bulging away from it and pivoting on its chord. */
const WAVES = [
  { d: "M4 9.5a4 4 0 0 0 0 5", side: -1, origin: "100% 50%" },
  { d: "M20 9.5a4 4 0 0 1 0 5", side: 1, origin: "0% 50%" },
] as const

const wave = (side: number) => `[data-part=wave-${side < 0 ? "left" : "right"}]`

/** 2 colors: rune (primary), pairing waves (accent). */
export const Bluetooth = createAnimatedIcon({
  name: "bluetooth",
  category: "devices",
  keywords: ["wireless", "pairing", "connect", "headphones", "device", "bluetooth le", "short range"],
  slots: { primary: "rune", accent: "pairing waves" },
  defaultVariant: "pair",
  variants: {
    // the rune turns a full revolution like a coin, swelling toward you as it goes edge-on, and lands
    // with the pairing waves bursting out either side
    pair: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          // cos-shaped: slow off the face, fast through the edge
          animate(
            "[data-part=rune]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.62, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=lift]",
            { scale: [1, 1.1, 0.92, 1] },
            { duration: seconds * 0.8, times: [0, 0.35, 0.72, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
          ),
          ...WAVES.map(({ side }) =>
            animate(
              wave(side),
              { opacity: [0, 1, 0], x: [0, side * 0.5, side * 2], scale: [0.6, 1.1, 1.2] },
              { duration: seconds * 0.4, delay: seconds * 0.58, ease: "easeOut" },
            ),
          ),
        ]),
    },
    // looking for a device: the waves ripple out twice while the rune breathes in time
    search: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lift]",
            { scale: [1, 1.08, 1, 1.08, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          ...WAVES.map(({ side }) =>
            animate(
              wave(side),
              {
                opacity: [0, 1, 0, 0, 1, 0],
                x: [-side * 1.5, 0, side * 1.5, -side * 1.5, 0, side * 1.5],
                scale: [0.7, 1, 1.15, 0.7, 1, 1.15],
              },
              { duration: seconds, times: [0, 0.2, 0.45, 0.5, 0.7, 0.95], ease: "easeOut" },
            ),
          ),
        ]),
    },
    // poked: the rune wobbles like jelly on its foot, leaning and squashing until it settles
    jelly: {
      duration: 950,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bluetooth]",
          { skewX: [0, -14, 10, -6, 3, 0], scaleY: [1, 0.86, 1.08, 0.96, 1.02, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {WAVES.map(({ d, side, origin }) => (
          <path key={d} data-part={`wave-${side < 0 ? "left" : "right"}`} d={d} style={flash(origin)} />
        ))}
      </g>
      <g data-part="bluetooth" style={pivot("50% 100%")}>
        {/* the rune: a spine with two 45° arrowheads whose returns cross it at its middle */}
        <g data-part="lift" style={pivot("50% 50%")}>
          <path data-part="rune" d="M7.5 7.5l9 9-4.5 4.5V3l4.5 4.5-9 9" style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
