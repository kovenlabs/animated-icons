"use client"

import { steps } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    timer: "start" | "toss" | "countdown"
  }
}

/** 2 colors: case (primary), button + hand (accent). */
export const Timer = createAnimatedIcon({
  name: "timer",
  category: "time",
  keywords: ["stopwatch", "countdown", "time", "duration", "stop watch", "lap", "speed", "deadline"],
  slots: { primary: "case", accent: "button + hand" },
  defaultVariant: "start",
  variants: {
    // the button is pressed home and the whole watch squashes under the thumb; on release the hand
    // whips one full lap round the dial and overshoots its mark
    start: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=button]",
            { y: [0, 1.5, -0.5, 0] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.7, 1], ease: ["easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=timer]",
            { scaleY: [1, 0.9, 1.04, 1], scaleX: [1, 1.06, 0.98, 1] },
            { duration: seconds * 0.45, times: [0, 0.27, 0.65, 1], ease: ["easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=hand]",
            { rotate: [0, 385, 360] },
            { duration: seconds * 0.8, delay: seconds * 0.15, times: [0, 0.8, 1], ease: [ease.inOut, "easeInOut"] },
          ),
        ]),
    },
    // tossed like a coin: it flies up, somersaults end over end (showing its blank back as it goes),
    // and lands with a squash
    toss: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=timer]",
            { y: [0, -4, 0, 0], scaleY: [1, 1, 0.9, 1] },
            { duration: seconds, times: [0, 0.4, 0.8, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=face]",
            { scaleY: [1, 0, -1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "linear"] },
          ),
          animate(
            "[data-part=hand]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.201, 0.6, 0.601, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
        ]),
    },
    // the hand winds back round the dial a tick at a time, and at zero the watch goes off with a jolt
    countdown: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=hand]", { rotate: [0, -360] }, { duration: seconds * 0.7, ease: steps(12) }),
          animate(
            "[data-part=face]",
            { scale: [1, 1, 1.18, 0.96, 1], rotate: [0, 0, -8, 6, 0] },
            { duration: seconds, times: [0, 0.7, 0.8, 0.9, 1], ease: ["linear", "easeOut", "easeInOut", "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="timer" style={pivot("50% 100%")}>
      <g data-part="face" style={pivot("50% 50%")}>
        {/* the start button floats over the crown, 2 clear of the case */}
        <path data-part="button" d="M10 2h4" stroke={slot.accent} />
        {/* a stopwatch case is round, so it gets a true circle */}
        <circle cx="12" cy="14" r="8" />
        {/* the hand turns on its foot, the centre of the dial */}
        <path data-part="hand" d="M12 14l3-3" stroke={slot.accent} style={pivot("0% 100%")} />
      </g>
    </g>
  ),
})
