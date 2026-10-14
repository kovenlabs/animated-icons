"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "clipboard-paste": "paste" | "snap" | "shove"
  }
}

/** 2 colors: board and clip (primary), arrow (accent). */
export const ClipboardPaste = createAnimatedIcon({
  name: "clipboard-paste",
  family: "clipboard",
  category: "files",
  keywords: ["paste", "insert", "clipboard", "copy paste", "put", "drop in", "transfer"],
  slots: { primary: "board + clip", accent: "arrow" },
  defaultVariant: "paste",
  variants: {
    // the arrow fires out through the board's open side and off the frame, the board recoiling, and a
    // fresh one fades up inside the board and slides into place
    paste: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arrow]",
            { x: [0, -1.5, 15, 15, -2.5, 0], opacity: [1, 1, 1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.15, 0.42, 0.43, 0.5, 1], ease: ["easeOut", ease.in, "linear", "linear", ease.out] },
          ),
          animate(
            "[data-part=board]",
            { x: [0, 0, -1.5, 0], scaleX: [1, 1, 0.94, 1] },
            { duration: seconds * 0.7, times: [0, 0.4, 0.55, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the clip is slammed shut: it squashes flat and wide, the board buckles and shudders, and the arrow is jolted on
    snap: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=clip]",
            { scaleY: [1, 0.5, 1.04, 1], scaleX: [1, 1.25, 0.95, 1] },
            { duration: seconds * 0.6, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=board]",
            { scaleY: [1, 1, 0.93, 1, 1, 1], x: [0, 0, -0.8, 0.6, -0.3, 0] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=arrow]",
            { x: [0, 0, 0.8, 0], scaleX: [1, 1, 1.08, 1] },
            { duration: seconds, times: [0, 0.22, 0.4, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the board swings open on its left edge like a door while the arrow draws back, then thrusts out
    shove: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=board]",
            { scaleX: [1, 0.86, 0.86, 1], skewY: [0, -4, -4, 0] },
            { duration: seconds, times: [0, 0.35, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=arrow]",
            { x: [0, -3, 0.8, 0], scaleX: [1, 0.8, 1.05, 1] },
            { duration: seconds, times: [0, 0.4, 0.6, 1], ease: ["easeOut", ease.in, "easeOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="board" style={pivot("0% 100%")}>
        {/* the board's top edge stops at the clip; its right side is open where the arrow leaves */}
        <path d="M8 4H4v18h15v-2" />
        <path d="M16 4h3v3" />
        <path data-part="clip" d="M8 2h8v4H8z" style={pivot("50% 100%")} />
      </g>
      <g data-part="arrow" stroke={slot.accent} style={pivot("100% 50%")}>
        <path d="M10 14h9.5" />
        <path d="M17.5 11l3 3-3 3" />
      </g>
    </>
  ),
})
