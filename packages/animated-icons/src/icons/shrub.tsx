"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    shrub: "rustle" | "puff" | "grow"
  }
}

/** A faceted, bushy crown, open at the bottom where the stem goes in. */
const CROWN = "M8 18H6l-3-3v-5l3-4 3-2h6l3 2 3 4v5l-3 3h-2"

/** Top-left corners of the 2×2 berries, each at least 2px clear of the outline and the branches. */
const BERRIES = [
  { x: 6, y: 11 },
  { x: 10, y: 7 },
  { x: 15, y: 9 },
] as const

/** 2 colors: bush and ground (primary), berries (accent). */
export const Shrub = createAnimatedIcon({
  name: "shrub",
  category: "nature",
  keywords: ["bush", "plant", "garden", "hedge", "foliage", "greenery", "landscape", "berries"],
  slots: { primary: "bush + ground", accent: "berries" },
  defaultVariant: "rustle",
  variants: {
    // something rummages inside: the crown shakes from its stem in short jolts, the berries jiggling out
    // of step with it
    rustle: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=crown]",
            { rotate: [0, -7, 6, -6, 5, -3, 1, 0], scaleX: [1, 1.04, 0.97, 1.04, 0.98, 1.02, 1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=berry]",
            { scale: [1, 1.5, 0.8, 1.35, 0.9, 1], rotate: [0, 30, -20, 15, 0, 0] },
            { duration: seconds * 0.8, delay: stagger(seconds * 0.08), ease: "easeInOut" },
          ),
        ]),
    },
    // the bush takes a deep breath and swells, then lets it out and the berries are tossed up off it one
    // by one and drop back in with a bounce
    puff: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=crown]",
            { scaleX: [1, 1.12, 0.94, 1.03, 1], scaleY: [1, 1.1, 0.9, 1.02, 1] },
            {
              duration: seconds,
              times: [0, 0.3, 0.46, 0.7, 1],
              ease: ["easeInOut", ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=berry]",
            { y: [0, 0, -3, 0, -0.8, 0], scale: [1, 1, 1.3, 1, 1, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.36, 0.6, 0.8, 0.9, 1],
              delay: stagger(seconds * 0.1, { startDelay: seconds * 0.1 }),
              ease: ["linear", ease.out, ease.in, "easeOut", "easeIn"],
            },
          ),
        ]),
    },
    // it sprouts from the ground: the stem shoots up, the crown bursts out of it past full size and
    // settles, then the berries pop on one after another
    grow: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stem]",
            { scaleY: [1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.3, 1], ease: [ease.in, ease.out, "linear"] },
          ),
          animate(
            "[data-part=crown]",
            { scale: [1, 0, 0, 1.18, 0.95, 1] },
            {
              duration: seconds,
              times: [0, 0.12, 0.24, 0.5, 0.66, 0.8],
              ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=berry]",
            { scale: [1, 0, 0, 1.6, 1] },
            {
              duration: seconds * 0.8,
              times: [0, 0.1, 0.55, 0.8, 1],
              delay: stagger(seconds * 0.07),
              ease: [ease.in, "linear", ease.out, ease.overshoot],
            },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path d="M6 21h12" />
      <path data-part="stem" d="M12 21v-7M12 18l-3-3M12 17l3-3" style={pivot("50% 100%")} />
      {/* the crown swells and shakes from the point where the stem enters it */}
      <g data-part="crown" style={pivot("50% 100%")}>
        <path d={CROWN} />
        <g fill={slot.accent} stroke="none">
          {BERRIES.map(({ x, y }) => (
            <rect key={`${x}-${y}`} data-part="berry" x={x} y={y} width="2" height="2" style={pivot("50% 50%")} />
          ))}
        </g>
      </g>
    </>
  ),
})
