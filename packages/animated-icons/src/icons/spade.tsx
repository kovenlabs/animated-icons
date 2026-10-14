"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    spade: "flip" | "drop" | "sway"
  }
}

/** Dust kicked up either side of the stem when it lands: top-left corners of 2×2 squares. */
const DUST = [
  { x: 3, y: 20, dx: -1.5 },
  { x: 19, y: 20, dx: 1.5 },
] as const

/** 2 colors: suit (primary), stem and dust (accent). */
export const Spade = createAnimatedIcon({
  name: "spade",
  category: "gaming",
  keywords: ["cards", "suit", "poker", "playing card", "casino", "ace", "deck", "gamble"],
  slots: { primary: "suit", accent: "stem + dust" },
  defaultVariant: "flip",
  variants: {
    // the pip turns over like a card spun on its edge, stretching as it lifts and squashing as it lands
    flip: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=spade]", { scaleX: [1, -1, 1] }, { duration: seconds * 0.75, ease: "easeInOut" }),
          animate(
            "[data-part=spade]",
            { y: [0, -1, 0, 0], scaleY: [1, 1.06, 0.86, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
          ),
        ]),
    },
    // dropped from above: falls in stretched, squashes flat on its stem and kicks up dust
    drop: {
      clip: true,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=spade]",
            {
              y: [-10, 0, 0, 0, 0],
              opacity: [0, 1, 1, 1, 1],
              scaleY: [1.25, 1.15, 0.72, 1.08, 1],
              scaleX: [0.85, 0.9, 1.12, 0.96, 1],
            },
            { duration: seconds, times: [0, 0.35, 0.5, 0.72, 1], ease: [ease.in, "easeOut", "easeInOut", "easeInOut"] },
          ),
          ...DUST.map(({ dx }, i) =>
            animate(
              `[data-part=dust][data-side="${i}"]`,
              { ...blink, x: [0, dx, dx * 1.5] },
              { duration: seconds * 0.45, delay: seconds * 0.38, ease: "easeOut" },
            ),
          ),
        ]),
    },
    // rocks on its stem like a top about to settle, its face narrowing as it leans away
    sway: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=spade]",
          { skewX: [0, 10, -8, 4, 0], scaleX: [1, 0.88, 0.9, 0.97, 1] },
          { duration: seconds, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {DUST.map(({ x, y }, i) => (
          <rect key={x} data-part="dust" data-side={i} x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="spade" style={pivot("50% 100%")}>
        {/* a faceted spade: pointed crown, two square-shouldered lobes meeting in a notch */}
        <path d="M12 3l7 7 1.5 3-1 3-2.5 1.5h-2.5L12 15.5l-2.5 2H7l-2.5-1.5-1-3L5 10Z" />
        {/* the stem, a solid flared triangle hanging from the notch */}
        <path d="M12 16l3.5 5h-7Z" fill={slot.accent} stroke="none" />
      </g>
    </>
  ),
})
