"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    tractor: "chug" | "wheelie" | "drive"
  }
}

/** 2 colors: cab, hood and wheels (primary), exhaust and smoke (accent). */
export const Tractor = createAnimatedIcon({
  name: "tractor",
  category: "transport",
  keywords: ["farm", "agriculture", "farming", "harvest", "field", "machinery", "rural", "plow"],
  slots: { primary: "cab + hood + wheels", accent: "exhaust + smoke" },
  defaultVariant: "chug",
  variants: {
    // the engine turns over: the body heaves on its wheels, the stack hiccups and puffs of smoke rise
    chug: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=body]",
            { scaleY: [1, 1.08, 0.94, 1.06, 0.96, 1.03, 1], scaleX: [1, 0.97, 1.03, 0.98, 1.02, 1, 1] },
            { duration: seconds * 0.85, ease: "easeInOut" },
          ),
          animate(
            "[data-part=stack]",
            { scaleY: [1, 1.3, 1, 1.3, 1, 1.3, 1] },
            { duration: seconds * 0.85, ease: "easeInOut" },
          ),
          animate(
            "[data-part=puff]",
            { y: [2, -1, -3], x: [0, 0.5, 1.5], opacity: [0, 1, 0], scale: [0.5, 1, 1.5] },
            { duration: seconds * 0.5, delay: stagger(seconds * 0.22), ease: "easeOut" },
          ),
        ]),
    },
    // revs and pops a wheelie on the big back wheel, hangs there, and drops its nose with a bounce
    wheelie: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tractor]",
            { rotate: [0, 2, -20, -17, -20, 0, -4, 0] },
            { duration: seconds, times: [0, 0.1, 0.3, 0.45, 0.6, 0.8, 0.9, 1], ease: ["easeInOut", ease.out, "easeInOut", "easeInOut", ease.in, "easeOut", "easeIn"] },
          ),
          animate(
            "[data-part=puff]",
            { y: [2, -1, -3], x: [0, -0.5, -1.5], opacity: [0, 1, 0], scale: [0.5, 1, 1.5] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.1, { startDelay: seconds * 0.05 }), ease: "easeOut" },
          ),
        ]),
    },
    // trundles off to the right over rough ground, then rolls back in from the left
    drive: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tractor]",
            { x: [0, 10, -10, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: [ease.in, "linear", ease.out] },
          ),
          animate(
            "[data-part=body]",
            { y: [0, -1, 0, -1, 0, -1, 0, -0.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // tips back about where the big wheel meets the ground
    <g data-part="tractor" style={pivot("26.3% 100%")}>
      <g fill={slot.accent} stroke="none">
        <rect data-part="puff" x="17" y="3" width="2" height="2" style={flash()} />
        <rect data-part="puff" x="17" y="3" width="2" height="2" style={flash()} />
        <rect data-part="puff" x="17" y="3" width="2" height="2" style={flash()} />
      </g>
      <g data-part="body" style={pivot("50% 100%")}>
        {/* an open cab with a raked windscreen, standing on the hood */}
        <path d="M4 12V4h7.5l1.5 7" />
        <path d="M12 16h9v-5h-8" />
        <path data-part="stack" d="M18 11V7" stroke={slot.accent} style={pivot("50% 100%")} />
      </g>
      {/* a big drive wheel at the back, a small steering wheel at the front */}
      <circle cx="7" cy="16" r="5" />
      <rect x="6" y="15" width="2" height="2" fill={slot.primary} stroke="none" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </g>
  ),
})
