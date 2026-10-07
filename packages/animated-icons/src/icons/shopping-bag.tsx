"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "shopping-bag": "swing" | "drop" | "fill"
  }
}

/** 2 colors: bag (primary), handle (accent). */
export const ShoppingBag = createAnimatedIcon({
  name: "shopping-bag",
  category: "commerce",
  keywords: ["shopping", "purchase", "buy", "retail", "checkout", "order", "boutique", "tote"],
  slots: { primary: "bag", accent: "handle" },
  defaultVariant: "swing",
  variants: {
    // carried: it swings from the top of its handle and settles
    swing: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate("[data-part=carry]", { rotate: [0, 9, -7, 4, -1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // set down from a small height: it lands with a squash
    drop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bag]",
          { y: [0, -3, 0, 0], scaleY: [1, 1.03, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
    // filled up: the bag bulges out as something goes in, then settles
    fill: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bag]",
          { scaleX: [1, 1.1, 0.97, 1], scaleY: [1, 0.95, 1.02, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // hangs from the top of the handle; squashes and bulges from the floor
    <g data-part="carry" style={pivot("50% 0%")}>
      <g data-part="bag" style={pivot("50% 100%")}>
        {/* a square handle standing on the bag's top edge */}
        <path d="M9 8V3h6v5" stroke={slot.accent} />
        {/* a slightly flared paper bag */}
        <path d="M4 8h16l1 14H3z" />
      </g>
    </g>
  ),
})
