"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cooking-pot": "rattle" | "pop" | "hop"
  }
}

const puff = { ...blink, y: [0, -0.5] }

/** 2 colors: pot (primary), lid and steam (accent). */
export const CookingPot = createAnimatedIcon({
  name: "cooking-pot",
  category: "food",
  keywords: ["pot", "cook", "kitchen", "boil", "stew", "saucepan", "simmer", "food"],
  slots: { primary: "pot", accent: "lid + steam" },
  defaultVariant: "rattle",
  variants: {
    // on the boil: the lid chatters and rocks on the rim, the pot rumbles and steam puffs out either side
    rattle: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lid]",
            { y: [0, -1.5, 0, -1.2, 0, -1.5, 0], rotate: [0, -5, 0, 5, 0, -4, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=pot]", { x: [0, -0.6, 0.6, -0.6, 0.6, -0.4, 0] }, { duration: seconds, ease: "linear" }),
          animate("[data-part=steam]", puff, {
            duration: seconds * 0.55,
            delay: stagger(seconds * 0.3, { startDelay: seconds * 0.1 }),
            ease: "easeOut",
          }),
        ]),
    },
    // pressure builds: the belly bulges, the lid shoots up spinning like a coin, drops back with a clang
    // that squashes the pot, and the trapped steam escapes
    pop: {
      duration: 1300,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=belly]",
            { scaleX: [1, 1.06, 1.12, 0.95, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.22, 0.32, 0.45, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=lid]",
            { y: [0, -0.8, 0, -6, -6, 0, -1, 0] },
            {
              duration: seconds,
              times: [0, 0.1, 0.2, 0.38, 0.5, 0.7, 0.8, 0.9],
              ease: ["easeInOut", "easeInOut", ease.out, "easeInOut", ease.in, "easeOut", "easeIn"],
            },
          ),
          animate(
            "[data-part=lid]",
            { scaleX: [1, 1, -1, 1, 1] },
            { duration: seconds, times: [0, 0.22, 0.46, 0.68, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=pot]",
            { scaleY: [1, 1, 0.9, 1.02, 1], scaleX: [1, 1, 1.05, 0.99, 1] },
            { duration: seconds, times: [0, 0.7, 0.77, 0.86, 1], ease: "easeInOut" },
          ),
          animate("[data-part=steam]", puff, { duration: seconds * 0.3, delay: seconds * 0.7, ease: "easeOut" }),
        ]),
    },
    // boiling so hard the whole pot jumps: it crouches, leaps, the lid floats off and lands a beat late
    hop: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pot]",
            { y: [0, 0, -2.5, 0, 0, 0], scaleY: [1, 0.88, 1.05, 0.9, 1.02, 1], scaleX: [1, 1.05, 0.97, 1.05, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.18, 0.42, 0.64, 0.8, 1],
              ease: [ease.out, ease.out, ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=lid]",
            { y: [0, 0, -1.5, -1.5, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.66, 0.8, 1], ease: ["linear", "easeOut", "linear", ease.in, "linear"] },
          ),
          animate("[data-part=steam]", puff, { duration: seconds * 0.3, delay: seconds * 0.66, ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="steam" d="M6 6.5 4.5 5 6 3.5 4.5 2" style={flash("50% 100%")} />
        <path data-part="steam" d="M18 6.5 19.5 5 18 3.5 19.5 2" style={flash("50% 100%")} />
      </g>
      <g data-part="pot" style={pivot("50% 100%")}>
        {/* the rim overhangs the belly as handles; the belly is chamfered at its base */}
        <path d="M3 15h18" />
        <path data-part="belly" d="M4 15v5l2 2h12l2-2v-5" style={pivot("50% 50%")} />
        {/* a flat lid with a square knob, resting 4px above the rim */}
        <g data-part="lid" stroke={slot.accent} style={pivot("50% 100%")}>
          <path d="M4 11h16" />
          <path d="M10 11V9h4v2" />
        </g>
      </g>
    </>
  ),
})
