"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "door-open": "swing" | "knock"
  }
}

/** 2 colors: frame + floor (primary), door leaf + knob (accent). */
export const DoorOpen = createAnimatedIcon({
  name: "door-open",
  category: "navigation",
  keywords: ["entrance", "exit", "enter", "room", "doorway", "welcome", "leave", "access"],
  slots: { primary: "frame + floor", accent: "door leaf + knob" },
  defaultVariant: "swing",
  variants: {
    // the leaf swings wide open on its hinge, holds, and eases back ajar; it only narrows, so it never
    // reaches the far jamb
    swing: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=leaf]",
          { scaleX: [1, 0.72, 0.72, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
    // two quick raps from the other side: the leaf jolts on its hinge twice, the second lighter, while
    // the doorway stays still
    knock: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=leaf]",
          { scaleX: [1, 0.86, 1, 0.9, 1, 1] },
          { duration: seconds, times: [0, 0.1, 0.3, 0.42, 0.65, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the doorway: two jambs and a lintel, standing on the floor that runs out either side */}
      <path d="M2 21h4V3h12v18h4" />
      {/* the open leaf, hinged on the left jamb and swung towards you, seen in perspective */}
      <g data-part="leaf" style={pivot("0% 50%")}>
        <path d="M6 3l8 2.5v13L6 21z" stroke={slot.accent} />
        <rect x="9" y="11" width="2" height="2" fill={slot.accent} stroke="none" />
      </g>
    </>
  ),
})
