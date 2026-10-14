"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "fire-extinguisher": "spray" | "shake" | "flip"
  }
}

/** Where each spray particle flies from the nozzle: fanning out down the left, clear of the tank. */
const FAN = [
  { x: -2, y: 6 },
  { x: 0, y: 7 },
  { x: 1.5, y: 6 },
] as const

/** Three bursts of the fan, one per shudder of the nozzle. */
const SPRAY = [0, 1, 2].flatMap((burst) => FAN.map((to, i) => ({ part: `spray-${burst}-${i}`, burst, ...to })))

/** 2 colors: tank and hose (primary), lever, nozzle and spray (accent). */
export const FireExtinguisher = createAnimatedIcon({
  name: "fire-extinguisher",
  category: "security",
  keywords: ["fire safety", "emergency", "extinguish", "safety equipment", "fire", "hazard", "protection"],
  slots: { primary: "tank + hose", accent: "lever + nozzle + spray" },
  defaultVariant: "spray",
  variants: {
    // the lever is squeezed and the tank kicks back as the nozzle shudders out three bursts of spray
    spray: {
      duration: 1100,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lever]",
            { rotate: [0, 22, 22, 0] },
            { duration: seconds, times: [0, 0.12, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=extinguisher]",
            { x: [0, 1, 0.5, 1, 0.5, 0], rotate: [0, 5, 3, 5, 3, 0] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.5, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=nozzle]",
            { scaleX: [1, 1.35, 1, 1.35, 1, 1.35, 1], scaleY: [1, 0.8, 1, 0.8, 1, 0.8, 1] },
            { duration: seconds * 0.8, delay: seconds * 0.1, ease: "easeInOut" },
          ),
          ...SPRAY.map(({ part, burst, x, y }) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, x], y: [0, y], opacity: [0, 1, 1, 0], scale: [0.5, 1, 1.4] },
              { duration: seconds * 0.35, delay: seconds * (0.12 + burst * 0.22), ease: "easeOut" },
            ),
          ),
        ]),
    },
    // shaken before use: the tank rocks on its base while the hose swings out behind it and drops back
    shake: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=extinguisher]",
            { rotate: [0, -10, 8, -6, 3, 0], y: [0, 0.5, -1, 0.5, 0, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=hose]",
            { rotate: [0, 12, -2, 8, -1, 0] },
            { duration: seconds, delay: seconds * 0.06, ease: "easeInOut" },
          ),
        ]),
    },
    // turned round on its upright axis like a product shot: it crouches, swivels, and lands square
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=extinguisher]",
            { scaleY: [1, 0.88, 1, 1, 0.9, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.75, 0.87, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=turn]",
            { scaleX: [1, -1, 1], skewY: [0, 6, 0, -6, 0] },
            { duration: seconds * 0.6, delay: seconds * 0.18, ease: "easeInOut" },
          ),
          animate(
            "[data-part=nozzle]",
            { scale: [1, 1, 1.4, 1] },
            { duration: seconds, times: [0, 0.8, 0.9, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {SPRAY.map(({ part }) => (
          <rect key={part} data-part={part} x="4" y="16.5" width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="extinguisher" style={pivot("50% 100%")}>
        <g data-part="turn" style={pivot("50% 50%")}>
          {/* a chamfered-shoulder tank with a band round its middle, on a short neck */}
          <path d="M12 8h4l2 2v11h-8V10z" />
          <path d="M10 17h8M14 8V4" />
          <path data-part="lever" d="M14 4l4-1" stroke={slot.accent} style={pivot("0% 100%")} />
          <g data-part="hose" style={pivot("100% 0%")}>
            {/* the hose runs off the neck and hangs down beside the tank, ending in a flared nozzle */}
            <path d="M14 4H8L5 7v5" />
            <path data-part="nozzle" d="M4 12h2l1 4H3z" fill={slot.accent} stroke="none" style={pivot("50% 0%")} />
          </g>
        </g>
      </g>
    </>
  ),
})
