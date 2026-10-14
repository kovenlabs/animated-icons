"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    radar: "sweep" | "lock" | "tilt"
  }
}

/** The scope's centre: the sweep turns about it. */
const C = 12
const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** A point `r` out from the centre at `deg` clockwise from straight up. */
function polar(deg: number, r: number) {
  const a = (deg * Math.PI) / 180
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) }
}

/** The fading trail behind the sweep: a 40° wedge, flat-edged. */
const tail = polar(-40, 7)
const TRAIL = `M${C} ${C}V${C - 7}L${fmt(tail.x)} ${fmt(tail.y)}Z`

/** Echoes on the scope, by bearing; each one only shows once the sweep has passed it. */
const BLIPS = [70, 200, 300].map((deg, i) => {
  const { x, y } = polar(deg, 6)
  return { part: `blip-${i + 1}`, deg, x: fmt(x - 1), y: fmt(y - 1) }
})

const sel = (part: string) => `[data-part=${part}]`

/** Wind-up before the sweep: it rocks back this far, then turns a full circle. */
const WIND = 20
const WIND_AT = 0.15

/** 2 colors: scope (primary), sweep, trail and echoes (accent). */
export const Radar = createAnimatedIcon({
  name: "radar",
  category: "navigation",
  keywords: ["scan", "sonar", "detect", "search", "tracking", "locate", "proximity", "scope"],
  slots: { primary: "scope", accent: "sweep + trail + echoes" },
  defaultVariant: "sweep",
  variants: {
    // rocks back, then sweeps a full circle with a glowing trail, and each echo flares up as the
    // beam passes over it
    sweep: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("sweep"),
            { rotate: [0, -WIND, 360] },
            { duration: seconds, times: [0, WIND_AT, 1], ease: ["easeOut", "linear"] },
          ),
          animate(sel("trail"), { opacity: [0, 0, 1, 1, 0] }, { duration: seconds, times: [0, WIND_AT, 0.25, 0.85, 1] }),
          ...BLIPS.map(({ part, deg }) =>
            animate(
              sel(part),
              { opacity: [0, 1, 0], scale: [0.3, 1.6, 1] },
              {
                duration: seconds * 0.45,
                delay: seconds * (WIND_AT + (1 - WIND_AT) * ((deg + WIND) / (360 + WIND))),
                ease: "easeOut",
              },
            ),
          ),
        ]),
    },
    // target acquired: the sweep snaps onto the first echo and overshoots, the echo flares big, the
    // scope recoils, and the sweep swings back home
    lock: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("sweep"),
            { rotate: [0, BLIPS[0]!.deg + 14, BLIPS[0]!.deg - 5, BLIPS[0]!.deg, BLIPS[0]!.deg, 0] },
            { duration: seconds, times: [0, 0.22, 0.32, 0.4, 0.75, 1], ease: [ease.in, "easeInOut", "easeOut", "linear", "easeInOut"] },
          ),
          animate(
            sel(BLIPS[0]!.part),
            { opacity: [0, 0, 1, 1, 0, 0], scale: [0.3, 0.3, 2.2, 1.3, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.42, 0.65, 0.85, 1], ease: "easeOut" },
          ),
          animate(
            sel("scope"),
            { scale: [1, 1, 0.92, 1.05, 1, 1] },
            { duration: seconds, times: [0, 0.32, 0.42, 0.55, 0.7, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the dish tips back into the screen: the scope flattens to an ellipse in perspective while the
    // sweep spins twice round it, then it rights itself as every echo lights up
    tilt: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("scope"),
            { scaleY: [1, 0.5, 0.5, 1.08, 1], skewX: [0, -14, -14, 4, 0] },
            { duration: seconds, times: [0, 0.2, 0.7, 0.85, 1], ease: ["easeInOut", "linear", ease.overshoot, "easeOut"] },
          ),
          animate(sel("sweep"), { rotate: [0, 720] }, { duration: seconds * 0.8, delay: seconds * 0.08, ease: "easeInOut" }),
          animate(sel("trail"), { opacity: [0, 1, 1, 0] }, { duration: seconds * 0.8, delay: seconds * 0.08 }),
          ...BLIPS.map(({ part }, i) =>
            animate(
              sel(part),
              { opacity: [0, 1, 0], scale: [0.3, 1.7, 1] },
              { duration: seconds * 0.3, delay: seconds * (0.7 + i * 0.05), ease: "easeOut" },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="scope" style={pivot("50% 50%")}>
      {/* a radar scope is round, so it is a true circle */}
      <circle cx={C} cy={C} r="10" />
      <g fill={slot.accent} stroke="none">
        {BLIPS.map(({ part, x, y }) => (
          <rect key={part} data-part={part} x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
      {/* the sweep turns about the hub: its box ends at the centre, bottom right */}
      <g data-part="sweep" stroke={slot.accent} style={pivot("100% 100%")}>
        <path data-part="trail" d={TRAIL} fill={slot.accent} fillOpacity={0.3} stroke="none" style={flash()} />
        <path d={`M${C} ${C}V${C - 7}`} />
      </g>
      <rect x={C - 1.5} y={C - 1.5} width="3" height="3" fill={slot.accent} stroke="none" />
    </g>
  ),
})
