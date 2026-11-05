"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "remove-formatting": "clear" | "fade"
  }
}

/** 2 colors: letter (primary), clearing cross (accent). */
export const RemoveFormatting = createAnimatedIcon({
  name: "remove-formatting",
  category: "text",
  keywords: ["remove formatting", "clear formatting", "plain text", "reset style", "unformat", "eraser", "typography"],
  slots: { primary: "letter", accent: "cross" },
  defaultVariant: "clear",
  variants: {
    // the cross pops and spins a quarter turn; a turned cross is the same cross, so it snaps home unseen
    clear: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cross]",
            { rotate: [0, 90, 90, 0] },
            { duration: seconds, times: [0, 0.7, 0.999, 1], ease: ["easeInOut", "linear", snap] },
          ),
          animate(
            "[data-part=cross]",
            { scale: [1, 1.2, 1] },
            { duration: seconds * 0.7, times: [0, 0.4, 1], ease: ["easeOut", ease.overshoot] },
          ),
        ]),
    },
    // the formatted letter fades almost away while the cross pulses, then the letter comes back
    fade: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=letter]",
            { opacity: [1, 0.25, 0.25, 1] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=cross]",
            { scale: [1, 1.15, 1] },
            { duration: seconds * 0.6, times: [0, 0.5, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a serifed T whose stem leans like italic, its foot under the stem's end */}
      <path data-part="letter" d="M4 7V4h16v3M13 4 8 20M5 20h6" />
      <path data-part="cross" d="M15 15l5 5M20 15l-5 5" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
