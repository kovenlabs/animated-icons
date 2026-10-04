"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "credit-card": "swipe" | "flip" | "tap"
  }
}

/** 2 colors: card (primary), stripe and chip (accent). */
export const CreditCard = createAnimatedIcon({
  name: "credit-card",
  category: "commerce",
  keywords: ["payment", "card", "pay", "checkout", "debit", "billing", "purchase"],
  slots: { primary: "card", accent: "stripe + chip" },
  defaultVariant: "swipe",
  variants: {
    // swiped through a reader: slides out to the right, back in from the left
    swipe: {
      clip: true,
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=card]",
          { x: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // turns over once about its vertical centre: the chip shows on the far side halfway through
    flip: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=card]", { scaleX: [1, -1, 1] }, { duration: seconds, ease: "easeInOut" }),
    },
    // pressed to a terminal: dips, then springs back
    tap: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=card]",
          { y: [0, 2, -0.5, 0], scale: [1, 0.95, 1.02, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="card" style={pivot("50% 50%")}>
      {/* the stripe runs edge to edge, under the card's sides */}
      <path d="M3 10h18" stroke={slot.accent} />
      <rect x="3" y="6" width="18" height="12" />
      <rect x="6" y="13" width="4" height="2" fill={slot.accent} stroke="none" />
    </g>
  ),
})
