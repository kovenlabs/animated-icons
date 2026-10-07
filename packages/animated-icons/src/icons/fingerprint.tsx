"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"
import { stagger } from "motion/react"

declare module "../lib/types" {
  interface IconVariants {
    fingerprint: "scan" | "trace" | "press"
  }
}

/**
 * A simplified print, legible at 16px: nested arches around (12, 11), 4 apart so every gap stays 2px,
 * with uneven legs and one broken ridge so it reads as skin, not as a target. A print is round, so the
 * arches are true arcs. Listed from the core outward, the order `trace` draws them in.
 */
const RIDGES = ["M12 11v8", "M8 21V11a4 4 0 0 1 8 0v6", "M4 16v-5a8 8 0 0 1 16 0v1", "M20 16v3"]

/** 2 colors: ridges (primary), scan line (accent). The scan line only exists in motion. */
export const Fingerprint = createAnimatedIcon({
  name: "fingerprint",
  category: "security",
  keywords: ["passkey", "biometric", "touch id", "identity", "authentication", "sign in", "scan"],
  slots: { primary: "ridges", accent: "scan line" },
  defaultVariant: "scan",
  variants: {
    // a scan line sweeps down across the print and fades out at the bottom
    scan: {
      clip: false,
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=scan]",
          { y: [-9, 9], opacity: [0, 1, 1, 0] },
          {
            duration: seconds,
            times: [0, 0.15, 0.85, 1],
            ease: "easeInOut",
          },
        ),
    },
    // the ridges fade out and trace back in, from the core outward; hidden while too short to read
    trace: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ridge]",
            { opacity: [1, 0, 0, 1] },
            {
              duration: seconds * 0.5,
              times: [0, 0.3, 0.45, 1],
              delay: stagger(seconds * 0.1),
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=ridge]",
            { pathLength: [1, 1, 0, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.18, 0.2, 1],
              delay: stagger(seconds * 0.1),
              ease: "easeOut",
            },
          ),
        ]),
    },
    // a finger presses on the reader: the print squeezes in and springs back
    press: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=print]",
          { scale: [1, 0.9, 1.05, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="print" style={pivot("50% 50%")}>
        {RIDGES.map((d) => (
          <path d={d} data-part="ridge" key={d} />
        ))}
      </g>
      <path d="M2 12h20" data-part="scan" stroke={slot.accent} style={flash()} />
    </>
  ),
})
