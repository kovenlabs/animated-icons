"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cat: "turn" | "twitch" | "pounce"
  }
}

/**
 * A faceted head with pointed ears. Each ear is open at its base, closed by the head's outline, and
 * hinges on its outer corner: it only ever tips outwards, so its inner corner never sinks into the head.
 */
const HEAD = "M4 11v5l4 5h8l4-5v-5l-3-3H7z"

/** 2 colors: head and ears (primary), eyes and nose (accent). */
export const Cat = createAnimatedIcon({
  name: "cat",
  category: "nature",
  keywords: ["kitten", "kitty", "pet", "animal", "feline", "meow", "cat face"],
  slots: { primary: "head + ears", accent: "eyes + nose" },
  defaultVariant: "turn",
  variants: {
    // the head turns to look left, then right: the face slides further than the skull, the ears drift
    // the other way and the far ear goes edge-on, then it faces you again and blinks
    turn: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const look = { duration: seconds, times: [0, 0.18, 0.4, 0.58, 0.78, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=face]", { x: [0, -2, -2, 2, 2, 0] }, look),
          animate("[data-part=head]", { scaleX: [1, 0.94, 0.94, 0.94, 0.94, 1] }, look),
          animate("[data-part=ears]", { x: [0, 0.5, 0.5, -0.5, -0.5, 0] }, look),
          animate("[data-part=ear-left]", { scaleX: [1, 0.7, 0.7, 1, 1, 1] }, look),
          animate("[data-part=ear-right]", { scaleX: [1, 1, 1, 0.7, 0.7, 1] }, look),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 1, 0.15, 1] },
            { duration: seconds, times: [0, 0.84, 0.9, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
    // one ear flicks, then the other, then the first again twice, with a slow blink in between
    twitch: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ear-left]",
            { rotate: [0, -16, 0, 0, -12, 0, -12, 0] },
            { duration: seconds, times: [0, 0.08, 0.2, 0.55, 0.63, 0.72, 0.8, 0.92], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ear-right]",
            { rotate: [0, 0, 16, 0, 0] },
            { duration: seconds, times: [0, 0.22, 0.3, 0.42, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 1, 0.15, 0.15, 1, 1] },
            { duration: seconds, times: [0, 0.38, 0.44, 0.5, 0.58, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // it crouches with its ears flattened, then lunges at you (it grows towards the viewer), the ears
    // springing up late and flicking as it settles back
    pounce: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const times = [0, 0.3, 0.5, 0.72, 1]
        return Promise.all([
          animate(
            "[data-part=cat]",
            { scaleX: [1, 1.08, 1.18, 0.97, 1], scaleY: [1, 0.86, 1.18, 0.98, 1], y: [0, 1, 0.5, 0, 0] },
            { duration: seconds, times, ease: ["easeInOut", ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=ear-left]",
            { rotate: [0, -14, -14, 0, -8, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.72, 0.84, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ear-right]",
            { rotate: [0, 14, 14, 0, 8, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.72, 0.84, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="cat" style={pivot("50% 60%")}>
      <path data-part="head" d={HEAD} style={pivot("50% 50%")} />
      <g data-part="ears">
        <path data-part="ear-left" d="M5 10V3l5 5" style={pivot("0% 100%")} />
        <path data-part="ear-right" d="M19 10V3l-5 5" style={pivot("100% 100%")} />
      </g>
      <g data-part="face" fill={slot.accent} stroke="none">
        <rect data-part="eye" x="8" y="12" width="2" height="2" style={pivot("50% 50%")} />
        <rect data-part="eye" x="14" y="12" width="2" height="2" style={pivot("50% 50%")} />
        <path d="M10.5 16h3L12 18z" />
      </g>
    </g>
  ),
})
