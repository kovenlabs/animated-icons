"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "phone-missed": "miss" | "shake" | "hangup"
  }
}

/** The `phone` handset: earpiece top-left, mouthpiece bottom-right, faceted back. */
const HANDSET = "M3 3h5l2 5-2.5 2.5 6 6L16 14l5 2v5h-5l-7-3-3-3-3-7Z"

/** 2 colors: handset (primary), cross (accent). */
export const PhoneMissed = createAnimatedIcon({
  name: "phone-missed",
  family: "phone",
  category: "communication",
  keywords: ["missed call", "call", "telephone", "unanswered", "declined", "rejected", "no answer"],
  slots: { primary: "handset", accent: "cross" },
  defaultVariant: "miss",
  variants: {
    // the handset rings unanswered, the ringing stops dead, and the cross spins back in and slams down
    miss: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handset]",
            { rotate: [0, -12, 10, -8, 6, 0, 0], y: [0, 0, 0, 0, 0, 0.6, 0] },
            { duration: seconds, times: [0, 0.1, 0.22, 0.34, 0.46, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=cross]",
            { scale: [1, 0, 0, 1.3, 0.9, 1], rotate: [0, -90, -90, 0, 0, 0] },
            { duration: seconds, times: [0, 0.12, 0.5, 0.68, 0.84, 1], ease: ["easeIn", "linear", ease.out, "easeInOut", "easeOut"] },
          ),
        ]),
    },
    // the cross shakes its head no, and the handset shrinks back from it
    shake: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cross]",
            { x: [0, -1.5, 1.5, -1.2, 0.8, 0], rotate: [0, -18, 16, -10, 5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=handset]",
            { scale: [1, 0.92, 0.92, 1], rotate: [0, 6, 6, 0] },
            { duration: seconds, times: [0, 0.2, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the handset turns over in perspective and thuds back down; the cross ducks out of its way and slams back in with the thud
    hangup: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handset]",
            { scaleX: [1, 0, -1, 0, 1, 1, 1], scaleY: [1, 1, 1, 1, 1, 0.88, 1], y: [0, -1, -1.5, -1, 0, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.45, 0.6, 0.72, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=cross]",
            { opacity: [1, 0, 0, 1, 1, 1], scale: [1, 0, 0, 1.3, 0.9, 1] },
            { duration: seconds, times: [0, 0.14, 0.58, 0.72, 0.86, 1], ease: ["easeIn", "linear", ease.out, "easeInOut", "easeOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="handset" d={HANDSET} style={pivot("50% 50%")} />
      {/* a cross in the corner the handset leaves open */}
      <g data-part="cross" stroke={slot.accent} style={pivot("50% 50%")}>
        <path d="M15.5 3.5l5 5" />
        <path d="M20.5 3.5l-5 5" />
      </g>
    </>
  ),
})
