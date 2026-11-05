"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    envelope: "open" | "send" | "hop"
  }
}

/** 2 colors: envelope + speed lines (primary), flap (accent). The plain `mail` envelope: no badge, every corner closed. */
export const Envelope = createAnimatedIcon({
  name: "envelope",
  category: "communication",
  keywords: ["email", "mail", "letter", "message", "email address", "inbox", "contact"],
  slots: { primary: "envelope + speed lines", accent: "flap" },
  defaultVariant: "open",
  variants: {
    // the flap lifts open past the top edge and folds back down
    open: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=flap]", { scaleY: [1, -0.6, 1] }, { duration: seconds, ease: "easeInOut" }),
    },
    // slips out to the right, back in from the left
    send: {
      clip: true,
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=envelope]",
            { x: [0, 7, -7, 0], y: [0, -2, 2, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          animate("[data-part=speed]", { opacity: [0, 1, 0] }, { duration: seconds * 0.4 }),
        ]),
    },
    // a letter dropping in: it crouches, hops and lands with a small squash
    hop: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=envelope]",
          { y: [0, 0.5, -2.5, 0, 0], scaleY: [1, 0.92, 1.04, 0.92, 1], scaleX: [1, 1.04, 0.98, 1.04, 1] },
          { duration: seconds, times: [0, 0.15, 0.45, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="speed" style={flash()}>
        <path d="M0 9h1.5" />
        <path d="M0 14h1.5" />
      </g>
      <g data-part="envelope" style={pivot("50% 100%")}>
        <path d="M3 5h18v14H3z" />
        <path data-part="flap" d="M3 5l9 7 9-7" stroke={slot.accent} style={pivot("50% 0%")} />
      </g>
    </>
  ),
})
