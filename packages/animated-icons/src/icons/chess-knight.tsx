"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "chess-knight": "leap" | "rear" | "turn"
  }
}

/** 2 colors: piece (primary), eye (accent). */
export const ChessKnight = createAnimatedIcon({
  name: "chess-knight",
  category: "gaming",
  keywords: ["chess", "knight", "horse", "strategy", "board game", "move", "piece", "tactics"],
  slots: { primary: "piece", accent: "eye" },
  defaultVariant: "leap",
  variants: {
    // the knight's jump: it crouches, springs out over the top-right and drops back in from above,
    // landing squashed on its base
    leap: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=knight]",
          {
            x: [0, 0, 8, -4, 0, 0, 0],
            y: [0, 0, -10, -10, 0, 0, 0],
            rotate: [0, 0, 15, -15, 0, 0, 0],
            opacity: [1, 1, 0, 0, 1, 1, 1],
            scaleY: [1, 0.82, 1.15, 1.15, 1, 0.84, 1],
            scaleX: [1, 1.1, 0.9, 0.9, 1, 1.1, 1],
          },
          {
            duration: seconds,
            times: [0, 0.16, 0.4, 0.42, 0.68, 0.8, 1],
            ease: ["easeOut", ease.in, "linear", "easeIn", "easeOut", ease.overshoot],
          },
        ),
    },
    // the horse rears back off its front, paws the air twice and stamps down onto the base
    rear: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            { rotate: [0, 14, 8, 14, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.45, 0.62, 0.85, 1], ease: ["easeOut", "easeInOut", "easeInOut", ease.in, "linear"] },
          ),
          animate(
            "[data-part=base]",
            { scaleX: [1, 1, 1.08, 1], scaleY: [1, 1, 0.75, 1] },
            { duration: seconds, times: [0, 0.82, 0.9, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the piece turns on its square to look the other way, hops, and turns back
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=knight]",
          { scaleX: [1, -1, -1, 1], y: [0, -1, -1, 0], scaleY: [1, 1.04, 1.04, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="knight" style={pivot("50% 100%")}>
      {/* rears from the back of its neck, where it meets the base */}
      <g data-part="head" style={pivot("86% 100%")}>
        {/* a faceted horse's head facing left: flat poll, raked forehead, square muzzle, cut-in jaw */}
        <path d="M16.5 17l2-6-1-5L14 3H9L4 9v3l2 1 3.5-2L8 17" />
        <path d="M11 6h2v2h-2Z" fill={slot.accent} stroke="none" />
      </g>
      {/* the base the head stands on */}
      <path data-part="base" d="M5 17h14v4H5Z" style={pivot("50% 100%")} />
    </g>
  ),
})
