"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    boxes: "stack" | "seal" | "rock"
  }
}

/** 2 colors: boxes (primary), packing tape (accent). */
export const Boxes = createAnimatedIcon({
  name: "boxes",
  category: "commerce",
  keywords: ["inventory", "stock", "storage", "warehouse", "equipment", "supplies", "packages", "parcels"],
  slots: { primary: "boxes", accent: "packing tape" },
  defaultVariant: "stack",
  variants: {
    // the top box is lifted off the stack and set back down with a squash
    stack: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=top]",
          { y: [0, -3, 0, 0], scaleY: [1, 1.03, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
    // the tape comes off each box and is pressed back on, one box after another; it hides while it is
    // too short to read
    seal: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tape]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.12), times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=tape]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.6, delay: stagger(seconds * 0.12), times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the whole pile tips onto its bottom-left edge and drops back upright, with a smaller second tip
    rock: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pile]",
          { rotate: [0, -6, 0, -2, 0] },
          { duration: seconds, times: [0, 0.35, 0.65, 0.82, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="pile" style={pivot("0% 100%")}>
      {/* a crate stack: two boxes side by side and a long one resting across both, set in 2px from their */}
      {/* outer walls. Every box is taped from the middle of its lid down its front; the lower boxes' tape */}
      {/* sits under the top box, 4px clear of its corners, and shows in full when it is lifted */}
      <path d="M2 13h10v9H2z" />
      <path d="M12 13h10v9H12z" />
      <path data-part="tape" d="M8 13v3" stroke={slot.accent} />
      <path data-part="tape" d="M16 13v3" stroke={slot.accent} />
      <g data-part="top" style={pivot("50% 100%")}>
        <path d="M4 5h16v8H4z" />
        <path data-part="tape" d="M12 5v3" stroke={slot.accent} />
      </g>
    </g>
  ),
})
