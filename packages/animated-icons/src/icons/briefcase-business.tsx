"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    "briefcase-business": "open" | "lift" | "spin"
  }
}

const TURN = spin(1, "inOut")

/** 2 colors: case, lid and handle (primary), clasp and side (accent). */
export const BriefcaseBusiness = createAnimatedIcon({
  name: "briefcase-business",
  family: "briefcase",
  category: "commerce",
  keywords: ["business", "work", "office", "job", "portfolio", "corporate", "career", "attache"],
  slots: { primary: "case + lid + handle", accent: "clasp + side" },
  defaultVariant: "open",
  variants: {
    // the clasp pops and lets go, the lid swings up and back until it is nearly edge-on (the open
    // case gapes below it), then slams shut, the case squashes under it and the clasp snaps back
    open: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=clasp]",
            { scale: [1, 1.35, 0, 0, 1.25, 1] },
            { duration: seconds, times: [0, 0.1, 0.2, 0.72, 0.84, 1], ease: ["easeOut", ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=lid]",
            { scaleY: [1, 1, 0.12, 0.12, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.55, 0.66, 1], ease: ["linear", ease.out, "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=case]",
            { scaleY: [1, 1, 0.88, 1.02, 1], scaleX: [1, 1, 1.01, 0.99, 1] },
            { duration: seconds, times: [0, 0.66, 0.74, 0.86, 1], ease: "easeOut" },
          ),
        ]),
    },
    // picked up: the handle is yanked up and stretches, the case follows it off the ground, then is
    // set down with a squash as the handle springs back
    lift: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handle]",
            { scaleY: [1, 1.55, 1.1, 1, 0.75, 1] },
            { duration: seconds, times: [0, 0.18, 0.36, 0.55, 0.7, 1], ease: ["easeOut", "easeInOut", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=case]",
            { y: [0, 0, -1.2, -1.2, 0, 0, 0] },
            { duration: seconds, times: [0, 0.14, 0.32, 0.45, 0.58, 0.75, 1], ease: ["linear", "easeOut", "linear", ease.in, "linear", "linear"] },
          ),
          animate(
            "[data-part=case]",
            { scaleY: [1, 1, 1.03, 1.03, 1, 0.86, 1.03, 1], scaleX: [1, 1, 0.98, 0.98, 1, 1.01, 0.99, 1] },
            {
              duration: seconds,
              times: [0, 0.14, 0.32, 0.45, 0.58, 0.68, 0.84, 1],
              ease: ["linear", "easeOut", "linear", ease.in, "easeOut", "easeInOut", "easeInOut"],
            },
          ),
        ]),
    },
    // turned once on its vertical axis, like on a turntable: side-on the face is gone and it shows
    // its depth, a narrow slab under the handle; the clasp clicks as it comes round to face you
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=turn]", { scaleX: TURN.scaleX }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate("[data-part=side]", { opacity: TURN.edge }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate(
            "[data-part=turn]",
            { opacity: TURN.edge.map((edge) => 1 - edge) },
            { duration: seconds, times: TURN.times, ease: TURN.ease },
          ),
          animate(
            "[data-part=clasp]",
            { scale: [1, 1, 1.3, 1] },
            { duration: seconds, times: [0, 0.8, 0.9, 1], ease: ["linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="case" style={pivot("50% 100%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        <path data-part="handle" d="M8 7V4h8v3" style={pivot("50% 100%")} />
        {/* the lid, its bottom edge the business seam that dips to the clasp; it hinges at its top */}
        <path data-part="lid" d="M2 12V7h20v5l-6 2H8z" style={pivot("50% 0%")} />
        {/* the case below the seam, open at the top: it shows when the lid swings up */}
        <path d="M2 12v8h20v-8" />
        {/* a solid accent over the seam's dip: a stroked 4px square would leave a 0px hole */}
        <path data-part="clasp" d="M10 12h4v4h-4z" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
      {/* the case side-on, seen only mid-turn: its depth, with the handle edge-on above it */}
      <path data-part="side" d="M10 7h4v13h-4zM12 7V4" stroke={slot.accent} style={flash()} />
    </g>
  ),
})
