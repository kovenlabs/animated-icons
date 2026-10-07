"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    inbox: "receive" | "jump" | "tilt"
  }
}

/** 2 colors: tray (primary), slot and incoming item (accent). */
export const Inbox = createAnimatedIcon({
  name: "inbox",
  category: "communication",
  keywords: ["mail", "messages", "tray", "received", "email", "incoming", "unread"],
  slots: { primary: "tray", accent: "slot + incoming item" },
  defaultVariant: "receive",
  variants: {
    // an item drops into the open tray and the slot gives under it as it lands
    receive: {
      clip: false,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=item]",
            { opacity: [0, 1, 1, 0], y: [0, 0, 2, 2] },
            { duration: seconds * 0.7, times: [0, 0.2, 0.75, 1], ease: ["easeOut", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=slot]",
            { scaleY: [1, 1, 1.5, 0.9, 1] },
            { duration: seconds, times: [0, 0.5, 0.68, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // a small hop that lands with a squash
    jump: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=inbox]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.92, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
    // jostled: the tray rocks on its base and settles
    tilt: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate("[data-part=inbox]", { rotate: [0, -8, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      {/* only exists in motion: appears under the back rim and falls towards the slot */}
      <rect data-part="item" x="9" y="6" width="6" height="3" fill={slot.accent} stroke="none" style={flash()} />
      <g data-part="inbox" style={pivot("50% 100%")}>
        {/* a tray in perspective: back rim, flared sides, then a straight box */}
        <path d="M7 4h10l5 8v8H2v-8Z" />
        {/* the slot is a dip in the tray's floor line; it deepens from the floor line down */}
        <path data-part="slot" d="M2 12h6l2 3h4l2-3h6" stroke={slot.accent} style={pivot("50% 0%")} />
      </g>
    </>
  ),
})
