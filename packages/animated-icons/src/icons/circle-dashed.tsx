"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-dashed": "spin" | "chase" | "pulse"
  }
}

/**
 * Eight dashes on the circle family's ring (r 10), one every 45° from 12 o'clock. Each spans 22°, about
 * 3.8px of arc, which leaves a 2px clear gap between neighbours once their caps are drawn.
 */
const DASHES = Array.from({ length: 8 }, (_, i) => {
  const point = (deg: number) => {
    const rad = (deg * Math.PI) / 180
    return `${(12 + 10 * Math.sin(rad)).toFixed(3)} ${(12 - 10 * Math.cos(rad)).toFixed(3)}`
  }
  // a dash is a piece of a round ring, so it gets a true arc, drawn clockwise
  return `M${point(i * 45 - 11)}A10 10 0 0 1 ${point(i * 45 + 11)}`
})

/** 1 color: dashed ring. */
export const CircleDashed = createAnimatedIcon({
  name: "circle-dashed",
  family: "circle",
  category: "status",
  keywords: ["pending", "not started", "todo", "draft", "incomplete", "waiting", "dashed circle"],
  slots: { primary: "dashed ring" },
  defaultVariant: "spin",
  variants: {
    // the dashed ring makes one calm turn clockwise, like something waiting to start
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=ring]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the dashes dim and come back one after another clockwise, chasing round the ring
    chase: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=dash]",
          { opacity: [1, 0.15, 1] },
          { duration: seconds * 0.4, delay: stagger(seconds * 0.6 / 7), ease: "easeInOut" },
        ),
    },
    // beats inward twice, the second time softer (it fills the frame, so it can only shrink)
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ring]",
          { scale: [1, 0.88, 1, 0.94, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // the box runs edge to edge of the ring, so its centre is the ring's centre
    <g data-part="ring" style={pivot("50% 50%")}>
      {DASHES.map((d) => (
        <path key={d} data-part="dash" d={d} />
      ))}
    </g>
  ),
})
