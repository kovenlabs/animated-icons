"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    keyboard: "type" | "space" | "wave"
  }
}

/**
 * Two staggered rows of 2×2 keys, listed left to right (so a stagger in DOM order sweeps across).
 * The case's inner edge is 3..21 × 5..19: every key sits 2 clear of it and of its neighbours.
 */
const KEYS = [
  { x: 5, y: 7 },
  { x: 7, y: 11 },
  { x: 9, y: 7 },
  { x: 11, y: 11 },
  { x: 13, y: 7 },
  { x: 15, y: 11 },
  { x: 17, y: 7 },
] as const

/** When each key (in KEYS order) is struck while typing: a hopping, word-like order. */
const TYPED = [0, 3, 5, 1, 6, 2, 4] as const

/** 2 colors: case (primary), keys and space bar (accent). */
export const Keyboard = createAnimatedIcon({
  name: "keyboard",
  category: "devices",
  keywords: ["typing", "keys", "input", "type", "qwerty", "shortcut", "hotkey"],
  slots: { primary: "case", accent: "keys + space bar" },
  defaultVariant: "type",
  variants: {
    // keys are struck one after another in a typing rhythm, each sinking and dimming as it is pressed
    type: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=key]",
          { scale: [1, 0.5, 1], opacity: [1, 0.35, 1] },
          { duration: seconds * 0.28, delay: (i: number) => TYPED[i]! * seconds * 0.1, ease: "easeInOut" },
        ),
    },
    // the space bar is thumped: it dips and squeezes, then springs back
    space: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=space]",
          { y: [0, 1, 0], scaleX: [1, 0.85, 1] },
          { duration: seconds, times: [0, 0.3, 1], ease: ["easeOut", ease.overshoot] },
        ),
    },
    // a wave runs across the keys from left to right, each hopping up and settling
    wave: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=key]",
          { y: [0, -1.5, 0], scale: [1, 1.2, 1] },
          { duration: seconds * 0.4, delay: stagger(seconds * 0.09), ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <path d="M2 4h20v16H2Z" />
      <g fill={slot.accent} stroke="none">
        {KEYS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} data-part="key" x={x} y={y} width="2" height="2" style={pivot("50% 50%")} />
        ))}
      </g>
      <path data-part="space" d="M8 16h8" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
