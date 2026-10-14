"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    anvil: "forge" | "drop" | "turn"
  }
}

/**
 * Sparks fanning up off the face, each drawn from its lower end outward (the end it scales from).
 */
const SPARKS = [
  { d: "M9 6 7 3.5", origin: "100% 100%" },
  { d: "M13 6v-3", origin: "50% 100%" },
  { d: "M17 6l2-2.5", origin: "0% 100%" },
]

/** 2 colors: anvil (primary), sparks and dust (accent). */
export const Anvil = createAnimatedIcon({
  name: "anvil",
  category: "tools",
  keywords: ["blacksmith", "forge", "heavy", "metal", "smithing", "craft", "iron", "weight"],
  slots: { primary: "anvil", accent: "sparks + dust" },
  defaultVariant: "forge",
  variants: {
    // struck from above: it stretches up, squashes flat under the blow and springs back, sparks
    // flying off the face
    forge: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=anvil]",
            { scaleY: [1, 1.06, 0.8, 1.06, 0.98, 1], scaleX: [1, 0.97, 1.12, 0.97, 1.01, 1] },
            {
              duration: seconds,
              times: [0, 0.2, 0.32, 0.55, 0.78, 1],
              ease: ["easeOut", ease.in, "easeOut", "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=spark]",
            { opacity: [0, 1, 0], scale: [0.4, 1.3, 1], y: [0, -0.5] },
            { duration: seconds * 0.45, delay: stagger(seconds * 0.05, { startDelay: seconds * 0.3 }), ease: "easeOut" },
          ),
        ]),
    },
    // the cartoon drop: yanked up out of frame, it plummets back stretched, lands in a heavy squash
    // and kicks dust out both sides
    drop: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=anvil]",
            {
              y: [0, -24, -24, 0, 0, 0, 0],
              scaleY: [1, 1.2, 1.2, 1.2, 0.72, 1.06, 1],
              scaleX: [1, 0.88, 0.88, 0.88, 1.18, 0.97, 1],
            },
            {
              duration: seconds,
              times: [0, 0.22, 0.4, 0.6, 0.66, 0.82, 1],
              ease: [ease.in, "linear", ease.in, "easeOut", "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=puff-l]",
            { opacity: [0, 1, 0], scale: [0.5, 1.3, 1], x: [0, -1], y: [0, -1.5] },
            { duration: seconds * 0.35, delay: seconds * 0.6, ease: "easeOut" },
          ),
          animate(
            "[data-part=puff-r]",
            { opacity: [0, 1, 0], scale: [0.5, 1.3, 1], x: [0, 1], y: [0, -1.5] },
            { duration: seconds * 0.35, delay: seconds * 0.6, ease: "easeOut" },
          ),
        ]),
    },
    // lifted onto a turntable and turned a full revolution, the horn swinging round to the far side
    // and back
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=anvil]",
          { scaleX: [1, -1, 1], y: [0, -2.5, 0], scaleY: [1, 0.95, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {SPARKS.map(({ d, origin }) => (
          <path key={d} data-part="spark" d={d} style={flash(origin)} />
        ))}
      </g>
      <g fill={slot.accent} stroke="none">
        <rect data-part="puff-l" x="2" y="15" width="2" height="2" style={flash()} />
        <rect data-part="puff-r" x="20" y="14.5" width="2" height="2" style={flash()} />
      </g>
      {/* squashes and turns about the middle of its base */}
      <g data-part="anvil" style={pivot("50% 100%")}>
        {/* a flat face over a horn that tapers to a point on the left */}
        <path d="M2 8h20v3l-4 3H9l-2-3Z" />
        <path d="M10 14v3M16 14v3" />
        <path d="M7 17h12l2 4H5Z" />
      </g>
    </>
  ),
})
