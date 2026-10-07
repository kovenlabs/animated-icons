"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-fog": "roll" | "fade" | "sweep"
  }
}

/** The far bank of fog, tucked between the cloud's lower corners, and the near bank along the bottom. */
const FAR = "M9 18h6"
const NEAR = "M5 22h14"

/** 2 colors: cloud (primary), fog (accent). */
export const CloudFog = createAnimatedIcon({
  name: "cloud-fog",
  family: "cloud",
  category: "weather",
  keywords: ["fog", "foggy", "mist", "haze", "weather", "smog", "overcast", "forecast"],
  slots: { primary: "cloud", accent: "fog" },
  defaultVariant: "roll",
  variants: {
    // the fog rolls toward you: the far bank slides down and widens into the near one, the near bank
    // widens on past and fades out, and a new bank swells up out of nothing under the cloud
    roll: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=far]",
            { y: [0, 4, 0] },
            { duration: seconds, times: [0, 0.75, 1], ease: [ease.inOut, snap] },
          ),
          animate(
            "[data-part=far]",
            { scaleX: [1, 1, 14 / 6, 1] },
            { duration: seconds, times: [0, 0.2, 0.75, 1], ease: ["linear", ease.inOut, snap] },
          ),
          animate(
            "[data-part=near]",
            { y: [0, 3, 0], scaleX: [1, 1.35, 1], opacity: [1, 0, 1] },
            { duration: seconds, times: [0, 0.75, 1], ease: [ease.inOut, snap] },
          ),
          animate(
            "[data-part=next]",
            { scaleX: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.35, 0.75, 0.999, 1], ease: ["linear", ease.out, "linear", snap] },
          ),
          animate("[data-part=cloud]", { y: [0, -1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the cloud sinks back into the fog, shrinking and paling into the distance as the near bank
    // spreads, then comes forward again with a little overshoot
    fade: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cloud]",
            { scale: [1, 0.78, 0.78, 1.06, 1], y: [0, -1, -1, 0, 0], opacity: [1, 0.25, 0.25, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.55, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=near]",
            { scaleX: [1, 1.3, 1.3, 1] },
            { duration: seconds, times: [0, 0.35, 0.55, 0.9], ease: "easeInOut" },
          ),
          animate(
            "[data-part=far]",
            { scaleX: [1, 0.4, 0.4, 1], opacity: [1, 0.4, 0.4, 1] },
            { duration: seconds, times: [0, 0.35, 0.55, 0.9], ease: "easeInOut" },
          ),
        ]),
    },
    // a breeze sweeps the near bank out through the right edge and back in from the left, while the
    // far bank thins to a sliver and fills out again behind it
    sweep: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=near]",
            { x: [0, 12, -12, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.45, 0.5, 1], ease: [ease.in, "linear", ease.out] },
          ),
          animate(
            "[data-part=far]",
            { scaleX: [1, 0.3, 1] },
            { duration: seconds * 0.8, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the faceted cloud of the cloud family, open along its base where the fog hangs */}
      <path data-part="cloud" d="M5 18l-3-3v-2l3-3h1l2-4 3-2h2l3 2 2 4h1l3 3v2l-3 3" style={pivot("50% 100%")} />
      <g stroke={slot.accent}>
        <path data-part="far" d={FAR} style={pivot("50% 50%")} />
        <path data-part="near" d={NEAR} style={pivot("50% 50%")} />
        {/* the next bank, only seen while the fog rolls in */}
        <path data-part="next" d={FAR} style={flash("50% 50%")} />
      </g>
    </>
  ),
})
