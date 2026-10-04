"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"
import { dots } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    braces: "fill" | "bounce" | "flip"
  }
}

/** Three 2×2 dots between the braces, only there while it fills. */
const DOTS = dots(12, 12, 3.5)

/** 1 color. The dots only exist in motion. */
export const Braces = createAnimatedIcon({
  name: "braces",
  category: "development",
  keywords: ["curly brackets", "json", "object", "code", "block", "scope", "syntax"],
  slots: { primary: "braces + dots" },
  defaultVariant: "fill",
  variants: {
    // the braces open a little and three dots pop in between them one by one, then all clear
    fill: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const open = { duration: seconds, times: [0, 0.25, 0.8, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=left]", { x: [0, -1, -1, 0] }, open),
          animate("[data-part=right]", { x: [0, 1, 1, 0] }, open),
          animate(
            "[data-part=dot]",
            { opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1, 1] },
            {
              duration: seconds * 0.65,
              times: [0, 0.2, 0.8, 1],
              delay: stagger(seconds * 0.1, { startDelay: seconds * 0.15 }),
              ease: "easeOut",
            },
          ),
        ])
      },
    },
    // left then right, each brace takes a small hop and lands
    bounce: {
      duration: 800,
      run: ({ animate, seconds }) => {
        const hop = { y: [0, -2.5, 0, 0], scaleY: [1, 1.03, 0.95, 1] }
        const timing = { duration: seconds * 0.6, times: [0, 0.4, 0.75, 1], ease: "easeOut" as const }
        return Promise.all([
          animate("[data-part=left]", hop, timing),
          animate("[data-part=right]", hop, { ...timing, delay: seconds * 0.4 }),
        ])
      },
    },
    // each brace turns over in turn, its point swinging inward for a beat
    flip: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const turn = { scaleX: [1, -1, 1] }
        const timing = { duration: seconds * 0.6, ease: ease.inOut }
        return Promise.all([
          animate("[data-part=left]", turn, timing),
          animate("[data-part=right]", turn, { ...timing, delay: seconds * 0.4 }),
        ])
      },
    },
  },
  render: () => (
    <>
      {/* each brace is a bracket with a pointed waist */}
      <path data-part="left" d="M8 3H5v7l-2 2 2 2v7h3" style={pivot("50% 100%")} />
      <path data-part="right" d="M16 3h3v7l2 2-2 2v7h-3" style={pivot("50% 100%")} />
      <g fill={slot.primary} stroke="none">
        {DOTS.map(({ x, y }) => (
          <rect key={x} data-part="dot" x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
    </>
  ),
})
