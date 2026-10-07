"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    container: "hoist" | "ship" | "rock"
  }
}

/** 2 colors: container (primary), corrugation and door seam (accent). */
export const Container = createAnimatedIcon({
  name: "container",
  category: "development",
  keywords: ["docker", "shipping container", "cargo", "deploy", "kubernetes", "image", "freight", "logistics"],
  slots: { primary: "container", accent: "corrugation + door seam" },
  defaultVariant: "hoist",
  variants: {
    // hoisted off the quay by a crane: it lifts with a stretch, turns a full circle in the air, and
    // lands with a squash
    hoist: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=crate]",
            { y: [0, -3, -3, 0, 0] },
            { duration: seconds, times: [0, 0.22, 0.64, 0.76, 1], ease: [ease.out, "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=crate]",
            { scaleY: [1, 1.06, 1, 1, 0.86, 1.04, 1], scaleX: [1, 0.97, 1, 1, 1.07, 0.99, 1] },
            { duration: seconds, times: [0, 0.1, 0.22, 0.76, 0.83, 0.92, 1], ease: "easeInOut" },
          ),
          // the turn: its long side swings round to the left and back, swelling as it stands end-on
          animate(
            "[data-part=box]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1], scaleY: [1, 1, 1.08, 1, 1.08, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.2, 0.31, 0.42, 0.53, 0.64, 1],
              ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"],
            },
          ),
        ]),
    },
    // shipped: it slides off along its own length out of the frame, and the next one docks in from the
    // other side, overshooting a little before it settles
    ship: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=crate]",
          { x: [0, 24, -24, 0], y: [0, -12, 12, 0] },
          { duration: seconds, times: [0, 0.4, 0.41, 1], ease: [ease.in, snap, ease.overshoot] },
        ),
    },
    // bumped: it tips up on its bottom corner and rocks back down
    rock: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=crate]",
          { rotate: [0, -9, 6, -3, 1, 0] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 0.85, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="crate" style={pivot("50% 100%")}>
      <g data-part="box" style={pivot("50% 50%")}>
        {/* a long box seen from above its front corner, its edges at a 2:1 rake: the outline, then */}
        {/* the top's two near edges and the front corner */}
        <path d="M2 9l12-6 8 4v8l-12 6-8-4z" />
        <path d="M2 9l8 4 12-6M10 13v8" />
        {/* ribs down the long side, 4 apart, and the seam between the doors on the end */}
        <path d="M14 11v8M18 9v8M6 11v8" stroke={slot.accent} />
      </g>
    </g>
  ),
})
