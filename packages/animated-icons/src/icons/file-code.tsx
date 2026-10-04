"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-code": "spread" | "type"
  }
}

/** The two brackets in file-search's lens corner, 4 apart so they never touch. */
const LEFT = "M14 14l-3 3.5 3 3.5"
const RIGHT = "M18 14l3 3.5-3 3.5"

/** 2 colors: page (primary), code brackets (accent). */
export const FileCode = createAnimatedIcon({
  name: "file-code",
  family: "file",
  category: "files",
  keywords: ["source file", "code", "script", "html", "programming", "developer", "markup"],
  slots: { primary: "page", accent: "brackets" },
  defaultVariant: "spread",
  variants: {
    // the brackets part a little and close back in, like a tag being opened
    spread: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all(
          [
            ["left", -1],
            ["right", 1],
          ].map(([part, dx]) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, Number(dx), Number(dx), 0] },
              { duration: seconds, times: [0, 0.35, 0.55, 1], ease: "easeInOut" },
            ),
          ),
        ),
    },
    // the brackets vanish and pop back in one after the other, as if typed
    type: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["left", "right"].map((part, i) =>
            animate(
              `[data-part=${part}]`,
              { scale: [1, 0, 0, 1.15, 1], opacity: [1, 0, 0, 1, 1] },
              {
                duration: seconds,
                times: [0, 0.15, 0.3 + i * 0.25, 0.55 + i * 0.25, 0.7 + i * 0.25].map((t) => Math.min(t, 1)),
                ease: ["easeIn", "linear", ease.overshoot, "easeOut"],
              },
            ),
          ),
        ),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <>
        {/* file-search's page: the right and bottom edges stop short of the brackets */}
        <path d="M18 10V7l-5-5H4v20h6" />
        <path d="M13 2v5h5" />
        <g stroke={slot.accent}>
          <path data-part="left" d={LEFT} style={pivot("100% 50%")} />
          <path data-part="right" d={RIGHT} style={pivot("0% 50%")} />
        </g>
      </>
    </g>
  ),
})
