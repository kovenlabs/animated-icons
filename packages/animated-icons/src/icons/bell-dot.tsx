"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "bell-dot": "notify" | "pulse" | "spin"
  }
}

/** 2 colors: body (primary), notification dot and clapper (accent). */
export const BellDot = createAnimatedIcon({
  name: "bell-dot",
  family: "bell",
  category: "communication",
  keywords: ["notification", "unread", "badge", "alert", "new", "inbox", "reminder", "activity"],
  slots: { primary: "body", accent: "dot + clapper" },
  defaultVariant: "notify",
  variants: {
    // the dot pops in with an overshoot and knocks the bell into a swing, its clapper lagging behind
    notify: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dot]",
            { scale: [0, 1.45, 0.85, 1] },
            { duration: seconds * 0.45, times: [0, 0.5, 0.8, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=body]",
            { rotate: [0, -12, 10, -6, 3, 0] },
            { duration: seconds * 0.8, delay: seconds * 0.2, ease: "easeInOut" },
          ),
          animate(
            "[data-part=clapper]",
            { x: [0, 2, -2, 1.2, 0] },
            { duration: seconds * 0.8, delay: seconds * 0.27, ease: "easeInOut" },
          ),
        ]),
    },
    // the dot throbs twice, squashing and stretching like a heartbeat, and the bell flinches at each beat
    pulse: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dot]",
            { scaleX: [1, 1.35, 0.85, 1, 1.35, 0.85, 1], scaleY: [1, 0.8, 1.25, 1, 0.8, 1.25, 1] },
            { duration: seconds, times: [0, 0.12, 0.26, 0.4, 0.55, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=body]",
            { rotate: [0, -5, 0, 0, -5, 0, 0] },
            { duration: seconds, times: [0, 0.12, 0.3, 0.4, 0.55, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the dot spins like a tossed coin, edge-on twice, while the bell rocks in perspective under it
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dot]",
            { scaleX: [1, -1, 1, -1, 1], scale: [1, 1.1, 1.1, 1.1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=bell]",
            { skewX: [0, 8, -3, 1, 0], scaleY: [1, 0.94, 1.02, 1, 1] },
            { duration: seconds, ease: ease.inOut },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a round badge in the top-right corner, clear of the crown */}
      <circle data-part="dot" cx="19.5" cy="5" r="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      <g data-part="bell" style={pivot("50% 100%")}>
        <g data-part="body" style={pivot("50% 0%")}>
          <path d="M11 2v3" />
          {/* the bell's trapezoid, slimmed and set left so the badge has room */}
          <path d="M8 5h6l1.5 10 1.5 3H5l1.5-3z" />
        </g>
        <path data-part="clapper" d="M9 21h4" stroke={slot.accent} />
      </g>
    </>
  ),
})
