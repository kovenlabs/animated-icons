"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    axe: "chop" | "hurl" | "gleam"
  }
}

/**
 * A felling axe on the diagonal: the handle rises from the grip (3, 19) to the head, whose blade
 * flares out to a straight edge facing down-right, square to the handle. The handle stops at the
 * head's stroke, so its cap hides in it.
 */
const HEAD = "M10.5 7.5 13.5 4.5 17 8 22 10 16 16 14 11Z"

/** Wood chips that spray along the cut, each from its resting spot past the blade's edge. */
const CHIPS = [
  { x: 20, y: 16, fly: { x: [0, 1.5], y: [0, -3] } },
  { x: 16.5, y: 19, fly: { x: [0, -3], y: [0, 1] } },
]

/** 2 colors: handle (primary), head, chips and glint (accent). */
export const Axe = createAnimatedIcon({
  name: "axe",
  category: "development",
  keywords: ["tool", "chop", "wood", "lumberjack", "hatchet", "cut", "firewood", "camping"],
  slots: { primary: "handle", accent: "head + chips + glint" },
  defaultVariant: "chop",
  variants: {
    // reared back and away from you, brought down hard past rest so it bites and quivers in the
    // wood, chips spraying off the edge on impact
    chop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=axe]",
            { rotate: [0, -20, 5, -2, 1, 0], scale: [1, 0.92, 1.03, 1, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.38, 0.55, 0.7, 0.85, 1],
              ease: ["easeOut", ease.in, "easeInOut", "easeInOut", "easeOut"],
            },
          ),
          ...CHIPS.map(({ fly }, i) =>
            animate(
              `[data-part=chip-${i}]`,
              { ...fly, opacity: [0, 1, 0], rotate: [0, 120] },
              { duration: seconds * 0.4, delay: seconds * 0.55, ease: "easeOut" },
            ),
          ),
        ]),
    },
    // hurled end over end into the distance, shrinking away, and boomeranging back into the hand
    hurl: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=axe-body]",
          { rotate: [0, 720], scale: [1, 0.4, 1], y: [0, -3, 0], opacity: [1, 0.55, 1] },
          { duration: seconds, ease: ease.inOut },
        ),
    },
    // lifted and turned toward you to admire the edge, which catches the light in a sparkle
    gleam: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=axe-body]",
            { rotate: [0, -10, -10, 0], scale: [1, 1.06, 1.06, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=glint]",
            { opacity: [0, 1, 0], scale: [0, 1.3, 0], rotate: [0, 90] },
            { duration: seconds * 0.45, delay: seconds * 0.3, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {CHIPS.map(({ x, y }, i) => (
          <rect key={i} data-part={`chip-${i}`} x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
      <path data-part="glint" d="M20.5 15.5v3M19 17h3" stroke={slot.accent} style={flash()} />
      <g data-part="axe-body" style={pivot("50% 50%")}>
        {/* swings from the grip, its box's bottom-left corner */}
        <g data-part="axe" style={pivot("0% 100%")}>
          <path d="M3 19 12.5 9.5" />
          <path d={HEAD} stroke={slot.accent} />
        </g>
      </g>
    </>
  ),
})
