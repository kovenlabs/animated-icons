"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    egg: "hatch" | "wobble" | "spin"
  }
}

/**
 * A faceted egg, narrow at the top, split across its widest part by a zigzag crack from (4, 14) to
 * (20, 14). Both halves are drawn with the crack, so the shell reads whole at rest and the lid lifts off
 * a jagged rim.
 */
const LID = "M4 14l1-5 3-4.5L12 2l4 2.5 3 4.5 1 5-2.5-2-2.5 3-3-3-3 3-2.5-3z"
const BASE = "M4 14l2.5-2 2.5 3 3-3 3 3 2.5-3 2.5 2-1.5 4.5L15 21H9l-3.5-2.5z"

/** 2 colors: shell (primary), speckles and the chick peeking out (accent). */
export const Egg = createAnimatedIcon({
  name: "egg",
  category: "nature",
  keywords: ["hatch", "chick", "easter", "breakfast", "birth", "new", "bird", "shell"],
  slots: { primary: "shell", accent: "speckles + chick" },
  defaultVariant: "hatch",
  variants: {
    // it rocks as something kicks inside, then the lid is punched up and away off its hinge (out through
    // the top of the frame) and a chick's eyes blink over the rim; the lid drops back on and the egg
    // squashes on the landing
    hatch: {
      duration: 1400,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=egg]",
            {
              rotate: [0, -9, 8, 0, 0, 0, 0],
              scaleY: [1, 1, 1, 1, 0.88, 1.04, 1],
              scaleX: [1, 1, 1, 1, 1.1, 0.98, 1],
            },
            { duration: seconds, times: [0, 0.1, 0.22, 0.32, 0.8, 0.9, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=lid]",
            { rotate: [0, 0, -20, -16, -20, 0, 0], y: [0, 0, -8, -7, -8, 0, 0] },
            {
              duration: seconds,
              times: [0, 0.32, 0.42, 0.52, 0.66, 0.76, 1],
              ease: ["linear", ease.out, "easeInOut", "easeInOut", ease.in, "linear"],
            },
          ),
          animate(
            "[data-part=chick-eye]",
            { opacity: [0, 0, 1, 1, 1, 1, 0, 0], scaleY: [0.4, 0.4, 1, 1, 0.15, 1, 1, 1] },
            { duration: seconds, times: [0, 0.36, 0.42, 0.52, 0.56, 0.6, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // something kicks inside: the egg rocks hard on its base, squashing on each tip, and the lid jolts
    // loose at the peaks
    wobble: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const rock = { duration: seconds, times: [0, 0.14, 0.32, 0.5, 0.66, 0.82, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate(
            "[data-part=egg]",
            { rotate: [0, -16, 13, -9, 5, -2, 0], scaleY: [1, 0.94, 0.95, 0.97, 0.98, 1, 1] },
            rock,
          ),
          animate("[data-part=lid]", { rotate: [0, -8, 0, -5, 0, 0, 0], y: [0, -1, 0, -0.5, 0, 0, 0] }, rock),
        ])
      },
    },
    // spun on its end like a top: it turns over twice, going edge-on so the speckles sweep round the
    // shell, and the egg wobbles on its point as it slows
    spin: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=egg]",
            { scaleX: [1, -1, 1, -1, 1, 1], rotate: [0, 4, -4, 6, -6, 0], y: [0, -1.5, 0, -1, 0, 0] },
            {
              duration: seconds,
              times: [0, 0.16, 0.34, 0.56, 0.82, 1],
              ease: ["easeInOut", "easeInOut", "easeInOut", "easeInOut", ease.overshoot],
            },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="egg" style={pivot("50% 100%")}>
      <path d={BASE} />
      {/* the chick's eyes peek over the rim, hidden under the lid until it is knocked off */}
      <g fill={slot.accent} stroke="none">
        <rect data-part="chick-eye" x="8.5" y="8.5" width="2" height="2" style={flash()} />
        <rect data-part="chick-eye" x="13.5" y="8.5" width="2" height="2" style={flash()} />
      </g>
      <rect x="11" y="16.5" width="2" height="2" fill={slot.accent} stroke="none" />
      {/* the lid's box is x 4..20, y 2..15: it hinges on its left end at (4, 14) and lifts to the right */}
      <g data-part="lid" style={pivot("0% 92.3%")}>
        <path d={LID} />
        <g fill={slot.accent} stroke="none">
          <rect x="8" y="7" width="2" height="2" />
          <rect x="13.5" y="6.5" width="2" height="2" />
        </g>
      </g>
    </g>
  ),
})
