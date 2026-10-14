"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "smile-plus": "add" | "bounce" | "turn"
  }
}

/** 2 colors: face, eyes and mouth (primary), plus (accent). */
export const SmilePlus = createAnimatedIcon({
  name: "smile-plus",
  family: "smile",
  category: "social",
  keywords: ["add reaction", "emoji", "react", "reaction", "feedback", "face", "happy"],
  slots: { primary: "face + eyes + mouth", accent: "plus" },
  defaultVariant: "add",
  variants: {
    // the plus spins away and back in with a pop, and the face grins as it lands
    add: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.2, 0.5, 0.7, 1] }
        return Promise.all([
          animate(
            "[data-part=plus]",
            { scale: [1, 0, 1.2, 0.92, 1], rotate: [0, -180, 0, 0, 0], x: [0, 0, -0.7, 0, 0], y: [0, 0, 0.7, 0, 0] },
            { ...timing, ease: ["easeIn", ease.out, "easeInOut", "easeOut"] },
          ),
          animate("[data-part=mouth]", { scale: [1, 1, 1.25, 1.25, 1] }, { ...timing, ease: "easeInOut" }),
          animate("[data-part=eye]", { scaleY: [1, 1, 0.45, 0.45, 1] }, { ...timing, ease: "easeInOut" }),
        ])
      },
    },
    // the face crouches, hops and lands with a squash, and the plus spins a full turn on landing
    bounce: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=face]",
            { y: [0, 0, -2, 0, 0], scaleY: [1, 0.86, 1.05, 0.9, 1], scaleX: [1, 1.03, 0.97, 1.03, 1] },
            { duration: seconds * 0.8, times: [0, 0.2, 0.45, 0.7, 1], ease: ["easeOut", "easeOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=plus]",
            { rotate: [0, 0, 360], scale: [1, 1, 1.12, 1] },
            { duration: seconds, times: [0, 0.5, 0.85, 1], ease: ["linear", "easeInOut", "easeOut"] },
          ),
        ]),
    },
    // the head turns to look left, then right: the features slide across the face and foreshorten
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=features]",
            { x: [0, -1.5, -1.5, 1.5, 1.5, 0], scaleX: [1, 0.85, 0.85, 0.85, 0.85, 1] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=plus]",
            { scale: [1, 1, 1.12, 1, 1.12, 1] },
            { duration: seconds, times: [0, 0.3, 0.4, 0.55, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="face" style={pivot("50% 100%")}>
        {/* a face is round: a true circle, opened at the top-right where the plus sits */}
        <path d="M19.86 14.56A9 9 0 1 1 9.44 4.14" />
        <g data-part="features" style={pivot("50% 50%")}>
          <g fill={slot.primary} stroke="none">
            <rect data-part="eye" x="7" y="8.5" width="2" height="3" style={pivot("50% 50%")} />
            <rect data-part="eye" x="13" y="8.5" width="2" height="3" style={pivot("50% 50%")} />
          </g>
          <path data-part="mouth" d="M7 15l2 2.5h4l2-2.5" style={pivot("50% 0%")} />
        </g>
      </g>
      <path data-part="plus" d="M19 2v6M16 5h6" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
