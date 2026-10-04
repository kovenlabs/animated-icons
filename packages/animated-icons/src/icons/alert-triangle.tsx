"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "alert-triangle": "shake" | "pop" | "flash"
  }
}

/** 2 colors: triangle (primary), exclamation mark (accent). */
export const AlertTriangle = createAnimatedIcon({
  name: "alert-triangle",
  category: "status",
  keywords: ["warning", "caution", "danger", "error", "attention", "hazard"],
  slots: { primary: "triangle", accent: "exclamation mark" },
  defaultVariant: "shake",
  variants: {
    // the sign rocks on its base
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=alert]",
          { rotate: [0, -8, 7, -5, 3, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=mark]", { scale: [1, 1.2, 0.96, 1] }, { duration: seconds, ease: ease.out }),
    },
    // the mark flickers twice, like a hazard light
    flash: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { opacity: [1, 0.2, 1, 0.2, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="alert" style={pivot("50% 100%")}>
      {/* mitered triangle on a crisp, pixel-aligned base */}
      <path d="M12 3l9.5 17h-19z" />
      <g data-part="mark" style={pivot("50% 50%")}>
        <path d="M12 10v3" stroke={slot.accent} />
        <rect x="11" y="16" width="2" height="2" fill={slot.accent} stroke="none" />
      </g>
    </g>
  ),
})
