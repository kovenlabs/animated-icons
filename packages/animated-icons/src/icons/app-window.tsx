"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "app-window": "launch" | "blink" | "load"
  }
}

/** 2 colors: window and title bar (primary), title-bar buttons (accent). */
export const AppWindow = createAnimatedIcon({
  name: "app-window",
  category: "layout",
  keywords: ["window", "application", "browser", "program", "desktop", "tab", "title bar"],
  slots: { primary: "window and title bar", accent: "title-bar buttons" },
  defaultVariant: "launch",
  variants: {
    // the whole window shrinks a touch, then opens out with a light overshoot, like an app launching
    launch: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=window]",
          { scale: [1, 0.85, 1.05, 1] },
          { duration: seconds, times: [0, 0.35, 0.75, 1], ease: ["easeInOut", ease.overshoot, "easeOut"] },
        ),
    },
    // the title-bar buttons blink shut one after the other, like eyes
    blink: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=button]",
          { scaleY: [1, 0, 1] },
          { duration: seconds * 0.5, ease: "easeInOut", delay: stagger(seconds * 0.25) },
        ),
    },
    // the title bar's rule fades, then draws back across from the left like a loading bar; hidden
    // until it has length (a square cap paints a dot at pathLength 0)
    load: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bar]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.25, 0.27, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=bar]",
            { pathLength: [1, 1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.15, 0.16, 0.25, 1], ease: ["linear", "linear", "linear", ease.out] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="window" style={pivot("50% 50%")}>
      <rect x="2" y="4" width="20" height="16" />
      <path data-part="bar" d="M3 8h18" />
      <g stroke={slot.accent}>
        <path data-part="button" d="M6 4v4" style={pivot("50% 50%")} />
        <path data-part="button" d="M10 4v4" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
