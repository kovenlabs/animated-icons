"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    club: "tumble" | "spin" | "stamp"
  }
}

/** 2 colors: suit (primary), stem (accent). */
export const Club = createAnimatedIcon({
  name: "club",
  category: "gaming",
  keywords: ["cards", "suit", "poker", "playing card", "casino", "clover", "deck", "gamble"],
  slots: { primary: "suit", accent: "stem" },
  defaultVariant: "tumble",
  variants: {
    // flipped end over end like a card tossed in the air: it turns upside down and back, then lands
    tumble: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=club]", { scaleY: [1, -1, 1] }, { duration: seconds * 0.7, ease: "easeInOut" }),
          animate(
            "[data-part=club]",
            { scaleX: [1, 1.08, 1, 1.12, 1], y: [0, -1, 0, 0.5, 0] },
            { duration: seconds, times: [0, 0.35, 0.7, 0.82, 1], ease: ["easeOut", "easeIn", "easeOut", ease.overshoot] },
          ),
        ]),
    },
    // a full turn on its centre, winding back first, overshooting and settling
    spin: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=club]",
          { rotate: [0, -25, 375, 360], scale: [1, 0.92, 0.9, 1] },
          { duration: seconds, times: [0, 0.2, 0.8, 1], ease: ["easeOut", "easeInOut", ease.overshoot] },
        ),
    },
    // stamped down onto the table: lifts toward you, slams flat, bounces the stem
    stamp: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=club]",
            { scale: [1, 1.12, 0.84, 1.04, 1] },
            { duration: seconds, times: [0, 0.35, 0.5, 0.75, 1], ease: ["easeOut", ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=stem]",
            { scaleY: [1, 1, 0.6, 1.15, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="club" style={pivot("50% 50%")}>
      {/* three round leaves, true arcs, closed by a flat bridge between the lower two */}
      <path d="M8.33 8.59A4 4 0 1 1 15.67 8.59 4 4 0 1 1 13.67 15.33H10.33A4 4 0 1 1 8.33 8.59Z" />
      {/* the stem, a solid flared triangle hanging from the bridge; its rounded tip starts inside the
          bridge's stroke so it stays joined when the club turns */}
      <path data-part="stem" d="M12 14.5l3.5 6.5h-7Z" fill={slot.accent} stroke="none" style={pivot("50% 0%")} />
    </g>
  ),
})
