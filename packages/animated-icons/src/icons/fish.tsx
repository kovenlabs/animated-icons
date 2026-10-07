"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    fish: "turn" | "swim" | "blub"
  }
}

/** A faceted body facing right, tapering to the point where the tail hinges, (6, 12). */
const BODY = "M6 12l4-5 5-1 4 3 2 3-2 3-4 3-5-1z"

/** 2 colors: body, gill and eye (primary), tail and bubbles (accent). */
export const Fish = createAnimatedIcon({
  name: "fish",
  category: "nature",
  keywords: ["animal", "sea", "ocean", "aquarium", "seafood", "fishing", "pet fish", "goldfish"],
  slots: { primary: "body + gill + eye", accent: "tail + bubbles" },
  defaultVariant: "turn",
  variants: {
    // it swims on the spot with its tail beating, then turns right round to face the other way (squeezing
    // through edge-on), beats again, and turns back
    turn: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=fish]",
            { scaleX: [1, 1, -1, -1, 1, 1], y: [0, 0, -1, 0, -1, 0] },
            { duration: seconds, times: [0, 0.15, 0.38, 0.6, 0.83, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=tail]",
            { rotate: [0, 22, -22, 22, -22, 22, -22, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // it darts forward out through the right edge with its tail thrashing, and glides back in from the left
    swim: {
      duration: 1100,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=fish]",
            { x: [0, -1.5, 10, -10, 0], opacity: [1, 1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.48, 1], ease: ["easeOut", ease.in, "linear", ease.out] },
          ),
          animate(
            "[data-part=tail]",
            { rotate: [0, 28, -28, 28, -28, 0, 0, 18, -12, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // it wriggles, body and tail swinging against each other about the tail's hinge, and blows two
    // bubbles that rise and pop
    blub: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=body]",
            { rotate: [0, -6, 6, -4, 0] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=tail]",
            { rotate: [0, 18, -24, 16, -8, 0] },
            { duration: seconds * 0.8, delay: seconds * 0.06, ease: "easeInOut" },
          ),
          animate(
            "[data-part=bubble-1]",
            { y: [2.5, -2.5], opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 1.2] },
            { duration: seconds * 0.55, delay: seconds * 0.15, ease: "easeOut" },
          ),
          animate(
            "[data-part=bubble-2]",
            { y: [3, 0], opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 1.2] },
            { duration: seconds * 0.55, delay: seconds * 0.42, ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="fish" style={pivot("50% 50%")}>
        <g data-part="body" style={pivot("0% 50%")}>
          <path d={BODY} />
          {/* a chevron gill and a square eye */}
          <path d="M12 9l-1.5 3 1.5 3" />
          <rect x="15" y="10" width="2" height="2" fill={slot.primary} stroke="none" />
        </g>
        {/* the tail hinges on its apex, the body's back point */}
        <path data-part="tail" d="M6 12 2 8v8z" stroke={slot.accent} style={pivot("100% 50%")} />
      </g>
      {/* bubbles are round, so true circles */}
      <g stroke={slot.accent}>
        <circle data-part="bubble-1" cx="20.5" cy="5.5" r="1.5" style={flash()} />
        <circle data-part="bubble-2" cx="17" cy="3" r="1" style={flash()} />
      </g>
    </>
  ),
})
