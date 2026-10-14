"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "phone-incoming": "incoming" | "ring" | "answer"
  }
}

/** The `phone` handset: earpiece top-left, mouthpiece bottom-right, faceted back. */
const HANDSET = "M3 3h5l2 5-2.5 2.5 6 6L16 14l5 2v5h-5l-7-3-3-3-3-7Z"

/** 2 colors: handset (primary), incoming arrow (accent). */
export const PhoneIncoming = createAnimatedIcon({
  name: "phone-incoming",
  family: "phone",
  category: "communication",
  keywords: ["incoming call", "call", "telephone", "receive", "ringing", "inbound", "answer"],
  slots: { primary: "handset", accent: "incoming arrow" },
  defaultVariant: "incoming",
  variants: {
    // the arrow zips out of the corner and flies back in, and the handset jolts as it lands
    incoming: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arrow]",
            { x: [0, 9, 9, -1, 0], y: [0, -9, -9, 1, 0], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds * 0.7, times: [0, 0.3, 0.35, 0.8, 1], ease: [ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=handset]",
            { rotate: [0, -14, 10, -6, 3, 0], scale: [1, 1.06, 0.96, 1.02, 1, 1] },
            { duration: seconds * 0.45, delay: seconds * 0.55, ease: "easeInOut" },
          ),
        ]),
    },
    // the handset rattles in perspective while the arrow pumps in towards it, twice
    ring: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handset]",
            { rotate: [0, -12, 10, -8, 6, -3, 0], scaleX: [1, 0.92, 1, 0.94, 1, 1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=arrow]",
            { x: [0, -1, 0.5, -1, 0.5, 0], y: [0, 1, -0.5, 1, -0.5, 0], scale: [1, 0.8, 1.12, 0.8, 1.1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // picked up: the handset lifts towards you and tips back, swallowing the arrow, which pops back after
    answer: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handset]",
            { scale: [1, 1.1, 1.1, 0.97, 1], rotate: [0, -14, -14, 3, 0], y: [0, -1, -1, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=arrow]",
            { scale: [1, 0, 0, 1.25, 1], opacity: [1, 0, 0, 1, 1], x: [0, -2, -2, 0, 0], y: [0, 2, 2, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.6, 0.8, 1], ease: ["easeIn", "linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="handset" d={HANDSET} style={pivot("50% 50%")} />
      {/* an arrow aimed down into the open corner, at the handset; it scales from its point */}
      <g data-part="arrow" stroke={slot.accent} style={pivot("0% 100%")}>
        <path d="M20.5 3.5 15 9" />
        <path d="M15 4v5h5" />
      </g>
    </>
  ),
})
