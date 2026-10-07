"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    feather: "float" | "twirl" | "tickle"
  }
}

/**
 * The vane, symmetric about the shaft (the diagonal from (3, 21) to (21, 3)): a square corner at the
 * bottom left where the quill leaves it, straight flanks, and a blunt, faceted tip at the top right.
 */
const VANE = "M6 18V11l6-6 4.5-2.5L21 3l.5 4.5L19 12l-6 6z"

/** 2 colors: vane (primary), shaft (accent). */
export const Feather = createAnimatedIcon({
  name: "feather",
  category: "nature",
  keywords: ["quill", "plume", "bird", "light", "lightweight", "soft", "write", "float"],
  slots: { primary: "vane", accent: "shaft" },
  defaultVariant: "float",
  variants: {
    // caught by a breath of air: it lifts and rocks from side to side like a falling feather, then settles
    float: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=feather]",
          {
            x: [0, -3, 2.5, -1.5, 0.5, 0],
            y: [0, -3.5, -1.5, -2.5, -0.5, 0],
            rotate: [0, -22, 16, -9, 3, 0],
          },
          { duration: seconds, times: [0, 0.22, 0.46, 0.66, 0.84, 1], ease: "easeInOut" },
        ),
    },
    // spins a full turn about a vertical axis as it rises, and drifts back down
    twirl: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=feather]",
            { scaleX: [1, -1, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=feather]",
            { y: [0, -3, 0], scale: [1, 1.12, 1] },
            { duration: seconds, times: [0, 0.4, 1], ease: ["easeOut", ease.inOut] },
          ),
        ]),
    },
    // a quick, ticklish wiggle about the quill's tip, the vane flexing as it goes
    tickle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=quill]",
          { rotate: [0, -12, 10, -10, 8, -5, 0], skewX: [0, 6, -6, 5, -4, 2, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="feather" style={pivot("50% 50%")}>
      {/* the quill's tip is the bottom-left corner: it wiggles from there */}
      <g data-part="quill" style={pivot("0% 100%")}>
        <path d={VANE} />
        {/* one split in the barbs, from the shaft out to the edge */}
        <path d="M11 13h6" />
        <path d="M17 7 3 21" stroke={slot.accent} />
      </g>
    </g>
  ),
})
