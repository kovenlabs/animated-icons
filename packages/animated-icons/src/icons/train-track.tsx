"use client"

import { stagger, type AnimationOptions } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "train-track": "run" | "curve" | "lay"
  }
}

/**
 * The rails run in perspective from (3, 22) and (21, 22) up to (9, 2) and (15, 2): half the track's width
 * at height y. A sleeper drawn at y, moved down by d and stretched by halfWidth(y + d) / halfWidth(y),
 * still ends exactly on both rails, at every frame of a shared tween.
 */
const halfWidth = (y: number) => 3 + (y - 2) * 0.3

/**
 * Sleeper heights, spaced wider towards you. The four drawn sleepers sit at STOPS[2..5]; the two before
 * are where the incoming sleepers start, the two after are where the nearest ones leave the frame.
 */
const STOPS = [0, 2, 5, 9, 14, 20, 27, 35] as const
const TIES = [2, 3, 4, 5] as const
/** Incoming sleepers, drawn hidden over the first two and fed in from two stops further up. */
const LEADS = [2, 3] as const

const sleeper = (y: number) => `M${+(12 - halfWidth(y)).toFixed(2)} ${y}H${+(12 + halfWidth(y)).toFixed(2)}`

/** Two stops towards you along the rails, then a snap back unseen: every sleeper ends where the next-but-one began. */
function advance(from: number) {
  const y = STOPS[from]!
  const path = [from, from + 1, from + 2].map((stop) => STOPS[stop]!)
  return {
    y: [...path.map((to) => to - y), 0],
    scaleX: [...path.map((to) => halfWidth(to) / halfWidth(y)), 1],
  }
}

/** 2 colors: rails (primary), sleepers (accent). */
export const TrainTrack = createAnimatedIcon({
  name: "train-track",
  family: "train",
  category: "transport",
  keywords: ["railway", "rails", "railroad", "tracks", "sleepers", "line", "route"],
  slots: { primary: "rails", accent: "sleepers" },
  defaultVariant: "run",
  variants: {
    // the sleepers stream towards you along the rails, two at a time, and the next pair slides in at the horizon
    run: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) => {
        const timing: AnimationOptions = {
          duration: seconds,
          times: [0, 0.5, 0.999, 1],
          ease: ["linear", "linear", snap],
        }
        return Promise.all([
          ...TIES.map((stop) => animate(`[data-part=tie-${stop}]`, advance(stop), timing)),
          ...LEADS.map((stop) =>
            animate(`[data-part=lead-${stop}]`, { ...advance(stop - 2), opacity: [0, 1, 1, 0] }, timing),
          ),
        ])
      },
    },
    // the line snakes: the far end swings left and right as if the track bends ahead
    curve: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate("[data-part=track]", { skewX: [0, 14, -10, 5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the rails draw on from your feet to the horizon, the sleepers widening into place behind them
    lay: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=rail]", { opacity: [0, 1, 1] }, { duration: seconds * 0.6, times: [0, 0.05, 1] }),
          animate("[data-part=rail]", { pathLength: [0, 1] }, { duration: seconds * 0.6, ease: "easeOut" }),
          animate(
            "[data-part=tie]",
            { scaleX: [0, 1], opacity: [0, 1] },
            {
              duration: seconds * 0.35,
              delay: stagger(seconds * 0.15, { from: "last", startDelay: seconds * 0.1 }),
              ease: ease.out,
            },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="track" style={pivot("50% 100%")}>
      <path data-part="rail" d="M3 22 9 2" />
      <path data-part="rail" d="M21 22 15 2" />
      <g stroke={slot.accent}>
        {TIES.map((stop) => (
          <g key={stop} data-part="tie" style={pivot("50% 50%")}>
            <path data-part={`tie-${stop}`} d={sleeper(STOPS[stop]!)} style={pivot("50% 50%")} />
          </g>
        ))}
        {LEADS.map((stop) => (
          <path key={stop} data-part={`lead-${stop}`} d={sleeper(STOPS[stop]!)} style={flash()} />
        ))}
      </g>
    </g>
  ),
})
