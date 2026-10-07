"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    puzzle: "flip" | "snap" | "tilt"
  }
}

/**
 * One jigsaw piece: a 14 square body with a round knob (a true arc, r 2.5, on a 3 wide neck) on the
 * middle of its top edge and another on the middle of its right edge.
 */
const PIECE = "M3 7h5.5a2.5 2.5 0 1 1 3 0H17v5.5a2.5 2.5 0 1 1 0 3V21H3z"

/** 2 colors: piece (primary), snap marks (accent). */
export const Puzzle = createAnimatedIcon({
  name: "puzzle",
  category: "gaming",
  keywords: ["jigsaw", "piece", "plugin", "extension", "integration", "add-on", "fit", "solution"],
  slots: { primary: "piece", accent: "snap marks" },
  defaultVariant: "flip",
  variants: {
    // picked up toward you, the piece turns a full circle about its vertical axis (its knob swings to
    // the left side and back), then drops into place with a squash and a snap
    flip: {
      duration: 1250,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 1],
              ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"],
            },
          ),
          animate(
            "[data-part=piece]",
            { y: [0, -2, -2, 0, 0], scaleX: [1, 1.1, 1.1, 1.08, 1], scaleY: [1, 1.1, 1.1, 0.88, 1] },
            { duration: seconds, times: [0, 0.15, 0.65, 0.78, 1], ease: "easeInOut" },
          ),
          animate("[data-part=mark]", blink, { duration: seconds * 0.3, delay: seconds * 0.74, ease: "easeOut" }),
        ]),
    },
    // lifted and twisted toward you, then pressed home: it lands a touch small with a snap and settles
    snap: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=piece]",
            { scale: [1, 1.3, 0.9, 1], rotate: [0, -14, 0, 0], y: [0, -2, 0, 0] },
            { duration: seconds, times: [0, 0.4, 0.6, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
          animate("[data-part=mark]", blink, { duration: seconds * 0.35, delay: seconds * 0.58, ease: "easeOut" }),
        ]),
    },
    // tips back on its bottom edge like a card, then springs upright past straight
    tilt: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=piece]",
          { scaleY: [1, 0.62, 1.08, 0.97, 1], skewX: [0, -16, 5, -1.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.62, 0.82, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="piece" style={pivot("50% 100%")}>
        <path data-part="turn" d={PIECE} style={pivot("50% 50%")} />
      </g>
      {/* click marks off the body's top-right corner, in the open space between the two knobs */}
      <g stroke={slot.accent}>
        <path data-part="mark" d="M17 4.5V2.5" style={flash("50% 100%")} />
        <path data-part="mark" d="M19.5 4.5 21 3" style={flash("0% 100%")} />
        <path data-part="mark" d="M19.5 7h2" style={flash("0% 50%")} />
      </g>
    </>
  ),
})
