"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "git-compare": "compare" | "swap" | "flip"
  }
}

/** A link draws on, hidden while it is too short to read so its cap never shows as a dot. */
function redraw(start: number, end: number) {
  return {
    pathLength: { values: [1, 1, 0, 0, 1, 1], times: [0, start, start + 0.02, start + 0.04, end, 1] },
    opacity: { values: [1, 1, 0, 0, 1, 1], times: [0, start, start + 0.02, start + 0.06, start + 0.08, 1] },
  }
}

/** 2 colors: commits (primary), the two links between them (accent). */
export const GitCompare = createAnimatedIcon({
  name: "git-compare",
  family: "git",
  category: "development",
  keywords: ["diff", "compare", "git", "changes", "version control", "pull request", "branches"],
  slots: { primary: "commits", accent: "links" },
  defaultVariant: "compare",
  variants: {
    // a two-way exchange: the bottom commit winds up and shoots its link to the top one, which pops on
    // the catch and fires the other link straight back
    compare: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const top = redraw(0.12, 0.42)
        const bottom = redraw(0.5, 0.8)
        const draw = (track: { values: number[]; times: number[] }) => ({
          duration: seconds,
          times: track.times,
          ease: "easeInOut" as const,
        })
        return Promise.all([
          animate("[data-part=top-link]", { pathLength: top.pathLength.values }, draw(top.pathLength)),
          animate("[data-part=top-link]", { opacity: top.opacity.values }, draw(top.opacity)),
          animate("[data-part=bottom-link]", { pathLength: bottom.pathLength.values }, draw(bottom.pathLength)),
          animate("[data-part=bottom-link]", { opacity: bottom.opacity.values }, draw(bottom.opacity)),
          // the sender squashes as it fires, then bulges as the answer lands
          animate(
            "[data-part=head]",
            { scale: [1, 0.75, 1.1, 1, 1, 1.22, 1] },
            { duration: seconds, times: [0, 0.1, 0.2, 0.3, 0.76, 0.86, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=base]",
            { scale: [1, 1, 1.22, 0.75, 1.1, 1] },
            { duration: seconds, times: [0, 0.38, 0.48, 0.56, 0.66, 0.78], ease: "easeInOut" },
          ),
        ])
      },
    },
    // the commits trade places: the whole diagram spins half a turn, dipping back in depth as it goes
    // and swelling forward as it lands. The drawing is symmetric, so the half turn snaps back unseen
    swap: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=diagram]",
            { rotate: [0, -12, 196, 180, 180, 0] },
            {
              duration: seconds,
              times: [0, 0.15, 0.62, 0.8, 0.999, 1],
              ease: ["easeOut", ease.in, "easeOut", "easeInOut", snap],
            },
          ),
          // the dip lands before the diagonal turns upright, or the commits would poke out of the frame
          animate(
            "[data-part=diagram]",
            { scale: [1, 0.95, 0.72, 0.72, 1.08, 1] },
            { duration: seconds, times: [0, 0.15, 0.42, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // each commit tosses over like a coin, the far one a beat after the near one, and the links flicker
    // as the light catches them
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const toss = { scaleX: [1, -1, 1], skewY: [0, 14, 0, -14, 0], scale: [1, 1.15, 1] }
        const timing = { duration: seconds * 0.6, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=head]", toss, timing),
          animate("[data-part=base]", toss, { ...timing, delay: seconds * 0.25 }),
          animate(
            "[data-part=link]",
            { opacity: [1, 0.3, 1, 0.3, 1] },
            { duration: seconds, times: [0, 0.25, 0.45, 0.65, 0.9], ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="diagram" style={pivot("50% 50%")}>
      <circle data-part="head" cx="6" cy="6" r="3" style={pivot("50% 50%")} />
      <circle data-part="base" cx="18" cy="18" r="3" style={pivot("50% 50%")} />
      <g data-part="link" stroke={slot.accent}>
        {/* each link leaves one commit square-cornered and stops short of the other */}
        <path data-part="top-link" d="M18 15V6h-5" />
        <path data-part="bottom-link" d="M6 9v9h5" />
      </g>
    </g>
  ),
})
