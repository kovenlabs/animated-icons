"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    syringe: "inject" | "jab" | "flick"
  }
}

/** 2 colors: barrel, needle and plunger (primary), dose and drop (accent). The drop only exists in motion. */
export const Syringe = createAnimatedIcon({
  name: "syringe",
  category: "health",
  keywords: ["injection", "vaccine", "needle", "shot", "dose", "immunization", "medicine", "health"],
  slots: { primary: "barrel + plunger", accent: "dose + drop" },
  defaultVariant: "inject",
  variants: {
    // the plunger is driven home and the dose drains, the needle nudging forward as a drop squirts off
    // its tip, then the plunger draws back and the barrel refills
    inject: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.4, 0.6, 1], ease: [ease.in, "linear", ease.overshoot] as Easing[] }
        return Promise.all([
          animate("[data-part=plunger]", { x: [0, -3, -3, 0] }, timing),
          animate("[data-part=dose]", { scaleX: [1, 0.25, 0.25, 1] }, timing),
          animate(
            "[data-part=syringe]",
            { x: [0, -1.2, 0.5, 0] },
            { duration: seconds * 0.75, times: [0, 0.5, 0.75, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=drop]",
            { x: [0, -4], opacity: [0, 1, 0], scale: [0.6, 1.3, 0.5] },
            { duration: seconds * 0.35, delay: seconds * 0.3, ease: "easeOut" },
          ),
        ])
      },
    },
    // drawn back, then thrust along its needle with a stretch, and recoiling with a wobble
    jab: {
      clip: true,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=syringe]",
            { x: [0, 2, -2.5, 0.6, 0], scaleX: [1, 0.94, 1.1, 0.98, 1] },
            { duration: seconds, times: [0, 0.35, 0.5, 0.7, 1], ease: ["easeInOut", ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=drop]",
            { x: [0, -3], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.5] },
            { duration: seconds * 0.3, delay: seconds * 0.45, ease: "easeOut" },
          ),
        ]),
    },
    // tipped and flicked twice to clear the air, a bead of the dose welling at the needle
    flick: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=syringe]",
            { rotate: [0, 16, -7, 11, -3, 0] },
            { duration: seconds, times: [0, 0.25, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=drop]",
            { x: [0, -1.5], opacity: [0, 1, 0], scale: [0.4, 1.2, 0.6] },
            { duration: seconds * 0.4, delay: seconds * 0.55, ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    // drawn level, needle to the left, and tipped 45° so the needle points down-left
    <g transform="rotate(-45 12 12)">
      <g data-part="syringe" style={pivot("50% 50%")}>
        <rect data-part="drop" x="-1" y="11" width="2" height="2" fill={slot.accent} stroke="none" style={flash()} />
        {/* the dose fills the barrel up to the plunger head and drains toward the needle */}
        <rect data-part="dose" x="6" y="10" width="4" height="4" fill={slot.accent} stroke="none" style={pivot("0% 50%")} />
        {/* needle, barrel and finger flange */}
        <path d="M1 12h4M5 9h10v6H5zM15 7v10" />
        <g data-part="plunger">
          <rect x="10" y="10" width="2" height="4" fill={slot.primary} stroke="none" />
          <path d="M12 12h8M20 9v6" />
        </g>
      </g>
    </g>
  ),
})
