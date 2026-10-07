"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    disc: "spin" | "scratch" | "flip"
  }
}

/** 2 colors: disc and hole (primary), groove shine (accent). */
export const Disc = createAnimatedIcon({
  name: "disc",
  category: "media",
  keywords: ["cd", "dvd", "record", "vinyl", "album", "music", "optical disc", "media"],
  slots: { primary: "disc + hole", accent: "groove shine" },
  defaultVariant: "spin",
  variants: {
    // tips back into perspective like a record seen on a turntable, spins two turns there, and stands
    // back up. The tilt squashes and shears the whole disc while the face spins inside it, so the shine
    // sweeps round an ellipse
    spin: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=disc]",
            { scaleY: [1, 0.45, 0.45, 1], skewX: [0, -18, -18, 0], y: [0, 1.5, 1.5, 0] },
            { duration: seconds, times: [0, 0.22, 0.78, 1], ease: ["easeInOut", "linear", ease.overshoot] },
          ),
          animate("[data-part=face]", { rotate: [0, 720] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // a DJ scratch: dragged back, pushed forward, back again, then let go
    scratch: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=face]",
            { rotate: [0, -70, 40, -45, 20, 0] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=disc]",
            { x: [0, -1, 1, -1, 0.5, 0] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // tossed like a coin: it turns over twice on its vertical axis at the top of a hop and lands with a squash
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=disc]",
            { scaleX: [1, -1, 1, -1, 1], skewY: [0, 10, 0, -10, 0] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=toss]",
            { y: [0, -4, 0, 0], scaleY: [1, 1.05, 0.88, 1] },
            { duration: seconds, times: [0, 0.4, 0.8, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="toss" style={pivot("50% 100%")}>
      <g data-part="disc" style={pivot("50% 50%")}>
        <g data-part="face" style={pivot("50% 50%")}>
          {/* a disc is round, so it gets true circles: the rim and the centre hole */}
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="2" />
          {/* two quarter arcs of shine on opposite sides, 2 clear of the hole and of the rim */}
          <path d="M6 12a6 6 0 0 1 6-6M18 12a6 6 0 0 1-6 6" stroke={slot.accent} />
        </g>
      </g>
    </g>
  ),
})
