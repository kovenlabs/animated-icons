"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    shield: "shine" | "pulse" | "parry"
  }
}

/** 2 colors: shield (primary), centre line and shine (accent). */
export const Shield = createAnimatedIcon({
  name: "shield",
  family: "shield",
  category: "security",
  keywords: ["protection", "secure", "safe", "guard", "defense", "security", "privacy"],
  slots: { primary: "shield", accent: "centre line + shine" },
  defaultVariant: "shine",
  variants: {
    // the centre line dims, a glint sweeps across the face, and the line redraws from the top once the
    // glint has passed, so the two accents never cross
    shine: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=line]",
            { opacity: [1, 0, 0, 1], pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.15, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=glint]",
            { ...blink, x: [0, 5] },
            { duration: seconds * 0.55, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
    // shield and line pulse together, like a heartbeat
    pulse: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=guard]",
          { scale: [1, 1.08, 1, 1.04, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the shield raises and turns to parry a blow, then settles upright
    parry: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=guard]",
          { rotate: [0, -10, -10, 3, 0], y: [0, -1.5, -1.5, 0, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="guard" style={pivot("50% 100%")}>
      {/* the shield family's faceted outline: flat shoulders, straight sides, three facets down to the point */}
      <path d="M12 2l8 3v7l-3 5-5 4-5-4-3-5V5z" />
      <g stroke={slot.accent}>
        {/* splits the face in two, stopping 2px short of the shoulders and the point */}
        <path data-part="line" d="M12 6v9.5" style={pivot("50% 0%")} />
        <path data-part="glint" d="M8 13l3-4.5" style={flash()} />
      </g>
    </g>
  ),
})
