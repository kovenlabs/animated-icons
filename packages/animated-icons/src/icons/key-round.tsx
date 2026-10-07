"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "key-round": "turn" | "jangle" | "unlock"
  }
}

/**
 * Like `key`, the key is drawn lying flat (round bow right, teeth hanging below the shaft) and the whole
 * drawing is laid on the diagonal, so its moves stay simple in its own frame: `x` slides along the shaft,
 * `scaleY` rolls it over around the shaft. Its box is 2..21 × 7.5..16.5; the shaft runs along y 12
 * (50%), the ring hole sits at (17, 12).
 */
const SHAFT = pivot("50% 50%")
const HOLE = pivot("78.9% 50%")

/** 2 colors: bow and shaft (primary), teeth (accent). */
export const KeyRound = createAnimatedIcon({
  name: "key-round",
  family: "key",
  category: "security",
  keywords: ["key", "password", "access", "unlock", "credentials", "login", "auth", "passkey"],
  slots: { primary: "bow + shaft", accent: "teeth" },
  defaultVariant: "turn",
  variants: {
    // lifted toward you and rolled a full turn around its shaft: the bow narrows edge-on, the teeth swing
    // over to the far side and round again, then it settles back down
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lift]",
            { scale: [1, 1.14, 1.14, 1] },
            { duration: seconds, times: [0, 0.25, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=key]",
            { scaleY: [1, -1, 1] },
            { duration: seconds * 0.8, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
    // hangs from its ring hole and swings out, back and settles, like a key on a hook
    jangle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=swing]",
          { rotate: [0, 22, -15, 9, -4, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // pushed into the lock, turned a quarter so it shows edge-on, turned back and drawn out
    unlock: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=key]",
          { x: [0, -3, -3, -3, -3, 0.5, 0], scaleY: [1, 1, 0.15, 0.15, 1, 1, 1] },
          { duration: seconds, times: [0, 0.2, 0.38, 0.58, 0.76, 0.92, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="lift" style={pivot("50% 50%")}>
      <g transform="translate(-0.5 -1) rotate(-45 12 12)">
        <g data-part="key" style={SHAFT}>
          <g data-part="swing" style={HOLE}>
            {/* the teeth start under the shaft, so their square caps hide beneath it */}
            <g stroke={slot.accent}>
              <path d="M3 13v3.5" />
              <path d="M7 13v2.5" />
            </g>
            <path d="M2 12h10" />
            {/* a round bow is round: a true circle, with a square ring hole toward its end */}
            <circle cx="16.5" cy="12" r="4.5" />
            <rect x="16" y="11" width="2" height="2" fill={slot.primary} stroke="none" />
          </g>
        </g>
      </g>
    </g>
  ),
})
