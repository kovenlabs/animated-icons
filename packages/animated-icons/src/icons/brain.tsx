"use client"

import { stagger, type Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    brain: "think" | "split" | "wobble"
  }
}

/**
 * Two faceted hemispheres, each closed along the centre seam so they can part; each carries two folds
 * running in from its outer edge and its crown.
 */
const HALVES = [
  {
    side: "left",
    d: "M12 5 10 3H6L4 5v3l-2 2v4l2 2v2l2 2h4l2-2Z",
    folds: ["M2 12h4l2 2v2", "M8 3v4"],
  },
  {
    side: "right",
    d: "M12 5l2-2h4l2 2v3l2 2v4l-2 2v2l-2 2h-4l-2-2Z",
    folds: ["M22 12h-4l-2 2v2", "M16 3v4"],
  },
] as const

/** 2 colors: hemispheres (primary), folds and spark (accent). The spark only exists in motion. */
export const Brain = createAnimatedIcon({
  name: "brain",
  category: "health",
  keywords: ["mind", "think", "idea", "intelligence", "neuroscience", "smart", "memory", "psychology"],
  slots: { primary: "hemispheres", accent: "folds + spark" },
  defaultVariant: "think",
  variants: {
    // the brain swells as each fold fires in turn, redrawing itself like a signal running through it
    think: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=brain]",
            { scale: [1, 1.08, 1, 1.05, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=fold]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.45, 1], delay: stagger(seconds * 0.1), ease: "easeOut" },
          ),
          animate(
            "[data-part=fold]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.6, times: [0, 0.18, 0.2, 1], delay: stagger(seconds * 0.1), ease: "easeOut" },
          ),
        ]),
    },
    // eureka: it shrinks back as the hemispheres pull apart, a spark jumps the gap, and they slam shut
    split: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.35, 0.6, 0.8, 1], ease: ["easeOut", "linear", ease.in, "easeOut"] as Easing[] }
        return Promise.all([
          animate("[data-part=brain]", { scale: [1, 0.8, 0.8, 1.06, 1] }, timing),
          animate("[data-part=half-left]", { x: [0, -3, -3, 0.4, 0] }, timing),
          animate("[data-part=half-right]", { x: [0, 3, 3, -0.4, 0] }, timing),
          animate("[data-part=spark]", { ...blink, scale: [0.4, 1.3, 0.6] }, {
            duration: seconds * 0.3,
            delay: seconds * 0.3,
            ease: "easeOut",
          }),
        ])
      },
    },
    // jelly: it squashes onto its base, springs tall, and jiggles back into shape
    wobble: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=brain]",
          { scaleX: [1, 1.08, 0.92, 1.04, 0.98, 1], scaleY: [1, 0.84, 1.1, 0.96, 1.02, 1] },
          { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.82, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <path data-part="spark" d="M12 9v6" stroke={slot.accent} style={flash()} />
      <g data-part="brain" style={pivot("50% 100%")}>
        {HALVES.map(({ side, d, folds }) => (
          <g key={side} data-part={`half-${side}`}>
            <path d={d} />
            <g stroke={slot.accent}>
              {folds.map((fold) => (
                <path key={fold} data-part="fold" d={fold} />
              ))}
            </g>
          </g>
        ))}
      </g>
    </>
  ),
})
