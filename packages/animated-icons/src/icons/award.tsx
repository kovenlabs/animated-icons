"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    award: "flutter" | "spin"
  }
}

/** A five-pointed star centred in the medal. */
const STAR = "M12 5.8 12.8 7.8 14.9 7.9 13.2 9.2 13.8 11.2 12 10.1 10.2 11.2 10.8 9.2 9.2 7.9 11.2 7.8Z"

/** 3 colors: medal (primary), ribbon (secondary), star (accent). */
export const Award = createAnimatedIcon({
  name: "award",
  category: "social",
  keywords: ["medal", "badge", "achievement", "prize", "certificate", "rosette", "honor"],
  slots: { primary: "medal", secondary: "ribbon", accent: "star" },
  defaultVariant: "flutter",
  variants: {
    // the ribbon tails sway under the medal, pinned where they meet it
    flutter: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ribbon]",
          { skewX: [0, 14, -10, 5, 0], scaleY: [1, 0.94, 1.03, 0.98, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the medal turns once on its vertical axis, like a coin
    spin: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=medal]", { scaleX: [1, -1, 1] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      {/* one ribbon with a notch, hanging from the medal's rim */}
      <path data-part="ribbon" d="M8.5 13 7 21l5-2.5 5 2.5-1.5-8" stroke={slot.secondary} style={pivot("50% 0%")} />
      <g data-part="medal" style={pivot("50% 50%")}>
        {/* a medal is round, so it gets a true circle */}
        <circle cx="12" cy="8.5" r="5.5" />
        <path d={STAR} fill={slot.accent} stroke="none" />
      </g>
    </>
  ),
})
