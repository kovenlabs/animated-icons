"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "parking-meter": "insert" | "expire" | "wobble"
  }
}

/** 2 colors: meter and post (primary), time display and coin (accent). */
export const ParkingMeter = createAnimatedIcon({
  name: "parking-meter",
  category: "transport",
  keywords: ["parking", "meter", "pay", "coin", "street", "time", "car park", "fee"],
  slots: { primary: "meter + post", accent: "time + coin" },
  defaultVariant: "insert",
  variants: {
    // a coin flies at the slot from in front of the glass, shrinking as it goes in; the meter gulps
    // it with a squash and the time bar refills from empty with a bounce
    insert: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=coin]",
            { scale: [2.4, 1, 0.2], opacity: [0, 1, 0], y: [-4, 0, 0] },
            { duration: seconds * 0.4, times: [0, 0.6, 1], ease: ["easeOut", ease.in] },
          ),
          animate(
            "[data-part=head]",
            { scaleY: [1, 1, 0.9, 1.04, 1], scaleX: [1, 1, 1.06, 0.98, 1] },
            { duration: seconds * 0.6, delay: seconds * 0.25, times: [0, 0.2, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=time]",
            { scaleX: [1, 0, 0, 1.15, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.8, 1], ease: ["easeIn", "linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // time's up: the bar drains in ticks, the meter shakes in alarm, then the bar springs back full
    expire: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=time]",
            { scaleX: [1, 0.66, 0.66, 0.33, 0.33, 0, 0, 1], opacity: [1, 1, 1, 1, 1, 1, 0.3, 1] },
            { duration: seconds, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=meter]",
            { rotate: [0, 0, -9, 8, -6, 4, 0] },
            { duration: seconds, times: [0, 0.5, 0.58, 0.66, 0.74, 0.82, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // knocked by a bumper: it rocks on its post, the head lagging the swing like a weight on a spring
    wobble: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=meter]", { rotate: [0, 12, -8, 4, -1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=head]",
            { rotate: [0, -6, 8, -5, 2, 0], skewX: [0, -6, 5, -2, 0, 0] },
            { duration: seconds, delay: seconds * 0.06, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="meter" style={pivot("50% 100%")}>
      <path d="M12 16v5M9 21h6" />
      <g data-part="head" style={pivot("50% 100%")}>
        {/* a chamfered head with a time window up top and a coin slot below */}
        <path d="M7 5l2-2h6l2 2v11H7Z" />
        <rect data-part="time" x="10" y="6" width="4" height="3" fill={slot.accent} stroke="none" style={pivot("0% 50%")} />
        <path d="M11 12h2" />
      </g>
      <circle data-part="coin" cx="12" cy="12" r="2" fill={slot.accent} stroke="none" style={flash()} />
    </g>
  ),
})
