"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    kanban: "sort" | "drag" | "deal"
  }
}

/** Three columns hanging from one top line, 7 apart: todo, doing (the short one), done. */
const COLUMNS = [
  { part: "column-0", d: "M5 3v14" },
  { part: "column-1", d: "M12 3v8" },
  { part: "column-2", d: "M19 3v18" },
] as const

/** 2 colors: side columns (primary), the card in progress (accent). */
export const Kanban = createAnimatedIcon({
  name: "kanban",
  category: "layout",
  keywords: ["board", "columns", "tasks", "project", "workflow", "agile", "sprint", "trello"],
  slots: { primary: "columns", accent: "column in progress" },
  defaultVariant: "sort",
  variants: {
    // the columns pull up and spring back down one after another, like a board being re-sorted
    sort: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=column-0], [data-part=column-1]",
            { scaleY: [1, 0.35, 1.08, 0.97, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.3, 0.65, 0.85, 1],
              ease: "easeInOut",
              delay: stagger(seconds * 0.15),
            },
          ),
          // the long column already reaches the bottom: it springs back without overshooting the frame
          animate(
            "[data-part=column-2]",
            { scaleY: [1, 0.35, 1, 0.94, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.3, 0.65, 0.85, 1],
              ease: "easeInOut",
              delay: seconds * 0.3,
            },
          ),
        ]),
    },
    // the card in progress is picked up (bigger, tilted, nudged towards done), then dropped back
    // with a squash that jolts its neighbours
    drag: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=column-1]",
            {
              x: [0, 2, 2, 0, 0],
              rotate: [0, 10, -6, 0, 0],
              scale: [1, 1.15, 1.15, 1, 1],
              scaleY: [1, 1, 1, 0.8, 1],
            },
            { duration: seconds, times: [0, 0.3, 0.6, 0.78, 1], ease: ["easeOut", "easeInOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=column-0], [data-part=column-2]",
            { scaleY: [1, 1, 0.92, 1] },
            { duration: seconds, times: [0, 0.78, 0.88, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the columns fly up out of the board, then drop back in one by one and land with a squash
    deal: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part^=column]",
          { y: [0, -22, -22, 0, 0], scaleY: [1, 1.2, 1.2, 0.85, 1] },
          {
            duration: seconds * 0.7,
            times: [0, 0.3, 0.45, 0.8, 1],
            ease: ["easeIn", "linear", "easeIn", ease.overshoot],
            delay: stagger(seconds * 0.15),
          },
        ),
    },
  },
  render: () => (
    <>
      {COLUMNS.map(({ part, d }) => (
        <path
          key={part}
          data-part={part}
          d={d}
          stroke={part === "column-1" ? slot.accent : undefined}
          style={pivot("50% 0%")}
        />
      ))}
    </>
  ),
})
