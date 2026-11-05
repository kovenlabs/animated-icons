"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "list-checks": "check" | "cascade" | "done"
  }
}

/** Item lines 6 apart, 2 clear of the ticks on their left; the middle item has no tick yet. */
const LINES = [
  { part: "line-0", d: "M13 6h8" },
  { part: "line-1", d: "M13 12h8" },
  { part: "line-2", d: "M13 18h8" },
] as const

/** A tick centred on its row: a short 45° leg and a long one, 4px tall, ending 2 clear of its line. */
const TICKS = [
  { part: "tick-0", d: "M3 6l2 2 4-4" },
  { part: "tick-1", d: "M3 18l2 2 4-4" },
] as const

/** 2 colors: lines (primary), ticks (accent). */
export const ListChecks = createAnimatedIcon({
  name: "list-checks",
  family: "list",
  category: "layout",
  keywords: ["checklist", "tasks", "done", "completed", "todo", "check list", "steps"],
  slots: { primary: "lines", accent: "ticks" },
  defaultVariant: "check",
  variants: {
    // the ticks are wiped, then redraw one after the other down the list; each is hidden while too
    // short to read, so the square cap never leaves a stray dot
    check: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          TICKS.map(({ part }, i) => {
            const start = 0.2 + i * 0.35
            return Promise.all([
              animate(
                `[data-part=${part}]`,
                { opacity: [1, 0, 0, 1, 1] },
                { duration: seconds, times: [0, 0.15, start, start + 0.02, 1] },
              ),
              animate(
                `[data-part=${part}]`,
                { pathLength: [1, 1, 0, 1, 1] },
                { duration: seconds, times: [0, start - 0.01, start, start + 0.35, 1], ease: "easeOut" },
              ),
            ])
          }),
        ),
    },
    // a wave runs down the list: each tick pops and its line snaps short and shoots out again
    cascade: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part^=tick]",
            { scale: [1, 1.25, 0.92, 1] },
            { duration: seconds * 0.5, ease: ease.out, delay: stagger(seconds * 0.4) },
          ),
          animate(
            "[data-part^=line]",
            { scaleX: [1, 0.4, 1.05, 1] },
            { duration: seconds * 0.55, ease: "easeInOut", delay: stagger(seconds * 0.2) },
          ),
        ]),
    },
    // each checked item dims as done, one after the other, then the list brightens again
    done: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["line-0", "line-2"].map((part, i) =>
            animate(
              `[data-part=${part}]`,
              { opacity: [1, 0.3, 0.3, 1], scaleX: [1, 0.75, 0.75, 1] },
              { duration: seconds * 0.75, times: [0, 0.3, 0.7, 1], ease: "easeInOut", delay: seconds * 0.25 * i },
            ),
          ),
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {TICKS.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} style={pivot("30% 100%")} />
        ))}
      </g>
      {LINES.map(({ part, d }) => (
        <path key={part} data-part={part} d={d} style={pivot("0% 50%")} />
      ))}
    </>
  ),
})
