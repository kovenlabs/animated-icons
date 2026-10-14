"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "toy-brick": "snap" | "build" | "flip"
  }
}

/** 2 colors: brick (primary), studs (accent). */
export const ToyBrick = createAnimatedIcon({
  name: "toy-brick",
  category: "gaming",
  keywords: ["lego", "brick", "block", "toy", "build", "construction", "kids", "play"],
  slots: { primary: "brick", accent: "studs" },
  defaultVariant: "snap",
  variants: {
    // lifted and tipped back, then slammed down with a squash on its base; the studs spring after the impact
    snap: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=brick]",
            {
              y: [0, -3, -3, 1.1, -0.2, 0],
              rotate: [0, -8, -8, 0, 0, 0],
              scaleY: [1, 1.04, 1.04, 0.84, 1.03, 1],
              scaleX: [1, 0.97, 0.97, 1.07, 0.99, 1],
            },
            {
              duration: seconds,
              times: [0, 0.3, 0.42, 0.55, 0.75, 1],
              ease: ["easeOut", "linear", ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=stud]",
            { scaleY: [1, 1, 1.45, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.08, { startDelay: seconds * 0.55 }), ease: "easeOut" },
          ),
        ]),
    },
    // the studs press in and pop up one after the other, the brick bobbing under each push
    build: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stud]",
            { scaleY: [1, 0.4, 1.5, 0.9, 1], scaleX: [1, 1.15, 0.85, 1.05, 1] },
            { duration: seconds * 0.6, delay: stagger(seconds * 0.35), ease: "easeInOut" },
          ),
          animate(
            "[data-part=brick]",
            { scaleY: [1, 0.94, 1.02, 0.94, 1.02, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // hops, flips end over end in the air and lands back on its base with a squash
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=brick]",
          {
            y: [0, 0.8, -3, 0, 0.9, 0],
            scaleY: [1, 0.86, -1, 1, 0.86, 1],
            scaleX: [1, 1.05, 0.94, 1, 1.05, 1],
          },
          {
            duration: seconds,
            times: [0, 0.15, 0.45, 0.72, 0.84, 1],
            ease: ["easeOut", "easeOut", ease.in, "easeOut", ease.overshoot],
          },
        ),
    },
  },
  render: () => (
    <g data-part="brick" style={pivot("50% 50%")}>
      {/* the block */}
      <path d="M3 10h18v10H3Z" />
      {/* two square studs standing on top */}
      <g stroke={slot.accent}>
        <path data-part="stud" d="M5 10V6h5v4" style={pivot("50% 100%")} />
        <path data-part="stud" d="M14 10V6h5v4" style={pivot("50% 100%")} />
      </g>
    </g>
  ),
})
