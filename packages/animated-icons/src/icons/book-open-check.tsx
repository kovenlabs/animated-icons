"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "book-open-check": "check" | "hop"
  }
}

/** `book-open`'s left page, unchanged. */
const LEFT = "M12 7 9 5H2v13h7l3 2"

/**
 * `book-open`'s right page with its outer edge opened for the check: the top runs out to the corner,
 * the bottom comes back up only to y 16, each end 4 clear of the tick.
 */
const RIGHT = ["M12 7l3-2h7", "M22 16v2h-7l-3 2"] as const

/** 2 colors: pages (primary), spine and check (accent). */
export const BookOpenCheck = createAnimatedIcon({
  name: "book-open-check",
  family: "book",
  category: "education",
  keywords: ["read", "lesson done", "completed course", "studied", "homework done", "reviewed", "learned"],
  slots: { primary: "pages", accent: "spine + check" },
  defaultVariant: "check",
  variants: {
    // the check fades out and redraws from its short leg (hidden while too short to read), and the
    // book gives a small nod as it lands
    check: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=check]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=check]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.8, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=book]",
            { scale: [1, 1, 1.05, 1] },
            { duration: seconds, times: [0, 0.6, 0.8, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a small hop that lands with a squash
    hop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=book]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <g data-part="book" style={pivot("50% 100%")}>
      <path d={LEFT} />
      {RIGHT.map((d) => (
        <path key={d} d={d} />
      ))}
      <path d="M12 7v13" stroke={slot.accent} />
      <path data-part="check" d="M16 13l2 2 4-4" stroke={slot.accent} style={pivot("40% 100%")} />
    </g>
  ),
})
