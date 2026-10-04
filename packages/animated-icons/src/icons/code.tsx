"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    code: "part" | "flip" | "write"
  }
}

/** 2 colors: angle brackets (primary), slash (accent). */
export const Code = createAnimatedIcon({
  name: "code",
  category: "development",
  keywords: ["source", "developer", "programming", "html", "markup", "embed", "snippet", "tag"],
  slots: { primary: "angle brackets", accent: "slash" },
  defaultVariant: "part",
  variants: {
    // the brackets part to make room around the slash, then spring back a touch past rest
    part: {
      duration: 700,
      run: ({ animate, seconds }) => {
        const transition = { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=left]", { x: [0, -2, 0.5, 0] }, transition),
          animate("[data-part=right]", { x: [0, 2, -0.5, 0] }, transition),
        ])
      },
    },
    // the slash turns over on its centre like a card, reads as a backslash for a beat, and turns back
    flip: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=slash]",
          { scaleX: [1, -1, -1, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
    // the slash fades, then strikes itself back in from the top; hidden while too short to read
    write: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.85, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* two right-angled chevrons, with room between them for the slash */}
      <path data-part="left" d="M7 7l-5 5 5 5" style={pivot("50% 50%")} />
      <path data-part="right" d="M17 7l5 5-5 5" style={pivot("50% 50%")} />
      <path data-part="slash" d="M13.5 5l-3 14" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
