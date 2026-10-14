"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "pill-bottle": "pop" | "shake" | "spin"
  }
}

/** Two pills waiting under the cap: they only show while it is off. */
const PILLS = [9, 13] as const

/** 2 colors: bottle and label (primary), cap and pills (accent). */
export const PillBottle = createAnimatedIcon({
  name: "pill-bottle",
  family: "pill",
  category: "health",
  keywords: ["medicine", "prescription", "pharmacy", "pills", "vitamins", "supplements", "medication", "drug"],
  slots: { primary: "bottle + label", accent: "cap + pills" },
  defaultVariant: "pop",
  variants: {
    // squeezed, the cap pops off spinning out of the top, two pills hop out of the open bottle, and
    // the cap drops back on with a squash
    pop: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bottle]",
            { scaleY: [1, 0.88, 1.05, 1, 1, 0.9, 1.03, 1], scaleX: [1, 1.06, 0.97, 1, 1, 1.05, 0.99, 1] },
            { duration: seconds, times: [0, 0.15, 0.25, 0.35, 0.72, 0.8, 0.9, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=cap]",
            { y: [0, 0, -12, -12, 0, 0], rotate: [0, 0, -160, -200, -360, -360] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: ["linear", ease.out, "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=pill]",
            { opacity: [0, 1, 1, 0], y: [0, -5, -4, 1], rotate: [0, 45, 90, 90] },
            { duration: seconds * 0.35, delay: stagger(seconds * 0.07, { startDelay: seconds * 0.27 }), ease: "easeOut" },
          ),
        ]),
    },
    // rattled hard: it rocks from side to side, leaning into each shake in perspective, and settles
    shake: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=rattle]",
          {
            rotate: [0, -10, 9, -8, 6, -3, 0],
            skewX: [0, -5, 5, -4, 3, -1, 0],
            x: [0, -1, 1, -1, 0.8, -0.4, 0],
          },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // spins on its own axis: the label slides round the side and out of view and comes round from the
    // other side, the bottle drawing in as it turns and settling with a squash as it faces you again
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=label]",
            {
              x: [0, 2.5, -2.5, 0],
              scaleX: [1, 0.4, 0.4, 1],
              opacity: [1, 0, 0, 1],
            },
            { duration: seconds * 0.75, times: [0, 0.45, 0.46, 1], ease: ["easeIn", snap, "easeOut"] },
          ),
          animate(
            "[data-part=bottle]",
            { scaleX: [1, 0.94, 0.94, 1.06, 1], scaleY: [1, 1, 1, 0.9, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 0.82, 1], ease: ["easeOut", "linear", "easeOut", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="bottle" style={pivot("50% 100%")}>
      <g data-part="rattle" style={pivot("50% 50%")}>
        <g fill={slot.accent} stroke="none">
          {PILLS.map((x) => (
            <rect key={x} data-part="pill" x={x} y="8" width="2" height="2" style={flash()} />
          ))}
        </g>
        {/* an open-topped body, a square label across its middle */}
        <path d="M6 7v14h12V7" />
        <path data-part="label" d="M10 11h4v6h-4Z" style={pivot("50% 50%")} />
        <path data-part="cap" d="M4 3h16v4H4Z" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
