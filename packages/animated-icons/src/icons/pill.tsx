"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    pill: "tumble" | "split" | "spin"
  }
}

/** 2 colors: shell (primary), filled half + granules (accent). The granules only exist in motion. */
export const Pill = createAnimatedIcon({
  name: "pill",
  category: "education",
  keywords: ["medicine", "capsule", "drug", "pharmacy", "tablet", "medication", "health", "prescription"],
  slots: { primary: "shell", accent: "filled half + granules" },
  defaultVariant: "tumble",
  variants: {
    // tossed up, it tumbles end over end, its coloured half swapping ends as it comes toward you at the
    // top, and lands with a squash
    tumble: {
      duration: 1200,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=toss]",
            { y: [0, -5, 0, 0], scale: [1, 1.15, 1, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=land]",
            { scaleY: [1, 1, 0.82, 1.05, 1], scaleX: [1, 1, 1.1, 0.97, 1] },
            { duration: seconds, times: [0, 0.75, 0.82, 0.92, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=capsule]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.75, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
        ]),
    },
    // the capsule pulls apart at its seam and a puff of granules spills from the gap before it closes
    split: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=half-a]",
            { x: [0, -2.5, -2.5, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=half-b]",
            { x: [0, 2.5, 2.5, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
          ...[-1, 1].map((side) =>
            animate(
              `[data-part=granule-${side < 0 ? "a" : "b"}]`,
              { opacity: [0, 1, 0], y: [0, side * 6, side * 8], scale: [0.6, 1, 0.6] },
              { duration: seconds * 0.45, delay: seconds * 0.25, ease: "easeOut" },
            ),
          ),
        ]),
    },
    // spun a whole turn in the hand and settled with a bounce
    spin: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=toss]",
          { rotate: [0, 380, 360], scale: [1, 1.15, 1] },
          { duration: seconds, times: [0, 0.75, 1], ease: ["easeInOut", "easeOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="land" style={pivot("50% 100%")}>
      <g data-part="toss" style={pivot("50% 50%")}>
        {/* drawn level and tipped 45°; its rounded ends are true half circles */}
        <g transform="rotate(-45 12 12)">
          <g data-part="capsule" style={pivot("50% 50%")}>
            <path data-part="half-b" d="M12 8.5h6.5a3.5 3.5 0 0 1 0 7H12z" fill={slot.accent} stroke={slot.accent} />
            <path data-part="half-a" d="M12 8.5H5.5a3.5 3.5 0 0 0 0 7H12z" />
          </g>
          {/* granules wait at the seam and only spill out across the axis while the halves are apart */}
          <g fill={slot.accent} stroke="none">
            <rect data-part="granule-a" x="11" y="11" width="2" height="2" style={flash()} />
            <rect data-part="granule-b" x="11" y="11" width="2" height="2" style={flash()} />
          </g>
        </g>
      </g>
    </g>
  ),
})
