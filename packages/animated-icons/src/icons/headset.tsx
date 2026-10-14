"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    headset: "talk" | "turn" | "beat"
  }
}

/** 2 colors: headband + ear cups (primary), mic boom (accent). */
export const Headset = createAnimatedIcon({
  name: "headset",
  category: "communication",
  keywords: ["support", "call center", "customer service", "microphone", "gaming", "help desk", "voice chat"],
  slots: { primary: "headband + ear cups", accent: "mic boom" },
  defaultVariant: "talk",
  variants: {
    // the mic swings up to the mouth and pulses with each word, then drops back into place
    talk: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
        return Promise.all([
          animate("[data-part=boom]", { rotate: [0, 16, 9, 15, 8, 0] }, { ...timing, ease: ["easeOut", "easeInOut", "easeInOut", "easeInOut", ease.overshoot] }),
          animate("[data-part=mic]", { scale: [1, 1, 1.5, 1, 1.4, 1] }, { ...timing, ease: "easeInOut" }),
        ])
      },
    },
    // the wearer turns their head side to side: the set narrows and leans in 3D, the boom trailing
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=headset]",
            { scaleX: [1, 0.55, 1, 0.55, 1], skewY: [0, 9, 0, -9, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=boom]",
            { rotate: [0, 0, 10, 0, 6, 0] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.65, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the cups thump twice to the music, the band flexing up between hits and the mic bouncing along
    beat: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.15, 0.4, 0.55, 0.8, 1], ease: ease.out }
        return Promise.all([
          animate("[data-part=cup]", { scale: [1, 1.22, 0.95, 1.18, 0.98, 1] }, timing),
          animate("[data-part=band]", { scaleY: [1, 0.92, 1.08, 0.94, 1.04, 1] }, timing),
          animate("[data-part=boom]", { rotate: [0, 8, -2, 7, -1, 0] }, { ...timing, delay: seconds * 0.05 }),
        ])
      },
    },
  },
  render: () => (
    <g data-part="headset" style={pivot("50% 50%")}>
      {/* the faceted band of headphones, ending on top of the cups */}
      <path data-part="band" d="M3 13v-2l2-5 4-3h6l4 3 2 5v2" style={pivot("50% 100%")} />
      <path data-part="cup" d="M3 13h4v5H3Z" style={pivot("50% 50%")} />
      <path data-part="cup" d="M17 13h4v5h-4Z" style={pivot("50% 50%")} />
      {/* the boom hangs off the right cup and swings from there */}
      <g data-part="boom" stroke={slot.accent} style={pivot("100% 0%")}>
        <path d="M19 18l-2 3h-3" />
        <rect data-part="mic" x="11" y="20" width="3" height="2" fill={slot.accent} stroke="none" style={pivot("100% 50%")} />
      </g>
    </g>
  ),
})
