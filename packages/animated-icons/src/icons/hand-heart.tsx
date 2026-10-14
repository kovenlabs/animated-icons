"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "hand-heart": "offer" | "toss" | "spin"
  }
}

/** A small faceted heart floating over the open palm. */
const HEART = "M14 11.5l-5-5v-2l2-2h1l2 2 2-2h1l2 2v2Z"

/** 2 colors: hand (primary), heart (accent). */
export const HandHeart = createAnimatedIcon({
  name: "hand-heart",
  family: "hand",
  category: "social",
  keywords: ["charity", "donate", "care", "kindness", "volunteer", "love", "give", "support"],
  slots: { primary: "hand", accent: "heart" },
  defaultVariant: "offer",
  variants: {
    // the hand dips and lifts the heart, which beats twice as it's held out
    offer: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.2, 0.35, 0.5, 0.65, 1] }
        return Promise.all([
          animate("[data-part=hand]", { y: [0, 1, 1, 0.5, 0.5, 0] }, { ...timing, ease: "easeInOut" }),
          animate(
            "[data-part=heart]",
            { y: [0, 1, 1, 0.5, 0.5, 0], scale: [1, 1, 1.15, 1, 1.1, 1] },
            { ...timing, ease: "easeOut" },
          ),
        ])
      },
    },
    // flicked up out of the frame turning over, it falls back into the palm and lands with a squash
    toss: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hand]",
            { y: [0, 1.2, -1, 0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.15, 0.25, 0.35, 0.75, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=heart]",
            { y: [0, 1.2, -14, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.75, 1], ease: ["easeInOut", ease.out, "easeIn", "linear"] },
          ),
          animate(
            "[data-part=heart]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1.15, 1], scaleY: [1, 1, 1, 1, 1, 1, 0.75, 1] },
            {
              duration: seconds,
              times: [0, 0.2, 0.33, 0.46, 0.6, 0.74, 0.82, 1],
              ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "easeOut", ease.overshoot],
            },
          ),
        ]),
    },
    // the heart spins round twice in perspective above the palm, which rocks as it turns
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=heart]",
            { scaleX: [1, 0, -1, 0, 1, 0, -1, 0, 1], skewY: [0, 8, 0, -8, 0, 8, 0, -8, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=hand]", { rotate: [0, -4, 3, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      {/* the `hand-coins` hand: cuff, thumb along the top of the palm, fingers reaching up and right */}
      <g data-part="hand" style={pivot("0% 100%")}>
        <path d="M2 13v9" />
        <path d="M4 14h5l4 3H9" />
        <path d="M4 21h10l8-6-2-2-7 4" />
      </g>
      <path data-part="heart" d={HEART} stroke={slot.accent} style={pivot("50% 100%")} />
    </>
  ),
})
