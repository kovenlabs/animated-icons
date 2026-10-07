"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "thumbs-up": "pump" | "flip"
  }
}

/** 2 colors: hand (primary), cuff and motion lines (accent). */
export const ThumbsUp = createAnimatedIcon({
  name: "thumbs-up",
  family: "thumbs",
  category: "social",
  keywords: ["like", "approve", "upvote", "good", "agree", "recommend", "yes"],
  slots: { primary: "hand", accent: "cuff + motion lines" },
  defaultVariant: "pump",
  variants: {
    // a confident pump: the hand lifts and tips back on its wrist, two motion lines flick out
    pump: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hand]",
            { y: [0, -2.5, 0, 0], rotate: [0, -10, 3, 0] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate("[data-part=line]", blink, { duration: seconds * 0.6, delay: seconds * 0.15, ease: "easeOut" }),
        ]),
    },
    // turns over into a thumbs-down, holds it, and turns back up
    flip: {
      clip: false,
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=thumb]",
          { rotate: [0, 180, 180, 0] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="line" d="M18 5l2-2" style={flash("0% 100%")} />
        <path data-part="line" d="M19 8h2" style={flash("0% 50%")} />
      </g>
      <g data-part="thumb" style={pivot("50% 50%")}>
        <g data-part="hand" style={pivot("0% 100%")}>
          {/* the cuff, and a faceted hand that shares its right edge: thumb raised, flat knuckles */}
          <path d="M3 10h4v11H3Z" stroke={slot.accent} />
          <path d="M7 10l4-7.5h1.5L14.5 5 14 10h6l1 1.5L19 21H7" />
        </g>
      </g>
    </>
  ),
})
