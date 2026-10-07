"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "thumbs-down": "drop" | "turn" | "shake"
  }
}

/** 2 colors: hand (primary), cuff and motion lines (accent). */
export const ThumbsDown = createAnimatedIcon({
  name: "thumbs-down",
  family: "thumbs",
  category: "social",
  keywords: ["dislike", "disapprove", "downvote", "bad", "disagree", "reject", "no"],
  slots: { primary: "hand", accent: "cuff + motion lines" },
  defaultVariant: "drop",
  variants: {
    // a firm verdict: the hand winds up, slams down twice tipping on its wrist, and two motion lines
    // flick out below
    drop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hand]",
            { y: [0, -1.5, 3, 0, 1.5, 0], rotate: [0, -4, 10, -2, 5, 0] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.75, 1], ease: ["easeOut", "easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate("[data-part=line]", blink, { duration: seconds * 0.55, delay: seconds * 0.35, ease: "easeOut" }),
        ]),
    },
    // turned over on its long axis: the hand rolls through edge-on to a thumbs-up, holds, and rolls back
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=thumb]",
          { scaleY: [1, 0, -1, -1, 0, 1] },
          { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: ["easeIn", "easeOut", "linear", "easeIn", "easeOut"] },
        ),
    },
    // wagged side to side from the wrist: no, no, no
    shake: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=thumb]",
          { rotate: [0, -14, 12, -10, 6, 0], x: [0, -1, 1, -1, 0.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="line" d="M18 19l2 2" style={flash("0% 0%")} />
        <path data-part="line" d="M19 16h2" style={flash("0% 50%")} />
      </g>
      <g data-part="thumb" style={pivot("50% 50%")}>
        <g data-part="hand" style={pivot("0% 0%")}>
          {/* thumbs-up turned upside down: the cuff, and a faceted hand with the thumb pointing down */}
          <path d="M3 14h4V3H3Z" stroke={slot.accent} />
          <path d="M7 14l4 7.5h1.5L14.5 19 14 14h6l1-1.5L19 3H7" />
        </g>
      </g>
    </>
  ),
})
