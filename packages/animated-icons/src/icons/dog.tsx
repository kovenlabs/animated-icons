"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    dog: "tilt" | "shake" | "bark"
  }
}

/**
 * A flat-topped head with floppy ears hanging off its top corners. Each ear is open on its inner side,
 * closed by the head's flank, and hinges on the corner: it only ever swings outwards or folds up (a
 * scaleY from the hinge keeps its lower tip sliding along the flank), so it never cuts into the head.
 */
const HEAD = "M7 5h10l2 4v7l-4 5H9l-4-5V9z"

/** 2 colors: head and ears (primary), eyes and nose (accent). */
export const Dog = createAnimatedIcon({
  name: "dog",
  category: "nature",
  keywords: ["puppy", "pet", "animal", "canine", "doggo", "woof", "pup"],
  slots: { primary: "head + ears", accent: "eyes + nose" },
  defaultVariant: "tilt",
  variants: {
    // the curious head tilt: it cocks its head one way, then the other, and the ears flap out late and
    // overshoot each time before they settle
    tilt: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dog]",
            { rotate: [0, 14, 14, -14, -14, 0] },
            { duration: seconds, times: [0, 0.16, 0.4, 0.58, 0.82, 1], ease: "easeInOut" },
          ),
          // the ear on the high side flies out as the head swings, then flops back
          animate(
            "[data-part=ear-left]",
            { rotate: [0, 0, 12, 0, 0, 0], scaleY: [1, 1, 0.82, 1.04, 1, 1] },
            { duration: seconds, times: [0, 0.06, 0.2, 0.32, 0.4, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ear-right]",
            { rotate: [0, 0, -12, 0, 0, 0], scaleY: [1, 1, 0.82, 1.04, 1, 1] },
            { duration: seconds, times: [0, 0.48, 0.62, 0.74, 0.82, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // it shakes its head hard, turning left and right: the face swings across the skull and the ears
    // flap up on alternate sides
    shake: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const shake = { duration: seconds, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=face]", { x: [0, -2, 2, -2, 1, 0] }, shake),
          animate("[data-part=head]", { scaleX: [1, 0.92, 0.92, 0.92, 0.96, 1] }, shake),
          animate("[data-part=dog]", { rotate: [0, -5, 5, -5, 2, 0] }, shake),
          animate("[data-part=ear-left]", { scaleY: [1, 1.04, 0.7, 1.04, 0.85, 1], rotate: [0, 0, 10, 0, 5, 0] }, shake),
          animate("[data-part=ear-right]", { scaleY: [1, 0.7, 1.04, 0.7, 1, 1], rotate: [0, -10, 0, -10, 0, 0] }, shake),
        ])
      },
    },
    // two sharp barks: the head jolts up towards you each time and the ears fly up behind it
    bark: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const bark = { duration: seconds, times: [0, 0.1, 0.32, 0.45, 0.55, 0.77, 1] }
        return Promise.all([
          animate(
            "[data-part=dog]",
            { scale: [1, 1.12, 1, 1, 1.12, 0.97, 1], y: [0, -1, 0, 0, -1, 0, 0] },
            { ...bark, ease: [ease.out, "easeInOut", "linear", ease.out, "easeInOut", "easeInOut"] },
          ),
          animate("[data-part=ear-left]", { scaleY: [1, 0.65, 1.06, 1, 0.65, 1.06, 1] }, { ...bark, ease: "easeInOut" }),
          animate("[data-part=ear-right]", { scaleY: [1, 0.65, 1.06, 1, 0.65, 1.06, 1] }, { ...bark, ease: "easeInOut" }),
          animate(
            "[data-part=nose]",
            { y: [0, 1, 0, 0, 1, 0, 0] },
            { ...bark, ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="dog" style={pivot("50% 50%")}>
      <path data-part="head" d={HEAD} style={pivot("50% 50%")} />
      <path data-part="ear-left" d="M7 5 3 6 2 13l3 1" style={pivot("100% 0%")} />
      <path data-part="ear-right" d="M17 5l4 1 1 7-3 1" style={pivot("0% 0%")} />
      <g data-part="face" fill={slot.accent} stroke="none">
        <rect x="9" y="11" width="2" height="2" />
        <rect x="13" y="11" width="2" height="2" />
        <path data-part="nose" d="M9.5 15h5L12 18z" />
      </g>
    </g>
  ),
})
