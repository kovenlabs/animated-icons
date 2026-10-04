"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    trash: "lift" | "shake" | "stomp"
  }
}

/** 3 colors: can (primary), lid and handle (secondary), inner lines (accent). */
export const Trash = createAnimatedIcon({
  name: "trash",
  category: "actions",
  keywords: ["delete", "remove", "bin", "garbage", "discard", "rubbish", "waste"],
  slots: { primary: "can", secondary: "lid + handle", accent: "inner lines" },
  defaultVariant: "lift",
  variants: {
    // the lid tips open on its right hinge, then shuts
    lift: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=lid]",
          { y: [0, -1, -1, 0], rotate: [0, -12, -12, 0] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
    // a quick wobble on its base
    shake: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=trash]",
          { rotate: [0, -5, 5, -4, 3, 0], x: [0, -0.5, 0.5, -0.5, 0.5, 0] },
          { duration: seconds, ease: "linear" },
        ),
    },
    // the lid hops and slams down, squashing the contents. Lid and can share one timing so the
    // can's rim never rises past the lid
    stomp: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lid]",
            { y: [0, -3, 1.05, 0] },
            { duration: seconds, times: [0, 0.4, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=can]",
            { scaleY: [1, 1, 0.93, 1] },
            { duration: seconds, times: [0, 0.4, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=lines]",
            { scaleY: [1, 1, 0.75, 1] },
            { duration: seconds, times: [0, 0.4, 0.6, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="trash" style={pivot("50% 100%")}>
      <g data-part="lid" stroke={slot.secondary} style={pivot("100% 100%")}>
        <path d="M3 6h18" />
        <path d="M9 6V3h6v3" />
      </g>
      <g data-part="can" style={pivot("50% 100%")}>
        {/* a trapezoid, open at the top under the lid */}
        <path d="M5 6l1.5 15h11L19 6" />
        <g data-part="lines" stroke={slot.accent} style={pivot("50% 100%")}>
          <path d="M10 10.5v6" />
          <path d="M14 10.5v6" />
        </g>
      </g>
    </g>
  ),
})
