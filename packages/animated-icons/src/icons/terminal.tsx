"use client"

import { steps } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    terminal: "blink" | "type" | "enter"
  }
}

/** 2 colors: window and prompt (primary), cursor line (accent). */
export const Terminal = createAnimatedIcon({
  name: "terminal",
  category: "development",
  keywords: ["console", "shell", "command line", "cli", "bash", "prompt", "command"],
  slots: { primary: "window + prompt", accent: "cursor line" },
  defaultVariant: "blink",
  variants: {
    // the cursor blinks twice, the way a waiting shell does
    blink: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cursor]",
          { opacity: [1, 0, 0, 1, 1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.02, 0.25, 0.27, 0.5, 0.52, 0.75, 0.77], ease: "linear" },
        ),
    },
    // the line clears and types itself back in, a character at a time; hidden until the first one lands
    type: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cursor]",
            { pathLength: [0, 0, 1] },
            { duration: seconds, times: [0, 0.2, 1], ease: ["linear", steps(5, "start")] },
          ),
          animate(
            "[data-part=cursor]",
            { opacity: [0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.21, 1], ease: "linear" },
          ),
        ]),
    },
    // the prompt nudges forward as the command is entered
    enter: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=prompt]",
          { x: [0, 1.5, 0] },
          { duration: seconds, times: [0, 0.35, 1], ease: ["easeOut", "easeInOut"] },
        ),
    },
  },
  render: () => (
    <>
      <path d="M3 3h18v18H3Z" />
      <path data-part="prompt" d="M7 8l3 3-3 3" style={pivot("50% 50%")} />
      {/* sits on the prompt's baseline, 2 clear of the window's inner edge */}
      <path data-part="cursor" d="M12 14h5" stroke={slot.accent} style={pivot("0% 50%")} />
    </>
  ),
})
