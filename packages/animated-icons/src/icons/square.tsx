"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    square: "press" | "turn" | "draw"
  }
}

/** The box of the square family, drawn from the top-left corner clockwise: square-check and square-x share it. */
const BOX = "M3 3h18v18H3z"

/** 1 color: box. */
export const Square = createAnimatedIcon({
  name: "square",
  category: "design",
  keywords: ["stop", "box", "shape", "rectangle", "checkbox", "outline", "block"],
  slots: { primary: "box" },
  defaultVariant: "press",
  variants: {
    // pressed like a stop button: dips in and springs back
    press: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=box]",
          { scale: [1, 0.86, 1.04, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // a quarter turn that lands with a small overshoot. A square looks the same a quarter turn back,
    // so it starts there and comes to rest at 0 without a visible jump; it shrinks so its corners stay in frame
    turn: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=box]",
          { rotate: [-90, 0], scale: [1, 0.75, 1] },
          { duration: seconds, ease: ease.overshoot },
        ),
    },
    // fades out, then draws itself on again clockwise from the top-left; hidden while too short to read
    draw: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=box]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=box]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.14, 0.16, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => <path data-part="box" d={BOX} style={pivot("50% 50%")} />,
})
