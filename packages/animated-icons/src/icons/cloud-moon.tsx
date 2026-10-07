"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-moon": "turn" | "set" | "float"
  }
}

/** The cloud of the cloud family, drawn smaller and lower-left so the moon can stand behind it. */
const CLOUD = "M5 21l-3-3v-2l2-2h1l1.5-3 2.5-1.5h2l2.5 1.5 1.5 3h1l2 2v2l-3 3z"

/**
 * A crescent from two true arcs (a moon is round), upper right, its bite facing the cloud: three
 * quarters of a circle round (15, 9) from its top horn to its left horn, then back through the bite.
 */
const CRESCENT = "M15 3A6 6 0 1 1 9 9A4.472 4.472 0 1 0 15 3Z"

/** 2 colors: cloud (primary), moon (accent). */
function Drawing() {
  const behind = `cloud-moon-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      {/* the moon hides behind the cloud, 2px clear of its outline; the mask's cloud moves with the cloud */}
      <mask id={behind} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="cloud" d={CLOUD} fill="#000" stroke="#000" strokeWidth={6} style={pivot("50% 100%")} />
      </mask>
      <g mask={`url(#${behind})`}>
        <g data-part="lift" style={pivot("50% 50%")}>
          <path data-part="moon" d={CRESCENT} stroke={slot.accent} style={pivot("50% 50%")} />
        </g>
      </g>
      <path data-part="cloud" d={CLOUD} style={pivot("50% 100%")} />
    </>,
  )
}

export const CloudMoon = createAnimatedIcon({
  name: "cloud-moon",
  family: "cloud",
  category: "weather",
  keywords: ["night", "partly cloudy", "weather", "moon", "cloud", "evening", "forecast", "overcast"],
  slots: { primary: "cloud", accent: "moon" },
  defaultVariant: "turn",
  variants: {
    // the crescent lifts toward you and turns a full circle on its upright axis, showing its other
    // face halfway round, then settles back over the cloud
    turn: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=moon]",
            { scaleX: [1, -1, -1, 1] },
            { duration: seconds, times: [0, 0.4, 0.55, 0.95], ease: [ease.inOut, "linear", ease.inOut] },
          ),
          animate(
            "[data-part=lift]",
            { scale: [1, 1.15, 1.15, 1], y: [0, -1, -1, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the moon sinks behind the cloud, rocking as it goes, and rises back over it with a bounce
    set: {
      clip: false,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lift]",
            { x: [0, -3, -3, 0], y: [0, 8, 8, 0] },
            { duration: seconds, times: [0, 0.38, 0.48, 1], ease: [ease.in, "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=moon]",
            { rotate: [0, -25, -25, 12, 0] },
            { duration: seconds, times: [0, 0.38, 0.48, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the near cloud and the far moon float out of step, the cloud by more, so they slide past each other
    float: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cloud]",
            { x: [0, 1.5, -1, 0], y: [0, 1, -1, 0] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=lift]",
            { x: [0, -0.5, 0.4, 0], y: [0, -1, 0.6, 0] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
