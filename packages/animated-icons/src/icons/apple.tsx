"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    apple: "toss" | "flutter" | "roll"
  }
}

/** A faceted apple: two shoulders dipping to the stem, full cheeks, and a notch in its base. */
const BODY = "M12 8 9 6.5H6L3.5 9 3 14l2 5 3 3h2l2-1 2 1h2l3-3 2-5-.5-5L18 6.5h-3Z"

/** 2 colors: apple and stem (primary), leaf (accent). */
export const Apple = createAnimatedIcon({
  name: "apple",
  category: "nature",
  keywords: ["fruit", "food", "healthy", "snack", "diet", "nutrition", "orchard", "teacher"],
  slots: { primary: "apple + stem", accent: "leaf" },
  defaultVariant: "toss",
  variants: {
    // tossed up with a squash and a stretch; in the air it turns right round (the leaf swings to the far
    // side and back, the shine slides round the cheek), then it lands with a squash and a wobble
    toss: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=apple]",
            {
              y: [0, 0, -4, 0, 0, 0],
              scaleY: [1, 0.88, 1.08, 0.84, 1.04, 1],
              scaleX: [1, 1.08, 0.95, 1.12, 0.98, 1],
            },
            {
              duration: seconds,
              times: [0, 0.12, 0.42, 0.68, 0.82, 1],
              ease: ["easeInOut", "easeOut", ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=sprig]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.14, 0.26, 0.38, 0.5, 0.62, 1], ease: "linear" },
          ),
          animate(
            "[data-part=shine]",
            { x: [0, 0, 9, -3, 0, 0], opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.14, 0.38, 0.39, 0.62, 1], ease: ["linear", "easeIn", snap, "easeOut", "linear"] },
          ),
        ]),
    },
    // the leaf flutters on its stalk as if caught by a breeze, the stalk bending with it
    flutter: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=leaf]",
            { rotate: [0, -24, 14, -14, 6, 0], scaleX: [1, 0.7, 1.05, 0.8, 1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=sprig]",
            { rotate: [0, 8, -6, 4, 0] },
            { duration: seconds, delay: seconds * 0.05, ease: "easeInOut" },
          ),
        ]),
    },
    // rolls off to the right, out of the frame, and rolls back in from the left (a 20px roll is about
    // 127° round a 9px apple)
    roll: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=apple]",
          { x: [0, 20, -20, 0], rotate: [0, 127, -127, 0] },
          { duration: seconds, times: [0, 0.45, 0.46, 1], ease: [ease.in, snap, ease.out] },
        ),
    },
  },
  render: () => (
    <g data-part="apple" style={pivot("50% 50%")}>
      <path d={BODY} />
      <path data-part="shine" d="M7 10.5V13" style={pivot("50% 50%")} />
      {/* stalk and leaf turn together about the stalk's foot */}
      <g data-part="sprig" style={pivot("0% 100%")}>
        <path d="M12 8l1-4" />
        <path data-part="leaf" d="M13 4l2.5-2H20l-2.5 2Z" fill={slot.accent} stroke="none" style={pivot("0% 100%")} />
      </g>
    </g>
  ),
})
