"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    radio: "broadcast" | "spin" | "pulse"
  }
}

const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** A true arc of radius r round the centre (12, 12), a quarter turn wide, facing right or left. */
function arc(r: number, side: 1 | -1) {
  const d = r * Math.SQRT1_2
  return `M${fmt(12 + side * d)} ${fmt(12 - side * d)}A${r} ${r} 0 0 1 ${fmt(12 + side * d)} ${fmt(12 + side * d)}`
}

/** Inner and outer waves either side of the source, 2 clear of it and of each other. */
const WAVES = [
  { ring: "inner", side: "right", d: arc(5, 1) },
  { ring: "inner", side: "left", d: arc(5, -1) },
  { ring: "outer", side: "right", d: arc(9, 1) },
  { ring: "outer", side: "left", d: arc(9, -1) },
] as const

/** Selector for one ring of waves, both sides. */
const ring = (name: "inner" | "outer") => `[data-ring=${name}]`
/** Selector for one side's waves. */
const side = (name: "left" | "right") => `[data-part=wave][data-side=${name}]`

/** 2 colors: waves (primary), source (accent). */
export const Radio = createAnimatedIcon({
  name: "radio",
  category: "communication",
  keywords: ["broadcast", "signal", "transmit", "live", "station", "on air", "wireless", "podcast"],
  slots: { primary: "waves", accent: "source" },
  defaultVariant: "broadcast",
  variants: {
    // the source pops and sends the waves out: the inner pair grows out of it, the outer pair follows
    broadcast: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=source]", { scale: [1, 1.7, 1] }, { duration: seconds * 0.5, times: [0, 0.3, 1], ease: "easeOut" }),
          ...(["inner", "outer"] as const).flatMap((name, i) => {
            const start = 0.1 + i * 0.25
            const timing = { duration: seconds, times: [0, start, start + 0.35, 1] }
            return [
              animate(`${side("right")}${ring(name)}`, { x: [-3, -3, 0, 0] }, { ...timing, ease: ease.overshoot }),
              animate(`${side("left")}${ring(name)}`, { x: [3, 3, 0, 0] }, { ...timing, ease: ease.overshoot }),
              animate(ring(name), { scale: [0.4, 0.4, 1, 1], opacity: [0, 0, 1, 1] }, { ...timing, ease: ease.out }),
            ]
          }),
        ]),
    },
    // the waves revolve round the source on an upright axis, like rings round a planet; the source,
    // a ball, looks the same from every side and stays put
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=waves]",
          { scaleX: [1, 0, -1, 0, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
        ),
    },
    // the source winds in, then fires: both rings are kicked outward and wobble back into place
    pulse: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.25, 0.45, 0.65, 0.82, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=source]", { scale: [1, 0.6, 1.6, 0.9, 1.05, 1] }, timing),
          animate(`${side("right")}${ring("inner")}`, { x: [0, -1, 2, -0.6, 0.3, 0] }, timing),
          animate(`${side("left")}${ring("inner")}`, { x: [0, 1, -2, 0.6, -0.3, 0] }, timing),
          animate(`${side("right")}${ring("outer")}`, { x: [0, -1, 3, -1, 0.4, 0] }, timing),
          animate(`${side("left")}${ring("outer")}`, { x: [0, 1, -3, 1, -0.4, 0] }, timing),
        ])
      },
    },
  },
  render: () => (
    <>
      <g data-part="waves" style={pivot("50% 50%")}>
        {/* waves are round, so they are true arcs */}
        {WAVES.map(({ ring, side, d }) => (
          <path
            key={d}
            data-part="wave"
            data-ring={ring}
            data-side={side}
            d={d}
            style={pivot(side === "right" ? "0% 50%" : "100% 50%")}
          />
        ))}
      </g>
      <circle data-part="source" cx="12" cy="12" r="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </>
  ),
})
