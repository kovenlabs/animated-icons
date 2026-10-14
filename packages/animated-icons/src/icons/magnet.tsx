"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    magnet: "attract" | "swing" | "buzz"
  }
}

/** A horseshoe opening upward: straight arms, a true half-circle bend, the pole tips left off. */
const BODY = "M5 10v4a7 7 0 0 0 14 0v-4h-4v4a3 3 0 0 1-6 0v-4Z"

/** Filings that fly in onto the poles: where they land (x, above y 2) and where they come from. */
const FILINGS = [
  { x: 5, from: { x: -4, y: 1 } },
  { x: 7, from: { x: -1, y: -3 } },
  { x: 15, from: { x: 1, y: -3 } },
  { x: 17, from: { x: 4, y: 1 } },
]

/** 2 colors: horseshoe (primary), poles and filings (accent). The filings only exist in motion. */
export const Magnet = createAnimatedIcon({
  name: "magnet",
  category: "education",
  keywords: ["magnetic", "attract", "pull", "physics", "horseshoe", "science", "lead magnet", "force"],
  slots: { primary: "horseshoe", accent: "poles + filings" },
  defaultVariant: "attract",
  variants: {
    // the magnet heaves up as filings come flying in from the sides and snap onto its poles
    attract: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...FILINGS.map(({ from }, i) =>
            animate(
              `[data-filing="${i}"]`,
              { x: [from.x, 0, 0, 0], y: [from.y, 2, 2, 2], opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.6] },
              { duration: seconds, times: [0, 0.4, 0.8, 1], delay: i * seconds * 0.03, ease: [ease.in, "linear", "easeOut"] },
            ),
          ),
          animate(
            "[data-part=magnet]",
            { y: [0, 1, -1.2, 0], scaleY: [1, 0.94, 1.04, 1] },
            { duration: seconds * 0.7, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=pole]",
            { scale: [1, 1, 1.25, 1] },
            { duration: seconds * 0.7, times: [0, 0.55, 0.7, 1], ease: "easeOut" },
          ),
        ]),
    },
    // rocked on its bend like a metronome, leaning into depth at each end of the swing
    swing: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=magnet]",
          { rotate: [0, 12, -9, 5, -2, 0], skewX: [0, -6, 5, -3, 1, 0], scaleX: [1, 0.9, 0.93, 0.97, 0.99, 1] },
          { duration: seconds, times: [0, 0.22, 0.45, 0.65, 0.83, 1], ease: "easeInOut" },
        ),
    },
    // charged up: it hums with a fast shiver while its poles flare one after the other
    buzz: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=magnet]",
            { x: [0, -0.7, 0.7, -0.7, 0.7, -0.5, 0.5, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate("[data-pole=left]", { scale: [1, 1.35, 1, 1.2, 1] }, { duration: seconds * 0.8, ease: "easeOut" }),
          animate(
            "[data-pole=right]",
            { scale: [1, 1.35, 1, 1.2, 1] },
            { duration: seconds * 0.8, delay: seconds * 0.2, ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {FILINGS.map(({ x }, i) => (
          <rect key={x} data-filing={i} x={x} y="2" width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="magnet" style={pivot("50% 100%")}>
        <path d={BODY} />
        {/* solid pole tips capping each arm, flaring from where they meet it */}
        <g fill={slot.accent} stroke={slot.accent}>
          <path data-part="pole" data-pole="left" d="M5 7h4v3H5Z" style={pivot("50% 100%")} />
          <path data-part="pole" data-pole="right" d="M15 7h4v3h-4Z" style={pivot("50% 100%")} />
        </g>
      </g>
    </>
  ),
})
