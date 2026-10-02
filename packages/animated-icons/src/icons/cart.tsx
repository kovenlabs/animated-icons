"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cart: "add" | "roll" | "wheelie"
  }
}

/** 3 colors: frame (primary), wheels (secondary), item (accent). */
export const CartIcon = createAnimatedIcon({
  name: "cart",
  category: "commerce",
  keywords: ["shopping", "basket", "checkout", "buy", "store", "add to cart"],
  slots: { primary: "frame", secondary: "wheels", accent: "item" },
  defaultVariant: "add",
  variants: {
    // the item fades out, drops back in from above, and the basket dips as it lands
    add: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=item]",
            { y: [0, 0, -2, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.25, 0.65, 1], ease: ["linear", "linear", "easeOut", "linear"] },
          ),
          animate(
            "[data-part=item]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.25, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=basket]",
            { y: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.65, 0.78, 1], ease: "easeOut" },
          ),
        ]),
    },
    // rolls out to the right, back in from the left, wheels turning all the way
    roll: {
      clip: true,
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cart]",
            { x: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          animate("[data-part=wheel]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // tips back onto the rear wheel, the item sliding toward the handle, then lands
    wheelie: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cart]",
            { rotate: [0, -10, 0, -2, 0] },
            { duration: seconds, times: [0, 0.4, 0.7, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=item]",
            { x: [0, -1.5, 0] },
            { duration: seconds * 0.75, delay: seconds * 0.05, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // pivots at the rear wheel's contact point
    <g data-part="cart" style={pivot("40% 100%")}>
      <g data-part="basket">
        {/* handle, then a trapezoid basket whose rear edge runs back up the handle's line */}
        <path d="M2 4h3l1 3h15l-3 9H9L6 7" />
        <rect data-part="item" x="12" y="10" width="3" height="3" fill={slot.accent} stroke="none" />
      </g>
      <g fill={slot.secondary} stroke="none">
        <rect data-part="wheel" x="8" y="19" width="3" height="3" style={pivot("50% 50%")} />
        <rect data-part="wheel" x="16" y="19" width="3" height="3" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
