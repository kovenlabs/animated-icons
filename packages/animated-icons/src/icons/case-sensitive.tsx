"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "case-sensitive": "swap" | "bounce"
  }
}

/** 2 colors: capital A (primary), small a (accent). */
export const CaseSensitive = createAnimatedIcon({
  name: "case-sensitive",
  category: "text",
  keywords: ["case sensitive", "match case", "uppercase", "lowercase", "letter case", "Aa", "typography"],
  slots: { primary: "capital", accent: "small letter" },
  defaultVariant: "swap",
  variants: {
    // the capital shrinks and the small letter grows, trading sizes for a beat, then both return
    swap: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.35, 0.6, 1],
          ease: ["easeInOut" as const, "linear" as const, ease.out],
        }
        return Promise.all([
          animate("[data-part=capital]", { scale: [1, 0.75, 0.75, 1] }, options),
          animate("[data-part=small]", { scale: [1, 1.2, 1.2, 1] }, options),
        ])
      },
    },
    // the two letters hop off the baseline one after the other
    bounce: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["capital", "small"].map((part, i) =>
            animate(
              `[data-part=${part}]`,
              { y: [0, -3, 0] },
              { duration: seconds * 0.6, delay: seconds * 0.3 * i, ease: ["easeOut", "easeIn"] },
            ),
          ),
        ),
    },
  },
  render: () => (
    <>
      {/* a pointed A with its crossbar 2 clear inside each leg; both letters scale from the baseline */}
      <path data-part="capital" d="M2 19 7 5l5 14M4.5 15h5" style={pivot("50% 100%")} />
      {/* a single-storey a: an octagonal bowl tapering into its upright */}
      <path
        data-part="small"
        d="M21 11v8M21 13l-2-2h-1l-2 2v4l2 2h1l2-2"
        stroke={slot.accent}
        style={pivot("50% 100%")}
      />
    </>
  ),
})
