"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    volume: "waves" | "pump" | "draw"
  }
}

/** Sound waves are curves, so they are true arcs, centred just right of the cone's mouth (11.5, 12). */
const WAVES = ["M15.5 9a5 5 0 0 1 0 6", "M17.86 5.64a9 9 0 0 1 0 12.72"]

/** 2 colors: speaker (primary), sound waves (accent). */
export const VolumeIcon = createAnimatedIcon({
  name: "volume",
  category: "media",
  keywords: ["sound", "audio", "speaker", "loud", "volume up", "unmute"],
  slots: { primary: "speaker", accent: "sound waves" },
  defaultVariant: "waves",
  variants: {
    // both waves blink out, then come back one after the other, inside first
    waves: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          WAVES.map((_, i) => {
            // the outer wave's cycle is the whole duration, the inner one finishes earlier
            const span = 0.65 + i * 0.35
            return animate(
              `[data-wave="${i}"]`,
              { opacity: [1, 0, 0, 1], scale: [1, 0.7, 0.7, 1] },
              { duration: seconds * span, times: [0, 0.12 / span, (0.35 + i * 0.25) / span, 1], ease: "easeOut" },
            )
          }),
        ),
    },
    // the cone kicks and the waves are pushed out together, then settle
    pump: {
      duration: 600,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=speaker]",
            { scale: [1, 0.9, 1.05, 1] },
            { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
          ),
          animate(
            "[data-part=waves]",
            { x: [0, 1.5, 0] },
            { duration: seconds, times: [0, 0.4, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the waves erase, outside first, and redraw from the inside out (hidden while at zero length)
    draw: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          WAVES.flatMap((_, i) => {
            const span = 0.75 + i * 0.25
            const erased = (0.3 - i * 0.1) / span
            const redraw = (0.45 + i * 0.15) / span
            const wave = `[data-wave="${i}"]`
            const timing = { duration: seconds * span, ease: "easeInOut" } as const
            return [
              animate(wave, { pathLength: [1, 0, 0, 1] }, { ...timing, times: [0, erased, redraw, 1] }),
              // the square cap would leave a dot at zero length: off from the moment it is erased until it redraws
              animate(wave, { opacity: [1, 1, 0, 0, 1, 1] }, { ...timing, ease: "linear", times: [0, erased - 0.02, erased, redraw, redraw + 0.04, 1] }),
            ]
          }),
        ),
    },
  },
  render: () => (
    <>
      {/* a box with a flared cone: straight segments only */}
      <path data-part="speaker" d="M3 9h4l4-4v14l-4-4H3Z" style={pivot("100% 50%")} />
      <g data-part="waves" stroke={slot.accent}>
        {WAVES.map((d, i) => (
          <path key={d} data-part="wave" data-wave={i} d={d} style={pivot("0% 50%")} />
        ))}
      </g>
    </>
  ),
})
