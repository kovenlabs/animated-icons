"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    diamond: "turn" | "rock" | "pop"
  }
}

/** 2 colors: plate (primary), raised core (accent). */
export const Diamond = createAnimatedIcon({
  name: "diamond",
  category: "design",
  keywords: ["rhombus", "lozenge", "shape", "geometry", "square rotated", "suit", "card suit", "kite"],
  slots: { primary: "plate", accent: "raised core" },
  defaultVariant: "turn",
  variants: {
    // lifted toward you, it turns a full circle about its vertical axis, lands with a squash and the
    // core pops
    turn: {
      duration: 1250,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=diamond]",
            { y: [0, -2.5, -2.5, 0, 0], scaleX: [1, 1.12, 1.12, 1.12, 1], scaleY: [1, 1.12, 1.12, 0.86, 1] },
            { duration: seconds, times: [0, 0.18, 0.7, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=turn]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.1, 0.25, 0.4, 0.55, 0.72, 1],
              ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"],
            },
          ),
          animate(
            "[data-part=core]",
            { scale: [1, 1, 1.45, 1] },
            { duration: seconds, times: [0, 0.78, 0.9, 1], ease: "easeOut" },
          ),
        ]),
    },
    // rocks left and right on its vertical axis: the plate narrows while the raised core slides
    // across it, nearer to you, so it reads as depth
    rock: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=turn]", { scaleX: [1, 0.66, 1, 0.66, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=core]", { x: [0, -2.6, 0, 2.6, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // swells and snaps a quarter turn with a spring; a quarter turn is the same pose, so it snaps back
    // to rest unseen
    pop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=diamond]",
            { rotate: [0, 0, 90, 0] },
            { duration: seconds, times: [0, 0.2, 0.999, 1], ease: ["linear", ease.overshoot, snap] },
          ),
          animate(
            "[data-part=diamond]",
            { scale: [1, 0.85, 1.3, 1] },
            { duration: seconds, times: [0, 0.2, 0.5, 1], ease: ["easeIn", "easeOut", "easeInOut"] },
          ),
          animate("[data-part=core]", { scale: [1, 0.4, 1.3, 1] }, { duration: seconds, times: [0, 0.25, 0.6, 1], ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="diamond" style={pivot("50% 50%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        {/* a square stood on its corner */}
        <path d="M12 2l10 10-10 10L2 12z" />
        {/* a solid core, 3 clear of the plate's edges */}
        <path data-part="core" d="M12 8l4 4-4 4-4-4z" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
