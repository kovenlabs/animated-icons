"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    send: "fly" | "lift" | "wobble"
  }
}

/** 2 colors: plane (primary), fold line (accent). */
export const Send = createAnimatedIcon({
  name: "send",
  category: "communication",
  keywords: ["paper plane", "submit", "message", "dispatch", "deliver", "share", "post"],
  slots: { primary: "plane", accent: "fold line" },
  defaultVariant: "fly",
  variants: {
    // flies off along its heading through the top-right, glides back in from the bottom-left
    fly: {
      clip: true,
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=plane]",
          { x: [0, 8, -8, 0], y: [0, -8, 8, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // a small push forward on its heading, settling back with a little give
    lift: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=plane]",
          { x: [0, 2, -0.5, 0], y: [0, -2, 0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // rocks on the air, nose up then down, like a glider catching a gust
    wobble: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=plane]",
          { rotate: [0, -10, 7, -3, 0] },
          { duration: seconds, ease: ease.inOut },
        ),
    },
  },
  render: () => (
    <g data-part="plane" style={pivot("50% 50%")}>
      {/* a dart, symmetric about its heading: nose top-right, wings left and bottom, a notch at the tail */}
      <path d="M22 2 15 21l-4-8-8-4Z" />
      {/* the centre fold runs from the tail notch into the nose, ending where the nose strokes meet */}
      <path d="M11 13l9-9" stroke={slot.accent} />
    </g>
  ),
})
