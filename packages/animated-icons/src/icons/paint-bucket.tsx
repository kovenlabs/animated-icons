"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "paint-bucket": "pour" | "fill" | "turn"
  }
}

/** 2 colors: bucket and bail (primary), paint and its drip (accent). */
export const PaintBucket = createAnimatedIcon({
  name: "paint-bucket",
  family: "paint",
  category: "design",
  keywords: ["fill", "bucket fill", "flood fill", "paint", "color fill", "pour", "background color"],
  slots: { primary: "bucket + bail", accent: "paint + drip" },
  defaultVariant: "pour",
  variants: {
    // the bucket tips further to pour: the drip stretches and falls out of the frame, the bucket rocks
    // back upright and a fresh drip swells out of the lip and wobbles
    pour: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bucket]",
            { rotate: [0, 16, 16, -5, 2, 0] },
            { duration: seconds, times: [0, 0.2, 0.38, 0.58, 0.78, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=drop]",
            {
              y: [0, 0, 10, 0, 0, 0, 0],
              scaleY: [1, 1.35, 1.35, 0, 1.2, 0.92, 1],
              scaleX: [1, 0.85, 0.85, 0, 0.9, 1.04, 1],
            },
            {
              duration: seconds,
              times: [0, 0.15, 0.4, 0.42, 0.62, 0.8, 1],
              ease: ["easeIn", ease.in, snap, ease.out, "easeInOut", "easeInOut"],
            },
          ),
        ]),
    },
    // the paint drains down into the bottom corner, then floods back up past full; the bucket jiggles
    // and the overflow swells out as a fresh drip
    fill: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=paint]",
            { scale: [1, 0, 0, 1.08, 1, 1] },
            { duration: seconds, times: [0, 0.25, 0.35, 0.65, 0.8, 1], ease: ["easeIn", "linear", ease.out, "easeInOut", "linear"] },
          ),
          animate(
            "[data-part=drop]",
            { scale: [1, 0, 0, 1.3, 1] },
            { duration: seconds, times: [0, 0.15, 0.6, 0.82, 1], ease: ["easeIn", "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=bucket]",
            { rotate: [0, 0, -7, 4, 0] },
            { duration: seconds, times: [0, 0.55, 0.7, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // hops and turns a full circle about its upright axis, mirrored halfway, then lands with a squash
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=paint-bucket]",
            { y: [0, -3, 0, 0], scaleY: [1, 1.04, 0.9, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
          animate("[data-part=turn]", { scaleX: [1, -1, 1] }, { duration: seconds * 0.75, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="paint-bucket" style={pivot("50% 100%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        {/* tips about its middle */}
        <g data-part="bucket" style={pivot("50% 50%")}>
          {/* the paint lies level in the lower half; drains into and fills from the bottom corner */}
          <path data-part="paint" d="M3 11h16l-8 8Z" fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
          {/* a bucket tipped on its corner, its bail sticking out of the top */}
          <path d="M11 3l8 8-8 8-8-8Z" />
          <path d="M10 8 5 3" />
        </g>
        {/* a faceted drip under the lip, hanging from its tip */}
        <path
          data-part="drop"
          d="M20 15l2 3v2l-2 2-2-2v-2Z"
          fill={slot.accent}
          stroke={slot.accent}
          style={pivot("50% 0%")}
        />
      </g>
    </g>
  ),
})
