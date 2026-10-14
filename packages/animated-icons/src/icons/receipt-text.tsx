"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "receipt-text": "print" | "flutter" | "flip"
  }
}

/** 2 colors: paper (primary), printed lines (accent). */
export const ReceiptText = createAnimatedIcon({
  name: "receipt-text",
  family: "receipt",
  category: "commerce",
  keywords: ["invoice", "bill", "statement", "purchase", "itemized", "expense", "transaction", "receipt details"],
  slots: { primary: "paper", accent: "printed lines" },
  defaultVariant: "print",
  variants: {
    // printed again: the lines fade, the slip is jerked short and wide as the till grips it, and the
    // lines are typed back one after another, left to right
    print: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slip]",
            { scaleY: [1, 1, 0.88, 1, 1], scaleX: [1, 1, 1.05, 0.98, 1] },
            { duration: seconds, times: [0, 0.15, 0.25, 0.42, 1], ease: ["linear", "easeOut", "easeInOut", "easeOut"] },
          ),
          // hidden while a line is too short to read: a square cap paints a dot at length 0
          animate(
            "[data-part=line]",
            { opacity: [1, 0, 0, 1, 1] },
            {
              duration: seconds * 0.75,
              delay: stagger(seconds * 0.1),
              times: [0, 0.15, 0.3, 0.32, 1],
              ease: ["easeOut", "linear", snap, "linear"],
            },
          ),
          animate(
            "[data-part=line]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.75, delay: stagger(seconds * 0.1), times: [0, 0.15, 0.3, 1], ease: ["linear", snap, ease.out] },
          ),
        ]),
    },
    // caught in a draught: the slip sways and curls from the top as if pinned there, its bottom
    // lagging behind, and the print rides a beat behind the paper
    flutter: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slip]",
            { skewX: [0, 5, -4.5, 3, -1.5, 0], scaleX: [1, 0.9, 0.94, 0.95, 0.99, 1], scaleY: [1, 0.97, 1, 0.98, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=lines]",
            { x: [0, -0.8, 1, -0.8, 0.4, 0] },
            { duration: seconds, times: [0, 0.26, 0.48, 0.68, 0.86, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // turned over on its vertical axis: the back is blank, and as the front comes round the lines
    // spring out from the left margin, one after another
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slip]",
            { scaleX: [1, 0, -1, 0, 1, 1], scaleY: [1, 0.95, 1, 0.95, 1, 1] },
            { duration: seconds, times: [0, 0.14, 0.28, 0.42, 0.56, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "linear"] },
          ),
          animate(
            "[data-part=lines]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.13, 0.14, 0.41, 0.42, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
          // each line collapses while the back is showing, then springs out once the front is round
          animate(
            "[data-part=line]",
            { scaleX: [1, 1, 0, 0, 1.15, 1, 1] },
            {
              duration: seconds * 0.86,
              delay: stagger(seconds * 0.07),
              times: [0, 0.2, 0.21, 0.5, 0.7, 0.9, 1],
              ease: ["linear", snap, "linear", ease.out, "easeInOut", "linear"],
            },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="slip" style={pivot("50% 0%")}>
      {/* a slip torn on both ends: sawteeth along the top and the bottom */}
      <path d="M4 4l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v16l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2z" />
      <g data-part="lines" stroke={slot.accent}>
        <path data-part="line" d="M8 8h8" style={pivot("0% 50%")} />
        <path data-part="line" d="M8 12h8" style={pivot("0% 50%")} />
        <path data-part="line" d="M8 16h5" style={pivot("0% 50%")} />
      </g>
    </g>
  ),
})
