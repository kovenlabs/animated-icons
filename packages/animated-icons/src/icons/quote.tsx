"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    quote: "pop" | "hop"
  }
}

/** A closing mark: a square head with a slanted tail hanging off its foot, 7 wide. */
const mark = (x: number) => `M${x} 5h7v7l-2 7h-4l2-7h-3z`

/** 2 colors: opening mark (primary), closing mark (accent). */
export const Quote = createAnimatedIcon({
  name: "quote",
  category: "text",
  keywords: ["quote", "quotation", "blockquote", "citation", "testimonial", "speech", "cite"],
  slots: { primary: "first mark", accent: "second mark" },
  defaultVariant: "pop",
  variants: {
    // the marks pop in one after the other, each landing with a small overshoot
    pop: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { scale: [0, 1.15, 1] },
          { duration: seconds * 0.6, times: [0, 0.6, 1], ease: ease.overshoot, delay: stagger(seconds * 0.3) },
        ),
    },
    // the marks hop in turn, like a voice lifting on each word
    hop: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { y: [0, -3, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
          { duration: seconds * 0.65, times: [0, 0.4, 0.75, 1], ease: "easeOut", delay: stagger(seconds * 0.25) },
        ),
    },
  },
  render: () => (
    <>
      <path data-part="mark" d={mark(3)} style={pivot("50% 100%")} />
      <path data-part="mark" d={mark(14)} stroke={slot.accent} style={pivot("50% 100%")} />
    </>
  ),
})
