"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cloud: "drift" | "rain" | "puff"
  }
}

/** Each drop's x, just under the cloud's flat base, in the order they fall: middle, left, right. */
const DROPS = [12, 8, 16]

/** 2 colors: cloud (primary), rain drops (accent). */
export const Cloud = createAnimatedIcon({
  name: "cloud",
  category: "weather",
  keywords: ["weather", "cloudy", "overcast", "storage", "online", "sky", "rain"],
  slots: { primary: "cloud", accent: "rain drops" },
  defaultVariant: "drift",
  variants: {
    // a slow sideways drift, a pixel each way: the cloud already fills the frame edge to edge
    drift: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        animate("[data-part=cloud]", { x: [0, 1, -1, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // three drops fall in turn and leave through the bottom of the frame, while the cloud lifts a touch
    rain: {
      clip: true,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=drop]",
            { y: [0, 5], opacity: [0, 1, 0] },
            { duration: seconds * 0.6, delay: stagger(seconds * 0.2), ease: "easeIn" },
          ),
          animate("[data-part=cloud]", { y: [0, -1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the cloud breathes in and puffs back out from its base
    puff: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cloud]",
          { scaleX: [1, 0.94, 1.06, 1], scaleY: [1, 0.92, 1.08, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the faceted cloud of the cloud family, closed along its flat base */}
      <path data-part="cloud" d="M5 18l-3-3v-2l3-3h1l2-4 3-2h2l3 2 2 4h1l3 3v2l-3 3z" style={pivot("50% 100%")} />
      <g stroke={slot.accent}>
        {DROPS.map((x) => (
          <path key={x} data-part="drop" d={`M${x} 20v1.5`} style={flash()} />
        ))}
      </g>
    </>
  ),
})
