"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    drama: "emote" | "turn" | "spotlight"
  }
}

/** 2 colors: comedy mask (primary), tragedy mask (accent). */
export const Drama = createAnimatedIcon({
  name: "drama",
  category: "media",
  keywords: ["theater", "masks", "comedy", "tragedy", "acting", "performance", "stage", "play"],
  slots: { primary: "comedy mask", accent: "tragedy mask" },
  defaultVariant: "emote",
  variants: {
    // comedy rocks with laughter while tragedy droops and sags with a sigh
    emote: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=comedy]",
            { rotate: [0, -12, 4, -10, 2, 0], y: [0, -2, 0, -2, 0, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=tragedy]",
            { rotate: [0, -10, -10, 0], y: [0, 1.5, 1.5, 0], scaleY: [1, 0.92, 0.92, 1] },
            { duration: seconds, times: [0, 0.35, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // each mask turns all the way round to face you again, the second a beat after the first, popping
    // toward you as it turns
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=comedy]",
            { scaleX: [1, -1, 1], scale: [1, 1.1, 1] },
            { duration: seconds * 0.7, ease: ease.inOut },
          ),
          animate(
            "[data-part=tragedy]",
            { scaleX: [1, -1, 1], scale: [1, 1.1, 1] },
            { duration: seconds * 0.7, delay: seconds * 0.3, ease: ease.inOut },
          ),
        ]),
    },
    // the spotlight passes from one mask to the other: the lit one steps forward, the other falls back
    // into the dark
    spotlight: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=comedy]",
            { scale: [1, 1.18, 0.86, 1], opacity: [1, 1, 0.5, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=tragedy]",
            { scale: [1, 0.86, 1.18, 1], opacity: [1, 0.5, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* two faceted masks with chamfered brows, square eyes and a pointed chin; they never overlap */}
      <g data-part="tragedy" stroke={slot.accent} style={pivot("50% 50%")}>
        <path d="M14 3h7l1 1v4.5L20 13l-2.5 2L15 13l-2-4.5V4Z" />
        <path d="M15.5 11.5l2-1.5 2 1.5" />
        <g fill={slot.accent} stroke="none">
          <rect x="14.75" y="6" width="2" height="2" />
          <rect x="18.25" y="6" width="2" height="2" />
        </g>
      </g>
      <g data-part="comedy" style={pivot("50% 50%")}>
        <path d="M3 9h6l2 2v3.5L9 19l-2.5 2L4 19l-2-4.5V10Z" />
        <path d="M4.5 16l2 1.5 2-1.5" />
        <g fill={slot.primary} stroke="none">
          <rect x="3.75" y="12" width="2" height="2" />
          <rect x="7.25" y="12" width="2" height="2" />
        </g>
      </g>
    </>
  ),
})
