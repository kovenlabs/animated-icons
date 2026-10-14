"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    tickets: "tear" | "shuffle" | "flip"
  }
}

/** 2 colors: tickets (primary), perforation (accent). */
export const Tickets = createAnimatedIcon({
  name: "tickets",
  family: "ticket",
  category: "commerce",
  keywords: ["admission", "event", "passes", "coupons", "raffle", "concert", "movie", "booking"],
  slots: { primary: "tickets", accent: "perforation" },
  defaultVariant: "tear",
  variants: {
    // the front stub is torn off: it peels up from its top corner, flaps, and is pressed back
    tear: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stub]",
            { rotate: [0, -14, -9, -12, 0], x: [0, 0.5, 0.5, 0.5, 0] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.65, 1], ease: ["easeOut", "easeInOut", "easeInOut", ease.overshoot] },
          ),
          animate(
            "[data-part=front]",
            { rotate: [0, 2, 0, -1, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // shuffled: the front ticket sinks back as the one behind swells forward, then they trade back
    shuffle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=front]",
            { scale: [1, 0.88, 0.88, 1], opacity: [1, 0.45, 0.45, 1], rotate: [0, -3, -3, 0] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeInOut", "easeInOut", ease.overshoot] },
          ),
          animate(
            "[data-part=back]",
            { scale: [1, 1.07, 1.07, 1], rotate: [0, 3, 3, 0] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the front ticket is flipped over to its back and round again, the one behind tipping the other way
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=face]", { scaleX: [1, -1, 1], scaleY: [1, 0.92, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=back]", { skewX: [0, -8, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      {/* the ticket behind, showing only its top and right edges above and beside the front one */}
      <path data-part="back" d="M7 5V3h15v11" style={pivot("100% 0%")} />
      {/* shuffles from its bottom-left corner, flips about its own centre */}
      <g data-part="front" style={pivot("0% 100%")}>
        <g data-part="face" style={pivot("50% 50%")}>
          {/* the admission part, notched on its outer side, open where the stub carries on */}
          <path d="M11 9H2v4l2 2-2 2v4h9" />
          {/* the stub, notched the same way, hinged at its top-left corner */}
          <path data-part="stub" d="M11 9h6v4l-2 2 2 2v4h-6" style={pivot("0% 0%")} />
          {/* the perforation between them, 4px clear of both edges */}
          <path d="M11 13v4" stroke={slot.accent} />
        </g>
      </g>
    </>
  ),
})
