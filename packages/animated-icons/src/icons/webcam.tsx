"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    webcam: "look" | "spin" | "focus"
  }
}

/** 2 colors: head + stand (primary), lens and glow (accent). */
export const Webcam = createAnimatedIcon({
  name: "webcam",
  category: "devices",
  keywords: ["camera", "video call", "meeting", "stream", "record", "facetime", "zoom", "conference"],
  slots: { primary: "head + stand", accent: "lens + glow" },
  defaultVariant: "look",
  variants: {
    // the ball head looks left, then right: its lens slides round the ball, foreshortened near the
    // edge, while the head tips on its stand
    look: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.22, 0.42, 0.62, 0.82, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=lens]", { x: [0, -3, -3, 3, 3, 0], scaleX: [1, 0.72, 0.72, 0.72, 0.72, 1] }, timing),
          animate("[data-part=head]", { rotate: [0, -7, -7, 7, 7, 0] }, timing),
        ])
      },
    },
    // the ball spins a full turn: the lens rolls away round the right edge, is gone behind the ball,
    // and comes back round the left
    spin: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          // round a ball, the lens slides fastest as it faces you and slowest at the edge...
          animate(
            "[data-part=lens]",
            { x: [0, 5, -5, 0] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeOut", "linear", "easeOut"] },
          ),
          // ...while it narrows slowest as it faces you and fastest at the edge
          animate(
            "[data-part=lens]",
            { scaleX: [1, 0.3, 0.3, 1] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeIn", "linear", "easeOut"] },
          ),
          animate(
            "[data-part=lens]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.28, 0.35, 0.65, 0.72, 1] },
          ),
        ]),
    },
    // the lens racks focus: the iris closes down, opens wide past its size and settles, while the
    // head leans in and lights up
    focus: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lens]",
            { scale: [1, 0.5, 1.35, 0.92, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.8, 1], ease: ["easeInOut", ease.overshoot, "easeInOut", "easeInOut"] },
          ),
          animate("[data-part=head]", { scale: [1, 0.96, 1.08, 1] }, { duration: seconds, times: [0, 0.3, 0.6, 1], ease: "easeInOut" }),
          animate("[data-part=glow]", { opacity: [0, 0, 1, 0] }, { duration: seconds, times: [0, 0.4, 0.6, 1], ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      {/* a single stem on a flat foot */}
      <path d="M12 18v4M7 22h10" />
      {/* the head tips on the top of its stem */}
      <g data-part="head" style={pivot("50% 100%")}>
        {/* the head and its lens are round, so they are true circles */}
        <circle data-part="glow" cx="12" cy="10" r="7" fill={slot.accent} fillOpacity={0.2} stroke="none" style={flash()} />
        <circle cx="12" cy="10" r="8" />
        <circle data-part="lens" cx="12" cy="10" r="3" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
