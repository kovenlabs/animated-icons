"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    eraser: "erase" | "flip" | "squish"
  }
}

/** Crumbs rubbed off the paper: each flicks out from the tip and falls (only exists in motion). */
const CRUMBS = [
  { d: "M5 19h2v2H5Z", x: [0, -1.5, -3], y: [0, -3, -1.5] },
  { d: "M14 19h2v2h-2Z", x: [0, 1.5, 3], y: [0, -3.5, -2] },
]

/** 2 colors: block and paper (primary), rubber tip and crumbs (accent). */
export const Eraser = createAnimatedIcon({
  name: "eraser",
  category: "design",
  keywords: ["erase", "rubber", "delete", "clear", "remove", "wipe", "clean up", "undo"],
  slots: { primary: "block + paper", accent: "rubber tip + crumbs" },
  defaultVariant: "erase",
  variants: {
    // scrubs hard back and forth, rocking on the corner that touches the paper; crumbs flick off both sides
    erase: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=eraser]",
            { x: [0, 2.5, -2, 2.5, -1.5, 0], rotate: [0, -14, 12, -12, 6, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          ...CRUMBS.map((crumb, i) =>
            animate(
              `[data-part=crumb-${i}]`,
              { x: crumb.x, y: crumb.y, opacity: [0, 1, 0], scale: [0.6, 1.2, 0.8] },
              { duration: seconds * 0.5, delay: seconds * (0.2 + i * 0.25), ease: "easeOut" },
            ),
          ),
        ]),
    },
    // tossed up, it turns a full circle about its own axis (squeezed thin edge-on, mirrored, then back)
    // and lands on its corner with a squash
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=eraser]",
            { y: [0, -4, 0, 0], scaleY: [1, 1.04, 0.86, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
          animate(
            "[data-part=turn]",
            { scaleX: [1, -1, 1], scale: [1, 1.15, 1] },
            { duration: seconds * 0.75, ease: "easeInOut" },
          ),
        ]),
    },
    // pressed flat into the paper like soft rubber, then springs back up past its shape and settles
    squish: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=eraser]",
          { scaleY: [1, 0.7, 1.15, 0.94, 1], scaleX: [1, 1.18, 0.9, 1.03, 1] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the paper, clear of the block's lower edge */}
      <path d="M16 21h5" />
      <g fill={slot.accent} stroke="none">
        {CRUMBS.map(({ d }, i) => (
          <path key={d} data-part={`crumb-${i}`} d={d} style={flash()} />
        ))}
      </g>
      {/* rocks and squashes about the corner on the paper */}
      <g data-part="eraser" style={pivot("44% 100%")}>
        <g data-part="turn" style={pivot("50% 50%")}>
          {/* a 45° block: the body runs up-right from the rubber tip */}
          <path d="M6 11l6-6 7 7-6 6" />
          <path d="M6 11l-3 3 7 7 3-3Z" stroke={slot.accent} />
        </g>
      </g>
    </>
  ),
})
