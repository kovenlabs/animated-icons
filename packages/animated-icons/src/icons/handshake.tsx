"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    handshake: "shake" | "meet" | "turn"
  }
}

/** 2 colors: left hand (primary), right hand (accent). */
export const Handshake = createAnimatedIcon({
  name: "handshake",
  category: "social",
  keywords: ["deal", "agreement", "partnership", "contract", "greeting", "welcome", "trust", "collaboration"],
  slots: { primary: "left hand", accent: "right hand" },
  defaultVariant: "shake",
  variants: {
    // three firm pumps: the clasp swings up and down about its middle, foreshortening as it tips toward
    // you and away
    shake: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=handshake]",
          {
            y: [0, -2.5, 2, -2, 1.5, -0.8, 0],
            rotate: [0, -5, 4, -4, 3, -1, 0],
            scaleY: [1, 0.88, 1.06, 0.9, 1.04, 0.97, 1],
          },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the hands let go and draw back to either side, then come in and clasp with a squeeze
    meet: {
      duration: 1000,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=left]",
            { x: [0, -3, -3, 0] },
            { duration: seconds * 0.7, times: [0, 0.35, 0.5, 1], ease: ["easeOut", "linear", "easeIn"] },
          ),
          animate(
            "[data-part=right]",
            { x: [0, 3, 3, 0] },
            { duration: seconds * 0.7, times: [0, 0.35, 0.5, 1], ease: ["easeOut", "linear", "easeIn"] },
          ),
          animate(
            "[data-part=handshake]",
            { scaleX: [1, 1, 0.9, 1.03, 1], scaleY: [1, 1, 1.06, 0.98, 1] },
            { duration: seconds, times: [0, 0.7, 0.8, 0.9, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the clasp swivels most of a quarter turn to show its side, holds, and swings back past face-on
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=handshake]",
          { scaleX: [1, 0.55, 0.55, 1.06, 1], skewY: [0, -14, -14, 4, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="handshake" style={pivot("50% 50%")}>
      {/* the left forearm comes down from the top; its fingers wrap the clasp from below, knuckle by knuckle */}
      <g data-part="left">
        <path d="M3 3v10l6.5 6.5 2.5-2.5" />
        <path d="M10.5 15.5l3 3 2.5-2.5" />
        <path d="M3 4h8" />
      </g>
      {/* the right hand reaches across the top, thumb hooked over, fingers curling down to its cuff */}
      <g data-part="right" stroke={slot.accent}>
        <path d="M21 3v10h-2" />
        <path d="M21 4H11L8 7l3 3 1-1h4l3 3v1l-2.5 2.5-3-3" />
      </g>
    </g>
  ),
})
