"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    menu: "slide" | "shorten" | "spread"
  }
}

/** 2 colors: top and bottom lines (primary), middle line (accent). */
export const Menu = createAnimatedIcon({
  name: "menu",
  category: "navigation",
  keywords: ["hamburger", "navigation", "sidebar", "drawer", "lines", "options"],
  slots: { primary: "top + bottom lines", accent: "middle line" },
  defaultVariant: "slide",
  variants: {
    // each line slides right and back, top to bottom, like a drawer being pulled
    slide: {
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["top", "middle", "bottom"].map((part, i) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, 2, 0] },
              { duration: seconds * 0.6, delay: seconds * 0.2 * i, ease: "easeInOut" },
            ),
          ),
        ),
    },
    // the middle line pulls in from its right end and springs back to full length
    shorten: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=middle]",
          { pathLength: [1, 0.5, 1] },
          { duration: seconds, times: [0, 0.4, 1], ease: ["easeInOut", ease.overshoot] },
        ),
    },
    // the outer lines spread apart from the middle and settle back
    spread: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=top]",
            { y: [0, -2, 0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bottom]",
            { y: [0, 2, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="top" d="M4 6h16" />
      <path data-part="middle" d="M4 12h16" stroke={slot.accent} style={pivot("0% 50%")} />
      <path data-part="bottom" d="M4 18h16" />
    </>
  ),
})
