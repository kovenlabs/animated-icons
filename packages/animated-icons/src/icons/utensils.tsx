"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    utensils: "twirl" | "drop" | "bow"
  }
}

/** 2 colors: fork (primary), knife (accent). */
export const Utensils = createAnimatedIcon({
  name: "utensils",
  category: "food",
  keywords: ["fork", "knife", "cutlery", "restaurant", "dining", "eat", "meal", "food"],
  slots: { primary: "fork", accent: "knife" },
  defaultVariant: "twirl",
  variants: {
    // each piece spins a full turn on its own axis like a twirled baton, dipping away mid-turn; the
    // knife follows the fork
    twirl: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const turn = { scaleX: [1, -1, 1], scale: [1, 0.88, 1], skewY: [0, 8, 0] }
        const options = { duration: seconds * 0.7, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=fork-turn]", turn, options),
          animate("[data-part=knife-turn]", turn, { ...options, delay: seconds * 0.3 }),
        ])
      },
    },
    // flipped up out of the frame and dropped back onto the table, landing with a squash, one after the other
    drop: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) => {
        const toss = { y: [0, 0, -24, -24, 0, 0, 0], scaleY: [1, 0.86, 1.08, 1, 1, 0.86, 1] }
        const options = {
          duration: seconds * 0.88,
          times: [0, 0.12, 0.36, 0.48, 0.7, 0.8, 1],
          ease: ["easeOut", ease.in, "linear", ease.in, "easeOut", ease.overshoot] satisfies Easing[],
        }
        return Promise.all([
          animate("[data-part=fork]", toss, options),
          animate("[data-part=knife]", toss, { ...options, delay: seconds * 0.12 }),
        ])
      },
    },
    // they tip forward towards you in a bow, foreshortening flat and wide, and spring back upright
    bow: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const bow = { scaleY: [1, 0.35, 0.35, 1, 0.92, 1], scaleX: [1, 1.1, 1.1, 1, 1, 1] }
        const options = { duration: seconds * 0.85, times: [0, 0.25, 0.4, 0.65, 0.82, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=fork]", bow, options),
          animate("[data-part=knife]", bow, { ...options, delay: seconds * 0.15 }),
        ])
      },
    },
  },
  render: () => (
    <>
      <g data-part="fork" style={pivot("50% 100%")}>
        <g data-part="fork-turn" style={pivot("50% 50%")}>
          {/* three tines: a chamfered cup with the handle running up its middle */}
          <path d="M3 2v6l2 3h4l2-3V2" />
          <path d="M7 2v20" />
        </g>
      </g>
      <g data-part="knife" stroke={slot.accent} style={pivot("50% 100%")}>
        <g data-part="knife-turn" style={pivot("50% 50%")}>
          {/* a blade with a straight spine and a raked tip, on a handle under its middle */}
          <path d="M19 2v13h-4V6Z" />
          <path d="M17 15v7" />
        </g>
      </g>
    </>
  ),
})
