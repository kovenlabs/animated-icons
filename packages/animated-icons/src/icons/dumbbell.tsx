"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    dumbbell: "lift" | "twirl" | "slam"
  }
}

/** 2 colors: bar (primary), weight plates and dust (accent). */
export const Dumbbell = createAnimatedIcon({
  name: "dumbbell",
  category: "sports",
  keywords: ["gym", "fitness", "workout", "weights", "exercise", "strength", "training", "sport"],
  slots: { primary: "bar", accent: "plates + dust" },
  defaultVariant: "lift",
  variants: {
    // crouches, heaves it overhead and the plates sag on the bar with the weight before it is set down
    lift: {
      clip: false,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dumbbell]",
            { y: [0, 1.5, -5, -4, 0], scaleY: [1, 0.86, 1.08, 1, 1], scaleX: [1, 1.08, 0.96, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.5, 0.7, 1], ease: ["easeOut", ease.out, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=plate-l]",
            { rotate: [0, 0, -14, 6, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=plate-r]",
            { rotate: [0, 0, 14, -6, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // tossed into a baton twirl: a half turn that swings toward you (it grows), landing on its own pose
    twirl: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=spin]",
          { rotate: [0, 0, 180, 180, 0], scale: [1, 0.9, 1.18, 1, 1] },
          { duration: seconds, times: [0, 0.15, 0.75, 0.999, 1], ease: ["easeOut", ease.inOut, ease.overshoot, snap] },
        ),
    },
    // hoisted slowly, slammed onto the floor with a squash and a puff of dust either side
    slam: {
      clip: false,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dumbbell]",
            { y: [0, -4.5, 0, 0, 0], scaleY: [1, 1.05, 1, 0.78, 1], scaleX: [1, 0.97, 1, 1.12, 1] },
            { duration: seconds, times: [0, 0.4, 0.55, 0.65, 1], ease: ["easeOut", ease.in, "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=dust-l]",
            { ...blink, x: [0, -1.5, -3] },
            { duration: seconds * 0.4, delay: seconds * 0.55, ease: "easeOut" },
          ),
          animate(
            "[data-part=dust-r]",
            { ...blink, x: [0, 1.5, 3] },
            { duration: seconds * 0.4, delay: seconds * 0.55, ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        <rect data-part="dust-l" x="3" y="20" width="2" height="2" style={flash()} />
        <rect data-part="dust-r" x="19" y="20" width="2" height="2" style={flash()} />
      </g>
      <g data-part="dumbbell" style={pivot("50% 100%")}>
        <g data-part="spin" style={pivot("50% 50%")}>
          {/* a straight bar between two tall square plates; each plate hinges where it meets the bar */}
          <path d="M7 12h10" />
          <g stroke={slot.accent}>
            <path data-part="plate-l" d="M3 7h4v10H3Z" style={pivot("100% 50%")} />
            <path data-part="plate-r" d="M17 7h4v10h-4Z" style={pivot("0% 50%")} />
          </g>
        </g>
      </g>
    </>
  ),
})
