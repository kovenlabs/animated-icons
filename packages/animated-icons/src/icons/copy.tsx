"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    copy: "duplicate" | "spread" | "stamp"
  }
}

/** 2 colors: back sheet (primary), front sheet (accent). */
export const Copy = createAnimatedIcon({
  name: "copy",
  category: "actions",
  keywords: ["duplicate", "clone", "clipboard", "paste", "replicate", "pages"],
  slots: { primary: "back sheet", accent: "front sheet" },
  defaultVariant: "duplicate",
  variants: {
    // the front sheet slides back onto the original, then peels off again as the copy
    duplicate: {
      // the front sheet slides onto the back one: a long move, inside the frame
      clip: false,
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=front]",
          { x: [0, -6, -6, 0], y: [0, -6, -6, 0] },
          { duration: seconds, times: [0, 0.4, 0.5, 1], ease: "easeInOut" },
        ),
    },
    // the two sheets fan apart a step, then settle back together
    spread: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=front]", { x: [0, 1.5, 0], y: [0, 1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=back]", { x: [0, -1.5, 0], y: [0, -1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // pressed down like a stamp, landing with a little overshoot
    stamp: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=front]",
          { scale: [1, 0.88, 1.05, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ease.overshoot },
        ),
    },
  },
  render: () => (
    <>
      {/* only the edges that peek out from behind the front sheet */}
      <path data-part="back" d="M15 5V3H3v12h2" />
      <rect data-part="front" x="9" y="9" width="12" height="12" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
