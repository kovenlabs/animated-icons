"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    stamp: "stamp" | "flip" | "rock"
  }
}

/** 2 colors: knob and block (primary), rubber pad and its print (accent). */
export const Stamp = createAnimatedIcon({
  name: "stamp",
  category: "design",
  keywords: ["rubber stamp", "approve", "approved", "seal", "certify", "mark", "official", "imprint"],
  slots: { primary: "knob + block", accent: "rubber pad + print" },
  defaultVariant: "stamp",
  variants: {
    // winds up with a tilt, slams down onto the paper with a squash, and the print bursts out wider
    // than it lands, with a puff off each side
    stamp: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stamp]",
            {
              y: [0, -3, 2, 2, -0.5, 0],
              rotate: [0, -8, 0, 0, 0, 0],
              scaleY: [1, 1.05, 0.82, 0.9, 1.03, 1],
              scaleX: [1, 0.96, 1.12, 1.06, 0.99, 1],
            },
            { duration: seconds, times: [0, 0.3, 0.42, 0.52, 0.75, 1], ease: ["easeOut", ease.in, "linear", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=print]",
            { opacity: [1, 0, 0, 1, 1, 1], scaleX: [1, 0.6, 0.6, 1.2, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.52, 0.8, 1], ease: ["easeOut", "linear", ease.out, "easeInOut", "linear"] },
          ),
          animate("[data-part=puff]", blink, { duration: seconds * 0.35, delay: seconds * 0.42, ease: "easeOut" }),
        ]),
    },
    // lifts off and tumbles a full turn head over heels, its pad facing up halfway, then lands squashed
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stamp]",
            { y: [0, -3, 0, 0], scaleY: [1, 1.04, 0.88, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
          animate("[data-part=turn]", { scaleY: [1, -1, 1] }, { duration: seconds * 0.75, ease: "easeInOut" }),
        ]),
    },
    // rocked onto one edge then the other to press the whole pad down, like inking a real stamp
    rock: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=rock-left]",
            { rotate: [0, -10, 0, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=rock-right]",
            { rotate: [0, 0, 0, 10, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the print it leaves on the paper */}
      <path data-part="print" d="M5 22h14" stroke={slot.accent} style={pivot("50% 50%")} />
      <g stroke={slot.accent}>
        <path data-part="puff" d="M3.5 19.5 2 18" style={flash("100% 100%")} />
        <path data-part="puff" d="M20.5 19.5 22 18" style={flash("0% 100%")} />
      </g>
      {/* squashes onto the paper from the pad's middle */}
      <g data-part="stamp" style={pivot("50% 100%")}>
        {/* rocks on its bottom-left corner, then its bottom-right */}
        <g data-part="rock-left" style={pivot("0% 100%")}>
          <g data-part="rock-right" style={pivot("100% 100%")}>
            <g data-part="turn" style={pivot("50% 50%")}>
              {/* a faceted knob on a neck */}
              <path d="M10 11V8L8 5V4l2-2h4l2 2v1l-2 3v3" />
              <path d="M4 11h16v5H4Z" />
              {/* the rubber pad under the block */}
              <path d="M5 17h14v2H5Z" fill={slot.accent} stroke="none" />
            </g>
          </g>
        </g>
      </g>
    </>
  ),
})
