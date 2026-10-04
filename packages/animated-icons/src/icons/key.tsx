"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    key: "turn" | "jiggle" | "insert"
  }
}

/**
 * The key is drawn lying flat (bow left, bit hanging below the shaft) and the whole drawing is laid on
 * the diagonal, so its moves stay simple in its own frame: `x` slides along the shaft, `scaleY` turns
 * it over around the shaft. Its box is 1.5..21.5 × 7.5..16.5; the bow's centre (6, 12) sits at 22.5% 50%.
 */
const BOW = pivot("22.5% 50%")

/** 2 colors: key (primary), bit (accent). */
export const Key = createAnimatedIcon({
  name: "key",
  category: "security",
  keywords: ["password", "access", "unlock", "credentials", "login", "auth", "secret"],
  slots: { primary: "bow + shaft", accent: "bit" },
  defaultVariant: "turn",
  variants: {
    // turned over in the lock: the bow narrows edge-on and the bit swings under the shaft, then back
    turn: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=key]",
          { scaleY: [1, -1, -1, 1] },
          { duration: seconds, times: [0, 0.4, 0.6, 1], ease: "easeInOut" },
        ),
    },
    // a stuck key worked side to side around the bow in your fingers
    jiggle: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=key]", { rotate: [0, -8, 7, -5, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // pushed home along the shaft, held a beat, drawn back out
    insert: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=key]",
          { x: [0, 3, 3, -0.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.6, 0.85, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g transform="rotate(-45 12 12)">
      <g data-part="key" style={BOW}>
        {/* the teeth start under the shaft, so their square caps hide beneath it */}
        <g stroke={slot.accent}>
          <path d="M16.5 13v3.5" />
          <path d="M20.5 13v2.5" />
        </g>
        {/* a key's bow is round: a true circle */}
        <circle cx="6" cy="12" r="4.5" />
        <path d="M10.5 12h11" />
      </g>
    </g>
  ),
})
