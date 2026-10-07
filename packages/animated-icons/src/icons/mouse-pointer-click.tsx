"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "mouse-pointer-click": "click" | "double" | "arrive"
  }
}

/** 2 colors: pointer (primary), click rays (accent). */
export const MousePointerClick = createAnimatedIcon({
  name: "mouse-pointer-click",
  family: "mouse",
  category: "actions",
  keywords: ["click", "cursor", "pointer", "tap", "select", "press", "call to action"],
  slots: { primary: "pointer", accent: "click rays" },
  defaultVariant: "click",
  variants: {
    // the pointer presses into the screen at its tip and pops back out as the rays burst from the point
    click: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pointer]",
            { scale: [1, 0.75, 1.12, 1] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeIn", ease.overshoot, "easeOut"] },
          ),
          animate(
            "[data-part=ray]",
            { scale: [1, 0, 0, 1.4, 1], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.25, 0.4, 0.65, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a quick double press: two dips of the pointer, the rays flashing out on each
    double: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pointer]",
            { scale: [1, 0.8, 1, 0.8, 1.08, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.45, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ray]",
            { scale: [1, 0.3, 1.3, 0.3, 1.4, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.45, 0.7, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the pointer drifts back into the distance, glides home to its target and clicks there
    arrive: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pointer]",
            { x: [0, 4, 0, 0, 0], y: [0, 4, 0, 0, 0], scale: [1, 0.65, 1, 0.82, 1] },
            { duration: seconds, times: [0, 0.3, 0.62, 0.75, 1], ease: ["easeOut", "easeInOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=ray]",
            { scale: [1, 0, 0, 1.4, 1], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.75, 0.88, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* four rays around the point, each scaling from its inner end */}
      <g stroke={slot.accent}>
        <path data-part="ray" d="M9 2v3" style={pivot("50% 100%")} />
        <path data-part="ray" d="M2 9h3" style={pivot("100% 50%")} />
        <path data-part="ray" d="M13 5l2-2" style={pivot("0% 100%")} />
        <path data-part="ray" d="M5 13l-2 2" style={pivot("100% 0%")} />
      </g>
      {/* an arrowhead pointing up-left, symmetric about its diagonal, notched at the back; it presses from its tip */}
      <path data-part="pointer" d="M9 9l12 4.5-5 2.5-2.5 5z" style={pivot("0% 0%")} />
    </>
  ),
})
