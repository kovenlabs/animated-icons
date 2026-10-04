"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    receipt: "print" | "tear"
  }
}

/** 2 colors: paper (primary), printed lines (accent). */
export const Receipt = createAnimatedIcon({
  name: "receipt",
  category: "commerce",
  keywords: ["invoice", "bill", "purchase", "order", "transaction", "payment", "checkout", "expense"],
  slots: { primary: "paper", accent: "printed lines" },
  defaultVariant: "print",
  variants: {
    // printed again: the slip fades, then feeds down out of the top edge as if from a till
    print: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=receipt]",
            { y: [0, 0, -18, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.21, 0.85, 1], ease: ["linear", "linear", ease.out, "linear"] },
          ),
          animate(
            "[data-part=receipt]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.2, 0.21, 1], ease: "linear" },
          ),
        ]),
    },
    // the serrated end is torn off along the tear line: it hinges down from its left corner, then
    // swings back up into place
    tear: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=stub]",
          { rotate: [0, 10, 10, 0], y: [0, 1.5, 1.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="receipt">
      {/* the slip, open at y 17 where the stub's sides carry on down */}
      <path d="M4 17V2h16v15" />
      <path data-part="stub" d="M4 17v3l2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2v-3" style={pivot("0% 0%")} />
      <path d="M8 6h8M8 10h8M8 14h5" stroke={slot.accent} />
    </g>
  ),
})
