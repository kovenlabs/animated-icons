"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cross: "heal" | "flip" | "spin"
  }
}

/** A square-armed cross filling the frame, arms 6 wide. */
const CROSS = "M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"

/** Sparkles in the four bays between the arms, each with the way it flies out. */
const SPARKS = [
  { x: 4, y: 4, dx: -1, dy: -1 },
  { x: 18, y: 4, dx: 1, dy: -1 },
  { x: 18, y: 18, dx: 1, dy: 1 },
  { x: 4, y: 18, dx: -1, dy: 1 },
] as const

/** 2 colors: cross (primary), fill and sparkles (accent). The fill and sparkles only exist in motion. */
export const Cross = createAnimatedIcon({
  name: "cross",
  category: "health",
  keywords: ["first aid", "medical", "health", "hospital", "plus", "red cross", "church", "religion"],
  slots: { primary: "cross", accent: "fill + sparkles" },
  defaultVariant: "heal",
  variants: {
    // charges up: it squashes as it fills from the centre, then bursts out bigger with a sparkle in
    // every bay, and the fill drains away as it settles
    heal: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cross]",
            { scale: [1, 0.86, 0.86, 1.08, 0.97, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.58, 0.78, 1], ease: [ease.out, "linear", ease.out, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=fill]",
            { scale: [0, 0, 1, 1, 1], opacity: [0, 1, 1, 0.9, 0] },
            { duration: seconds, times: [0, 0.1, 0.45, 0.7, 1], ease: "easeOut" },
          ),
          ...SPARKS.map(({ dx, dy }, i) =>
            animate(
              `[data-part=spark-${i}]`,
              { opacity: [0, 1, 0], scale: [0.4, 1.2, 0.6], x: [0, dx, dx * 1.5], y: [0, dy, dy * 1.5] },
              { duration: seconds * 0.4, delay: seconds * 0.5, ease: "easeOut" },
            ),
          ),
        ]),
    },
    // flips on its upright axis like a tossed coin, swelling toward you edge-on, and lands face up
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cross]",
          {
            scaleX: [1, 0, -1, 0, 1, 1],
            scaleY: [1, 1.08, 1.05, 1.08, 0.94, 1],
            skewY: [0, 8, 0, -8, 0, 0],
          },
          { duration: seconds, times: [0, 0.18, 0.36, 0.54, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", ease.overshoot] },
        ),
    },
    // whirls a half turn, shrinking into the spin and popping out of it, and settles with a kick
    spin: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cross]",
          { rotate: [0, -15, 195, 180, 0], scale: [1, 0.9, 1.05, 1, 1] },
          { duration: seconds, times: [0, 0.15, 0.65, 0.999, 1], ease: ["easeOut", ease.inOut, ease.overshoot, snap] },
        ),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {SPARKS.map(({ x, y }, i) => (
          <rect key={i} data-part={`spark-${i}`} x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="cross" style={pivot("50% 50%")}>
        <path data-part="fill" d={CROSS} fill={slot.accent} stroke="none" style={flash()} />
        <path d={CROSS} />
      </g>
    </>
  ),
})
