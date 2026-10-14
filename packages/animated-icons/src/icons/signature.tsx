"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    signature: "sign" | "wave" | "stamp"
  }
}

/**
 * A faceted autograph: two peaks and a dip, trailing off in a flat flourish. The valleys are wide
 * enough that their sharp miters stay 2 clear of the baseline.
 */
const AUTOGRAPH = "M3 15l3-8 3 8 3-6 3 6 2-3h4"

/** 2 colors: baseline (primary), autograph (accent). */
export const Signature = createAnimatedIcon({
  name: "signature",
  category: "text",
  keywords: ["sign", "autograph", "e-signature", "contract", "approve", "handwriting", "agreement", "sign here"],
  slots: { primary: "baseline", accent: "autograph" },
  defaultVariant: "sign",
  variants: {
    // the autograph is wiped and signed again left to right, ending in a proud little bounce
    sign: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          // hidden until it has length: a square cap paints a dot at pathLength 0
          animate(
            "[data-part=autograph]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.2, 0.21, 1] },
          ),
          animate(
            "[data-part=autograph]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.19, 0.2, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=autograph]",
            { scaleY: [1, 1, 1.2, 0.9, 1] },
            { duration: seconds, times: [0, 0.75, 0.84, 0.92, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the ink wobbles like jelly: the autograph shears side to side from the baseline, stretching up
    wave: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=autograph]",
            { skewX: [0, -12, 12, -6, 0], scaleY: [1, 1.18, 0.88, 1.05, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=baseline]", { scaleX: [1, 0.9, 1, 0.96, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the autograph lifts towards you, then slams onto the line like a stamp and the line recoils
    stamp: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=autograph]",
            { y: [0, -2, 0, 0], scale: [1, 1.1, 1, 1], scaleY: [1, 1, 0.8, 1], scaleX: [1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.4, 0.55, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
          animate(
            "[data-part=baseline]",
            { scaleX: [1, 1, 0.9, 1.03, 1] },
            { duration: seconds, times: [0, 0.55, 0.65, 0.8, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="baseline" d="M3 21h18" style={pivot("50% 50%")} />
      <path data-part="autograph" d={AUTOGRAPH} stroke={slot.accent} style={pivot("50% 100%")} />
    </>
  ),
})
