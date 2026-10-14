"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    pointer: "tap" | "wag" | "flip"
  }
}

/** 2 colors: hand (primary), tap rays (accent). */
export const Pointer = createAnimatedIcon({
  name: "pointer",
  category: "actions",
  keywords: ["hand", "finger", "tap", "touch", "click", "point", "select", "cursor"],
  slots: { primary: "hand", accent: "tap rays" },
  defaultVariant: "tap",
  variants: {
    // the hand pushes into the screen toward its fingertip, rays burst from the tip, and it springs back out
    tap: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hand]",
            { scale: [1, 0.78, 1.03, 1], scaleY: [1, 0.9, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: [ease.in, ease.overshoot, "easeOut"] },
          ),
          animate("[data-part=ray]", blink, { duration: seconds * 0.55, delay: seconds * 0.25, ease: "easeOut" }),
        ]),
    },
    // pulled back into the distance, the hand wags its finger from the wrist and comes forward again
    wag: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pointer]",
          { scale: [1, 0.85, 0.85, 0.85, 0.85, 1], rotate: [0, -12, 8, -6, 3, 0] },
          { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
        ),
    },
    // turns over on its vertical axis, leaning in perspective as it goes edge-on, and lands with a tap
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pointer]",
            { scaleX: [1, -1, 1], skewY: [0, 6, 0] },
            { duration: seconds * 0.8, times: [0, 0.5, 1], ease: "easeInOut" },
          ),
          animate("[data-part=ray]", blink, { duration: seconds * 0.3, delay: seconds * 0.7, ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      {/* two rays either side of the fingertip, each growing from its inner end */}
      <g stroke={slot.accent}>
        <path data-part="ray" d="M4 5 2.5 3.5" style={flash("100% 100%")} />
        <path data-part="ray" d="M12 5l1.5-1.5" style={flash("0% 100%")} />
      </g>
      {/* the whole hand turns from the wrist; inside it, the hand presses toward its fingertip */}
      <g data-part="pointer" style={pivot("50% 100%")}>
        <g data-part="hand" style={pivot("28% 0%")}>
          {/* a raised index finger over a fist of three folded fingers, a bevelled heel and a thumb tucked down-left */}
          <path d="M6 12V3h4v6h11v7l-5 5h-6l-7-7z" />
          <path d="M14 9v3M18 9v3" />
        </g>
      </g>
    </>
  ),
})
