"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    pipette: "squeeze" | "dab"
  }
}

/** 2 colors: tube + collar (primary), bulb (accent). */
export const Pipette = createAnimatedIcon({
  name: "pipette",
  category: "design",
  keywords: ["eyedropper", "color picker", "dropper", "sample", "lab", "pick color", "chemistry"],
  slots: { primary: "tube + collar", accent: "bulb" },
  defaultVariant: "squeeze",
  variants: {
    // the bulb is squeezed towards the collar and springs back
    squeeze: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bulb]",
          { scale: [1, 0.78, 1.06, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // lifted along its own axis, then dabbed down onto the colour
    dab: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pipette]",
          { x: [0, 1.5, -0.75, 0], y: [0, -1.5, 0.75, 0] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="pipette">
      {/* the tube runs down the diagonal from the collar and tapers to a point at the tip */}
      <path d="M12 9l-8 8-1 4 4-1 8-8" />
      <path d="M10.5 7.5l6 6" />
      {/* the bulb sits on the collar, squared off at its far end; it squeezes towards its base */}
      <path data-part="bulb" d="M12 9l6-6h3v3l-6 6" stroke={slot.accent} style={pivot("17% 83%")} />
    </g>
  ),
})
