"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "heart-handshake": "beat" | "shake" | "hug"
  }
}

/** The faceted heart of the heart family. */
const HEART = "M12 20.5 3 11.5v-4L6.5 4h2L12 7.5 15.5 4h2L21 7.5v4Z"

/** 2 colors: heart (primary), clasped hands (accent). */
export const HeartHandshake = createAnimatedIcon({
  name: "heart-handshake",
  family: "heart",
  category: "social",
  keywords: ["partnership", "agreement", "deal", "trust", "charity", "cooperation", "friendship", "care"],
  slots: { primary: "heart", accent: "clasped hands" },
  defaultVariant: "beat",
  variants: {
    // lub-dub: the heart swells twice, squashing a little with each beat, the clasp pulsing with it
    beat: {
      duration: 800,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.15, 0.3, 0.45, 1], ease: "easeOut" as const }
        return Promise.all([
          animate("[data-part=heart]", { scale: [1, 1.1, 0.97, 1.06, 1], scaleY: [1, 0.96, 1.02, 0.98, 1] }, timing),
          animate("[data-part=clasp]", { opacity: [1, 0.55, 1, 0.7, 1] }, timing),
        ])
      },
    },
    // a firm handshake: the whole heart pumps up and down, tilting in perspective
    shake: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=heart]",
          {
            y: [0, -1.2, 1.2, -1, 0.8, 0],
            rotate: [0, -6, 6, -4, 2, 0],
            skewX: [0, 4, -4, 3, -1, 0],
          },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // a hug: the heart squeezes wide, springs tall, and wobbles back into shape
    hug: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=heart]",
          { scaleX: [1, 1.08, 0.9, 1.04, 0.98, 1], scaleY: [1, 0.86, 1.08, 0.96, 1.01, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 0.85, 1], ease: ["easeOut", "easeInOut", "easeInOut", "easeInOut", ease.out] },
        ),
    },
  },
  render: () => (
    <g data-part="heart" style={pivot("50% 50%")}>
      <path d={HEART} />
      {/* the hand reaching across: from the notch it hooks a thumb down and round, runs along the
          knuckles and joins the right flank, like the top of a hand gripping another */}
      <path data-part="clasp" d="M12 7.5 8.5 11l3 3 3-3H16l2.75 2.75" stroke={slot.accent} />
    </g>
  ),
})
