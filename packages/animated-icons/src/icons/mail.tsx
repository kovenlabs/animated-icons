"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    mail: "notify" | "open" | "send"
  }
}

/** 3 colors: envelope (primary), flap (secondary), badge (accent). */
export const Mail = createAnimatedIcon({
  name: "mail",
  category: "communication",
  keywords: ["email", "inbox", "envelope", "letter", "send", "unread"],
  slots: { primary: "envelope + speed lines", secondary: "flap", accent: "badge" },
  defaultVariant: "notify",
  variants: {
    // the badge turns in from a diamond and lands square
    notify: {
      duration: 550,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=badge]",
            { scale: [0, 1.15, 1], rotate: [-45, 0, 0] },
            { duration: seconds, ease: ease.overshoot },
          ),
          animate("[data-part=envelope]", { y: [0, -1, 0] }, { duration: seconds * 0.7, ease: "easeOut" }),
        ]),
    },
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
            "[data-part=mail]",
            { x: [0, 7, -7, 0], y: [0, -2, 2, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          animate("[data-part=speed]", { opacity: [0, 1, 0] }, { duration: seconds * 0.4 }),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="speed" style={flash()}>
        <path d="M0 9h1.5" />
        <path d="M0 14h1.5" />
      </g>
      <g data-part="mail" style={pivot("50% 50%")}>
        <g data-part="envelope">
          {/* the top-right corner stays open for the badge */}
          <path d="M14 5H3v14h18v-9" />
          <path data-part="flap" d="M3 5l9 7 4.5-3.5" stroke={slot.secondary} style={pivot("50% 0%")} />
        </g>
        <rect data-part="badge" x="17" y="2" width="5" height="5" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
