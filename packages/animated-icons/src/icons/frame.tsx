"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    frame: "tilt" | "resize" | "draw"
  }
}

/** The four rules, in the order a pen would draw them round the frame (each drawn from its start). */
const RULES = [
  { part: "top", d: "M2 6h20" },
  { part: "right", d: "M18 2v20" },
  { part: "bottom", d: "M22 18H2" },
  { part: "left", d: "M6 22V2" },
] as const

/** 1 color: the four crossing rules. */
export const Frame = createAnimatedIcon({
  name: "frame",
  category: "design",
  keywords: ["artboard", "canvas", "layout", "board", "figma", "container", "grid", "design tool"],
  slots: { primary: "rules" },
  defaultVariant: "tilt",
  variants: {
    // sways round a vertical axis in perspective: the near side grows tall, the far side shrinks and
    // the rules converge towards it, first one way, then the other, then springs flat
    tilt: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, times: [0, 0.3, 0.7, 1], ease: ["easeInOut", "easeInOut", ease.overshoot] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=top]", { skewY: [0, 9, -9, 0], scaleX: [1, 0.9, 0.9, 1] }, options),
          animate("[data-part=bottom]", { skewY: [0, -9, 9, 0], scaleX: [1, 0.9, 0.9, 1] }, options),
          animate("[data-part=left]", { x: [0, -1, 2, 0], scaleY: [1, 1.15, 0.85, 1] }, options),
          animate("[data-part=right]", { x: [0, -2, 1, 0], scaleY: [1, 0.85, 1.15, 1] }, options),
        ])
      },
    },
    // the frame is squeezed in from all four sides, then dragged out past its size and springs back
    resize: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeInOut", ease.out, ease.overshoot] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=top]", { y: [0, 2.5, -2, 0] }, options),
          animate("[data-part=bottom]", { y: [0, -2.5, 2, 0] }, options),
          animate("[data-part=left]", { x: [0, 2.5, -2, 0] }, options),
          animate("[data-part=right]", { x: [0, -2.5, 2, 0] }, options),
        ])
      },
    },
    // the rules fade away, then are drawn back one after another, round the frame like a pen would;
    // each stays hidden until it has length (a square cap paints a dot at pathLength 0)
    draw: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all(
          RULES.flatMap(({ part }, i) => {
            const start = 0.15 + i * 0.17
            return [
              animate(
                `[data-part=${part}]`,
                { opacity: [1, 0, 0, 1, 1] },
                { duration: seconds, times: [0, 0.12, start, start + 0.02, 1], ease: "easeOut" },
              ),
              animate(
                `[data-part=${part}]`,
                { pathLength: [1, 1, 0, 0, 1, 1] },
                { duration: seconds, times: [0, 0.12, 0.13, start, start + 0.3, 1], ease: ["linear", "linear", "linear", ease.out, "linear"] },
              ),
            ]
          }),
        ),
    },
  },
  render: () => (
    <>
      {RULES.map(({ part, d }) => (
        <path key={part} data-part={part} d={d} style={pivot("50% 50%")} />
      ))}
    </>
  ),
})
