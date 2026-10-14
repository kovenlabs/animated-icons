"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "server-cog": "spin" | "ratchet" | "service"
  }
}

/**
 * The cog, centred on (17, 17): six teeth 60° apart, from the hub (radius 2.5) out to radius 4. The
 * teeth sit at 30° off the axes, so its box is 13.5..20.5 by 13..21.
 */
const TEETH =
  "M17 14.5V13M17 19.5V21M19.165 15.75l1.299-.75M14.835 18.25l-1.299.75M19.165 18.25l1.299.75M14.835 15.75l-1.299-.75"

/** 3 colors: rack units (primary), status lights (secondary), cog (accent). */
export const ServerCog = createAnimatedIcon({
  name: "server-cog",
  family: "server",
  category: "development",
  keywords: ["server settings", "configure", "maintenance", "infrastructure", "rack", "admin", "devops", "gear"],
  slots: { primary: "rack units", secondary: "status lights", accent: "cog" },
  defaultVariant: "spin",
  variants: {
    // the cog winds back and whips round a full turn, swelling forward as it goes, and the status
    // lights blink down the rack as it turns
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cog]",
            { rotate: [0, -30, 380, 360], scale: [1, 0.85, 1.2, 1] },
            { duration: seconds, times: [0, 0.2, 0.75, 1], ease: ["easeOut", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=light]",
            { opacity: [1, 0, 1] },
            { duration: seconds * 0.3, delay: stagger(seconds * 0.12, { startDelay: seconds * 0.25 }), ease: snap },
          ),
        ]),
    },
    // the cog clicks round in three sixth-turn steps, overshooting each notch, and the rack jolts on
    // every click. Six teeth make the half turn look like rest, so it snaps back unseen
    ratchet: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cog]",
            { rotate: [0, 60, 60, 120, 120, 180, 180, 0] },
            {
              duration: seconds,
              times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.999, 1],
              ease: [ease.overshoot, "linear", ease.overshoot, "linear", ease.overshoot, "linear", snap],
            },
          ),
          animate(
            "[data-part=units]",
            { y: [0, 0.8, 0, 0.8, 0, 0.8, 0] },
            { duration: seconds * 0.9, times: [0, 0.1, 0.25, 0.43, 0.58, 0.77, 0.92], ease: "easeOut" },
          ),
          animate(
            "[data-part=light]",
            { opacity: [1, 0.2, 1, 0.2, 1, 0.2, 1] },
            { duration: seconds * 0.9, times: [0, 0.1, 0.25, 0.43, 0.58, 0.77, 0.92], ease: "easeOut" },
          ),
        ]),
    },
    // the top unit slides out of the rack like a drawer, leaning with the pull, the cog spins it a
    // full service turn, and the unit slides home
    service: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=top]",
            { x: [0, 9, 9, 0], skewX: [0, -10, 0, 0], opacity: [1, 0.5, 0.5, 1] },
            { duration: seconds, times: [0, 0.25, 0.7, 1], ease: ["easeIn", "linear", "easeOut"] },
          ),
          animate(
            "[data-part=cog]",
            { rotate: [0, 0, 360, 360], scale: [1, 1, 1.15, 1] },
            { duration: seconds, times: [0, 0.2, 0.7, 0.85], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="units">
        <g data-part="top">
          <path d="M2 2h20v7H2Z" />
          <path d="M14 5.5h4" />
          <g fill={slot.secondary} stroke="none">
            <rect data-part="light" x="5" y="4.5" width="2" height="2" />
            <rect data-part="light" x="9" y="4.5" width="2" height="2" />
          </g>
        </g>
        {/* the bottom unit is cut short to make room for the cog */}
        <path d="M2 14h7v7H2Z" />
        <rect data-part="light" x="4.5" y="16.5" width="2" height="2" fill={slot.secondary} stroke="none" />
      </g>
      <g data-part="cog" stroke={slot.accent} style={pivot("50% 50%")}>
        {/* a cog is round: a true circle hub with straight teeth */}
        <circle cx="17" cy="17" r="2.5" />
        <path d={TEETH} />
      </g>
    </>
  ),
})
