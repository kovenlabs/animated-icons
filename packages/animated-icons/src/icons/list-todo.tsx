"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "list-todo": "check" | "tick" | "cascade"
  }
}

/** Item lines 6 apart, 2 clear of the markers on their left. */
const LINES = [
  { part: "line-0", d: "M13 6h8" },
  { part: "line-1", d: "M13 12h8" },
  { part: "line-2", d: "M13 18h8" },
] as const

/** 2 colors: lines and the open box (primary), the done tick (accent). */
export const ListTodo = createAnimatedIcon({
  name: "list-todo",
  family: "list",
  category: "layout",
  keywords: ["todo", "checklist", "tasks", "to-do list", "done", "checkbox", "agenda", "planner"],
  slots: { primary: "lines + open box", accent: "done tick + fill" },
  defaultVariant: "check",
  variants: {
    // the open box flips over in 3D and lands filled, its item dims as done, then it all resets
    check: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=box]",
            { scaleX: [1, -1, -1, 1], scale: [1, 1.15, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.75, 1], ease: ["easeInOut", "linear", "easeInOut"] },
          ),
          animate(
            "[data-part=fill]",
            { opacity: [0, 0, 1, 1, 0], scale: [0.4, 0.4, 1.1, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.35, 0.75, 0.9], ease: ["linear", ease.overshoot, "linear", "easeIn"] },
          ),
          animate(
            "[data-part=line-0]",
            { opacity: [1, 1, 0.35, 0.35, 1], scaleX: [1, 1, 0.75, 0.75, 1] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the tick is wiped and redrawn, then pops big and its line stretches out in sympathy
    tick: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          // hidden until it has length: a square cap paints a dot at pathLength 0
          animate(
            "[data-part=tick]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.2, 0.21, 1] },
          ),
          animate(
            "[data-part=tick]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.19, 0.2, 0.55, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=tick]",
            { scale: [1, 1, 1.25, 0.92, 1], rotate: [0, 0, -10, 4, 0] },
            { duration: seconds, times: [0, 0.55, 0.7, 0.85, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=line-2]",
            { scaleX: [1, 1, 1.06, 0.94, 1] },
            { duration: seconds, times: [0, 0.6, 0.72, 0.86, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a wave runs down the list: each marker pops and its line snaps back and shoots out again
    cascade: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=marker]",
            { scale: [1, 0.7, 1.2, 1] },
            { duration: seconds * 0.55, ease: "easeInOut", delay: stagger(seconds * 0.3) },
          ),
          animate(
            "[data-part^=line]",
            { scaleX: [1, 0.3, 1.05, 1] },
            { duration: seconds * 0.55, ease: "easeInOut", delay: stagger(seconds * 0.15) },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="marker" style={pivot("50% 50%")}>
        <path data-part="box" d="M3 3h6v6H3z" style={pivot("50% 50%")} />
        {/* the box's inside, filled solid only while it is checked */}
        <rect data-part="fill" x="4" y="4" width="4" height="4" fill={slot.accent} stroke="none" style={flash()} />
      </g>
      <g data-part="marker" style={pivot("50% 50%")}>
        <path data-part="tick" d="M3 18l2 2 4-4" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
      {LINES.map(({ part, d }) => (
        <path key={part} data-part={part} d={d} style={pivot("0% 50%")} />
      ))}
    </>
  ),
})
