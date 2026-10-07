"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    podcast: "broadcast" | "zoom" | "draw"
  }
}

/** The mic head's centre: the signal rings are true arcs around it. */
const CX = 12
const CY = 11
const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/**
 * A ring of radius r around the head, open at the bottom where the stand passes, `gap` degrees either side
 * of straight down. Split at its top into two halves, so it can draw on from the top both ways at once.
 * `origin` is the head's centre relative to the ring's box, for scaling the ring around the head.
 */
function ring(r: number, gap: number) {
  const dx = r * Math.sin((gap * Math.PI) / 180)
  const endY = fmt(CY + r * Math.cos((gap * Math.PI) / 180))
  const top = `M${CX} ${CY - r}A${r} ${r} 0 0`
  return {
    halves: [`${top} 0 ${fmt(CX - dx)} ${endY}`, `${top} 1 ${fmt(CX + dx)} ${endY}`],
    origin: `50% ${fmt((r / (r + Number(endY) - CY)) * 100)}%`,
  }
}

/** Inner to outer: 2px clear of the head, of each other, and (at the open ends) of the stand. */
const RINGS = [
  { part: "inner", ...ring(5, 60) },
  { part: "outer", ...ring(9, 40) },
] as const

/** 2 colors: mic (primary), signal rings (accent). */
export const Podcast = createAnimatedIcon({
  name: "podcast",
  category: "media",
  keywords: ["broadcast", "on air", "radio", "episode", "audio show", "listen", "streaming", "microphone"],
  slots: { primary: "mic", accent: "signal rings" },
  defaultVariant: "broadcast",
  variants: {
    // the head pulses and the rings ripple out from it, inside first, overshooting before they settle
    broadcast: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            { scale: [1, 0.7, 1.4, 1, 1] },
            { duration: seconds, times: [0, 0.08, 0.16, 0.26, 1], ease: "easeOut" },
          ),
          ...RINGS.map(({ part }, i) => {
            const start = 0.22 + 0.18 * i
            return animate(
              `[data-part=${part}]`,
              { opacity: [1, 0, 0, 1, 1, 1], scale: [1, 0.8, 0.8, 1.12, 1, 1] },
              { duration: seconds, times: [0, 0.1, start, start + 0.3, start + 0.45, 1], ease: "easeOut" },
            )
          }),
        ]),
    },
    // dollying in on the mic and easing back: parallax, the near head moves most
    zoom: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        // the head swells most; the outer ring outgrows the inner one, so the layers spread apart and never touch
        const depth = [
          ["head", 1.5, 0.92],
          ["inner", 1.12, 0.95],
          ["outer", 1.2, 0.96],
        ] as const
        return Promise.all(
          depth.map(([part, near, back]) =>
            animate(
              `[data-part=${part}]`,
              { scale: [1, near, near, back, 1] },
              { duration: seconds, times: [0, 0.35, 0.55, 0.8, 1], ease: ["easeOut", "linear", "easeInOut", ease.overshoot] },
            ),
          ),
        )
      },
    },
    // the rings wind back into the top, outer first, and draw on again from the top both ways, inner first
    draw: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          RINGS.flatMap(({ part }, i) => {
            const erased = 0.3 - i * 0.1
            const redraw = 0.45 + i * 0.15
            const done = redraw + 0.35
            const half = `[data-part=${part}] [data-part=half]`
            const timing = { duration: seconds } as const
            return [
              animate(half, { pathLength: [1, 0, 0, 1, 1] }, { ...timing, times: [0, erased, redraw, done, 1], ease: "easeInOut" }),
              // the square cap would leave a dot at zero length: off from the moment it is erased until it redraws
              animate(
                half,
                { opacity: [1, 1, 0, 0, 1, 1] },
                { ...timing, times: [0, erased - 0.02, erased, redraw, redraw + 0.04, 1], ease: "linear" },
              ),
            ]
          }),
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {RINGS.map(({ part, halves, origin }) => (
          <g key={part} data-part={part} style={pivot(origin)}>
            {halves.map((d) => (
              <path key={d} data-part="half" d={d} />
            ))}
          </g>
        ))}
      </g>
      {/* a round head (a genuinely round object, so a true circle) on a straight stand, 2px below it */}
      <circle data-part="head" cx={CX} cy={CY} r="2" fill={slot.primary} stroke="none" style={pivot("50% 50%")} />
      <path d="M12 16v5" />
    </>
  ),
})
