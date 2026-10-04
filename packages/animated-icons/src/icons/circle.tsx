"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    circle: "draw" | "pulse" | "bounce"
  }
}

/** The ring of the circle family, drawn as two half arcs from the top so it draws on clockwise from 12 o'clock. */
const RING = "M12 2A10 10 0 0 1 12 22A10 10 0 0 1 12 2"

/** 1 color: ring. */
export const Circle = createAnimatedIcon({
  name: "circle",
  category: "design",
  keywords: ["round", "shape", "ring", "dot", "radio", "empty", "outline"],
  slots: { primary: "ring" },
  defaultVariant: "draw",
  variants: {
    // fades out, then draws itself on again clockwise from the top; hidden while too short to read
    draw: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ring]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=ring]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.14, 0.16, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // beats inward twice, the second time softer, like a heartbeat (it fills the frame, so it can only shrink)
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ring]",
          { scale: [1, 0.9, 1, 0.95, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // hops and lands with a little squash, like a ball; the ring fills the frame, so the hop is 1px and
    // the squash carries the landing
    bounce: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ring]",
          { y: [0, -1, 0, 0], scaleY: [1, 1, 0.9, 1], scaleX: [1, 1, 1.04, 1] },
          { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
        ),
    },
  },
  // a ring is round, so it gets true arcs
  render: () => <path data-part="ring" d={RING} style={pivot("50% 100%")} />,
})
