"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    dollar: "flip" | "pulse"
  }
}

/** 1 color: dollar sign (primary). */
export const Dollar = createAnimatedIcon({
  name: "dollar",
  category: "finance",
  keywords: ["money", "currency", "usd", "price", "cost", "payment", "cash", "dollar sign"],
  slots: { primary: "sign" },
  defaultVariant: "flip",
  variants: {
    // tossed like a coin: it hops and turns over once in the air, then lands
    flip: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sign]",
          { scaleX: [1, -1, 1], y: [0, -2.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // two beats, like money ringing up
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sign]",
          { scale: [1, 1.15, 1, 1.1, 1] },
          { duration: seconds, times: [0, 0.2, 0.45, 0.65, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <g data-part="sign" style={pivot("50% 50%")}>
      {/* a faceted S: square shoulders, bevelled bends, point-symmetric about the centre */}
      <path d="M17 5H9.5L6 7.5v2L9.5 12h5l3.5 2.5v2L14.5 19H7" />
      <path d="M12 2v20" />
    </g>
  ),
})
