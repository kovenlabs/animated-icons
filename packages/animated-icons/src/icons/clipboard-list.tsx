"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "clipboard-list": "fill" | "clip" | "tilt"
  }
}

/** Three rows 4 apart, under the clip and 2 clear of the board's bottom edge. */
const ROWS = [10, 14, 18] as const

/** 2 colors: board and clip (primary), list rows (accent). */
export const ClipboardList = createAnimatedIcon({
  name: "clipboard-list",
  family: "clipboard",
  category: "files",
  keywords: ["checklist", "todo", "tasks", "list", "agenda", "inventory", "roll call", "plan"],
  slots: { primary: "board + clip", accent: "list rows" },
  defaultVariant: "fill",
  variants: {
    // the rows fold away together, then unroll from their bullets one after another, top to bottom
    fill: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          ROWS.map((_, i) => {
            const start = 0.25 + i * 0.2
            return animate(
              `[data-part=row-${i}]`,
              { scaleX: [1, 0, 0, 1, 1], opacity: [1, 0, 0, 1, 1] },
              { duration: seconds, times: [0, 0.15, start, start + 0.3, 1], ease: "easeOut" },
            )
          }),
        ),
    },
    // the clip lifts off the board and snaps back down on it
    clip: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clip]",
          { y: [0, -1.5, 0.5, 0], scaleY: [1, 1, 0.85, 1] },
          { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // held up and turned for a look, then set back square (8°, so the wide board's corner stays in frame)
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=board]",
          { rotate: [0, -8, -8, 3, 0], y: [0, -1.5, -1.5, 0, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="board" style={pivot("50% 100%")}>
      {/* clipboard-check's board and clip, 2 wider so each row has room for a real line */}
      <path d="M8 4H4v18h16V4h-4" />
      <path data-part="clip" d="M8 2h8v4H8z" style={pivot("50% 100%")} />
      {/* each row: a 2×2 bullet 2 clear of the board's edge, and a line 2 clear of the bullet and the edge */}
      {ROWS.map((y, i) => (
        <g key={y} data-part={`row-${i}`} style={pivot("0% 50%")}>
          <rect x="7" y={y - 1} width="2" height="2" fill={slot.accent} stroke="none" />
          <path d={`M12 ${y}h4`} stroke={slot.accent} />
        </g>
      ))}
    </g>
  ),
})
