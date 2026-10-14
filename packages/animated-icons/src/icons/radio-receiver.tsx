"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "radio-receiver": "play" | "tune" | "turn"
  }
}

/** Speaker grille: two slots 4 apart, 2 clear of each other and of the body's inner edge. */
const GRILLE = [11, 15] as const

/** 2 colors: body, grille + feet (primary), antenna + tuning knob (accent). */
export const RadioReceiver = createAnimatedIcon({
  name: "radio-receiver",
  family: "radio",
  category: "media",
  keywords: ["radio", "receiver", "transistor", "fm", "am", "tuner", "broadcast", "vintage"],
  slots: { primary: "body + grille + feet", accent: "antenna + knob" },
  defaultVariant: "play",
  variants: {
    // it plays loud: the box thumps on its feet, the grille slots pump like a level meter and the
    // antenna whips behind the beat
    play: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.15, 0.4, 0.55, 0.8, 1], ease: "easeOut" as const }
        return Promise.all([
          animate("[data-part=radio]", { scaleY: [1, 0.9, 1.04, 0.92, 1.02, 1], scaleX: [1, 1.02, 0.99, 1.02, 1, 1] }, timing),
          animate("[data-part=grille]", { scaleX: [1, 0.35, 1, 0.5, 1] }, {
            duration: seconds * 0.8,
            delay: stagger(seconds * 0.08),
            ease: "easeInOut",
          }),
          animate("[data-part=knob]", { scale: [1, 1.35, 0.9, 1.3, 0.95, 1] }, timing),
          animate("[data-part=antenna]", { rotate: [0, 8, -11, 6, -5, 0] }, { ...timing, delay: seconds * 0.06, ease: "easeInOut" }),
        ])
      },
    },
    // hunting for a station: the knob twists back and forth (squeezed edge-on as it turns), the antenna
    // sweeps and the grille flickers with static until it locks on with a pop
    tune: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=knob]",
            { scaleX: [1, 0.3, 1, 0.3, 1, 1.35, 1], scaleY: [1, 1, 1, 1, 1, 1.35, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=antenna]",
            { rotate: [0, -12, 8, -9, 0, 0] },
            { duration: seconds, times: [0, 0.18, 0.38, 0.55, 0.72, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=grille]",
            { opacity: [1, 0.2, 1, 0.3, 0.9, 0.2, 1, 1] },
            { duration: seconds, times: [0, 0.1, 0.2, 0.32, 0.42, 0.55, 0.72, 1], ease: "linear" },
          ),
        ]),
    },
    // turned to show its side in 3D: it narrows and leans, the antenna swinging round the other way
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=radio]",
            { scaleX: [1, 0.35, 1, 0.35, 1], skewY: [0, -10, 0, 10, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=antenna]",
            { rotate: [0, 7, -10, 7, -6, 0] },
            { duration: seconds, times: [0, 0.25, 0.45, 0.75, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="radio" style={pivot("50% 100%")}>
      {/* a telescopic antenna raked back from the top, swinging from its foot */}
      <path data-part="antenna" d="M8 7l5-4" stroke={slot.accent} style={pivot("0% 100%")} />
      <path d="M2 7h20v12H2Z" />
      <path d="M5 19v2M19 19v2" />
      {GRILLE.map((y) => (
        <path key={y} data-part="grille" d={`M5 ${y}h7`} style={pivot("0% 50%")} />
      ))}
      {/* the tuning knob is round, so it is a true circle */}
      <circle data-part="knob" cx="17" cy="13" r="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </g>
  ),
})
