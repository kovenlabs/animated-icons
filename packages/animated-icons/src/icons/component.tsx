"use client"

import { stagger, type Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    component: "flip" | "spin" | "burst"
  }
}

/** A diamond tile centred on (cx, cy), 3.5 from its centre to each point. */
const diamond = (cx: number, cy: number) => `M${cx} ${cy - 3.5}l3.5 3.5-3.5 3.5-3.5-3.5z`

/** Four tiles set in a diamond, top first and then clockwise; the top one is the main component. */
const TILES = [
  { cx: 12, cy: 5.5, main: true },
  { cx: 18.5, cy: 12, main: false },
  { cx: 12, cy: 18.5, main: false },
  { cx: 5.5, cy: 12, main: false },
] as const

/** Where each tile heads when they burst apart: straight out from the middle. */
const OUT = 2.5

/** 2 colors: tiles (primary), main component and the tiles' backs (accent). */
export const Component = createAnimatedIcon({
  name: "component",
  category: "design",
  keywords: ["figma", "design system", "ui component", "symbol", "instance", "module", "library", "variants"],
  slots: { primary: "tiles", accent: "main component + tile backs" },
  defaultVariant: "flip",
  variants: {
    // each tile turns over about its vertical axis in turn, clockwise from the top: halfway round it
    // shows its solid back, and it comes round to its outline again. The face swaps while the tile is
    // edge-on, so the swap itself is never seen
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds * 0.55, delay: stagger(seconds * 0.15) }
        return Promise.all([
          animate(
            "[data-part=tile]",
            { scaleX: [1, 0, -1, 0, 1], scaleY: [1, 1.2, 1, 1.2, 1] },
            { ...timing, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=back]",
            { opacity: [0, 0, 1, 1, 0, 0] },
            { ...timing, times: [0, 0.24, 0.25, 0.74, 0.75, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
        ])
      },
    },
    // the whole set whirls a full turn like a pinwheel, drawing in as it speeds up and overshooting
    // as it lands
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=set]",
            { rotate: [0, 380, 352, 360] },
            { duration: seconds, times: [0, 0.6, 0.82, 1], ease: [ease.inOut, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=set]",
            { scale: [1, 0.78, 1.06, 1] },
            { duration: seconds, times: [0, 0.35, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the tiles burst out towards you, swelling, then snap back together with a small overshoot
    burst: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.35, 0.7, 1], ease: [ease.out, ease.in, "easeOut"] satisfies Easing[] }
        const push = (dx: number, dy: number) => ({ x: [0, dx * OUT, -dx * 0.4, 0], y: [0, dy * OUT, -dy * 0.4, 0] })
        return Promise.all([
          animate("[data-part=tile]", { scale: [1, 1.25, 0.95, 1] }, timing),
          animate("[data-part=place-top]", push(0, -1), timing),
          animate("[data-part=place-right]", push(1, 0), timing),
          animate("[data-part=place-bottom]", push(0, 1), timing),
          animate("[data-part=place-left]", push(-1, 0), timing),
        ])
      },
    },
  },
  render: () => (
    <g data-part="set" style={pivot("50% 50%")}>
      {TILES.map(({ cx, cy, main }, i) => (
        <g key={i} data-part={`place-${["top", "right", "bottom", "left"][i]}`}>
          <g data-part="tile" style={pivot("50% 50%")}>
            <path d={diamond(cx, cy)} stroke={main ? slot.accent : undefined} />
            {/* the tile's back: solid, shown only while it is turned over */}
            <path data-part="back" d={diamond(cx, cy)} fill={slot.accent} stroke={slot.accent} style={flash()} />
          </g>
        </g>
      ))}
    </g>
  ),
})
