"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    gift: "open" | "wiggle" | "shake"
  }
}

/** 3 colors: box and lid (primary), ribbon (secondary), bow (accent). */
export const GiftIcon = createAnimatedIcon({
  name: "gift",
  category: "commerce",
  keywords: ["present", "reward", "surprise", "birthday", "bonus", "giveaway", "package"],
  slots: { primary: "box + lid", secondary: "ribbon", accent: "bow" },
  defaultVariant: "open",
  variants: {
    // the lid hops off the box, holds, and lands; the box only ever dips away from it, so they never cross
    open: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lid]",
            { y: [0, -3, -3, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=base]",
            { y: [0, 0, 0.75, 0] },
            { duration: seconds, times: [0, 0.85, 0.92, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the bow stretches and springs back on its knot; its feet slide along under the lid's top edge
    wiggle: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bow]",
          { scaleX: [1, 1.15, 0.9, 1.05, 1], scaleY: [1, 0.85, 1.12, 0.96, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // shaken to guess what is inside
    shake: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=gift]",
          { x: [0, -1, 1, -1, 1, 0], rotate: [0, -5, 5, -5, 5, 0] },
          { duration: seconds, ease: "linear" },
        ),
    },
  },
  render: () => (
    <g data-part="gift" style={pivot("50% 100%")}>
      {/* the box starts under the lid's bottom stroke, so the lid can lift clear of its open top */}
      <g data-part="base" style={pivot("50% 100%")}>
        <path d="M12 13v8" stroke={slot.secondary} />
        <path d="M5 13v8h14v-8" />
      </g>
      <g data-part="lid">
        {/* two loops flaring out from the knot, their feet tucked under the lid's top edge: drawn first, so the lid hides them */}
        <path data-part="bow" d="M6 8V5l1.5-1.5L12 8l4.5-4.5L18 5v3" stroke={slot.accent} style={pivot("50% 100%")} />
        <path d="M12 8v4" stroke={slot.secondary} />
        <path d="M3 8h18v4H3z" />
      </g>
    </g>
  ),
})
