"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    ticket: "tear" | "swipe" | "wave"
  }
}

/** 2 colors: ticket (primary), perforation (accent). */
export const Ticket = createAnimatedIcon({
  name: "ticket",
  category: "commerce",
  keywords: ["admission", "event", "pass", "coupon", "voucher", "concert", "movie", "booking"],
  slots: { primary: "ticket", accent: "perforation" },
  defaultVariant: "tear",
  variants: {
    // the stub is torn along the perforation: it hinges away from its bottom corner and swings back
    tear: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=stub]",
          { rotate: [0, 9, 9, 0], x: [0, 0.5, 0.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
    // fed through a gate: slides out to the right, back in from the left
    swipe: {
      clip: true,
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ticket]",
          { x: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // waved in the air, tipping one way and the other before it settles
    wave: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ticket]",
          { rotate: [0, -10, 7, -3, 0], y: [0, -1.5, -1, 0, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="ticket" style={pivot("50% 50%")}>
      {/* the admission part, with a triangular notch in its side, open where the stub carries on */}
      <path d="M15 5H2v5l2 2-2 2v5h13" />
      {/* the stub, notched the same way, hinged at its bottom-left corner */}
      <path data-part="stub" d="M15 5h7v5l-2 2 2 2v5h-7" style={pivot("0% 100%")} />
      {/* two dashes of perforation between them, 2px clear of the edges and of each other */}
      <path d="M15 9v1M15 14v1" stroke={slot.accent} />
    </g>
  ),
})
