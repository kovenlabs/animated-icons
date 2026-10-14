"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    mailbox: "flag" | "open" | "hop"
  }
}

/** 2 colors: box and door (primary), flag and letter (accent). */
export const Mailbox = createAnimatedIcon({
  name: "mailbox",
  category: "communication",
  keywords: ["mail", "post", "letterbox", "delivery", "inbox", "postal", "you've got mail"],
  slots: { primary: "box + door", accent: "flag + letter" },
  defaultVariant: "flag",
  variants: {
    // the flag spins round its pole in perspective, flips back past square and settles with a wag
    flag: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flag]",
            { scaleX: [1, 0, -0.65, 0, 1.1, 1], rotate: [0, 0, 0, 0, -8, 0] },
            { duration: seconds, times: [0, 0.18, 0.36, 0.54, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=mailbox]",
            { scaleY: [1, 0.95, 1.02, 1], y: [0, 0.5, -0.5, 0] },
            { duration: seconds * 0.6, delay: seconds * 0.4, ease: "easeOut" },
          ),
        ]),
    },
    // the door swings open towards you, a letter pops up inside the opening, then the door slams shut
    open: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=door]",
            { scaleX: [1, 0.15, 0.15, 1.06, 1], skewY: [0, -16, -16, 3, 0] },
            { duration: seconds, times: [0, 0.25, 0.65, 0.85, 1], ease: ["easeOut", "linear", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=letter]",
            { opacity: [0, 0, 1, 1, 0, 0], scale: [0.4, 0.4, 1.2, 1, 0.8, 0.8], y: [0, 0, -1.5, -1, 0, 0] },
            { duration: seconds, times: [0, 0.18, 0.32, 0.5, 0.6, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=mailbox]",
            { x: [0, 0, 0.6, -0.4, 0] },
            { duration: seconds, times: [0, 0.82, 0.88, 0.94, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the box crouches, jumps, and lands with a squash while the flag whips behind it
    hop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mailbox]",
            { y: [0, 0, -2, 0, 0], scaleY: [1, 0.86, 1.04, 0.9, 1], scaleX: [1, 1.02, 0.97, 1.02, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.7, 1], ease: ["easeOut", "easeOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=flag]",
            { rotate: [0, 0, -12, 10, -5, 0], scaleY: [1, 1, 1.1, 0.9, 1, 1] },
            { duration: seconds, times: [0, 0.25, 0.45, 0.7, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="mailbox" style={pivot("50% 100%")}>
      {/* the letter waiting inside: only there while the door is open */}
      <rect data-part="letter" x="6.5" y="10" width="3" height="5" fill={slot.accent} stroke="none" style={flash("50% 100%")} />
      {/* the long box behind its door, open at the door end */}
      <path d="M7 4h11l4 4v12H10" />
      {/* the door: a pentagon end, hinged on its outer edge */}
      <path data-part="door" d="M2 20V8l4-4 4 4v12Z" style={pivot("0% 50%")} />
      {/* the flag: a solid pole and pennant, pivoting on the pole's foot */}
      <path data-part="flag" d="M14 17V10h5v4h-3v3Z" fill={slot.accent} stroke="none" style={pivot("20% 100%")} />
    </g>
  ),
})
