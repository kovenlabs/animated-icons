"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "radio-tower": "broadcast" | "sweep" | "pulse"
  }
}

/** The beacon, which every arc is centred on. */
const CX = 12
const CY = 7
const HALF = (35 * Math.PI) / 180
const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** A true arc of radius r on one side of the beacon, 35° either side of level, bulging away from it. */
function arc(r: number, side: -1 | 1) {
  const x = fmt(CX + side * r * Math.cos(HALF))
  const dy = r * Math.sin(HALF)
  return `M${x} ${fmt(CY - dy)}A${r} ${r} 0 0 ${side > 0 ? 1 : 0} ${x} ${fmt(CY + dy)}`
}

/** Inner then outer on each side, 4 apart so the gap between them stays 2 clear. */
const ARCS = ([-1, 1] as const).flatMap((side) =>
  [4.5, 8.5].map((r, i) => ({
    part: `arc-${side < 0 ? "left" : "right"}-${i + 1}`,
    d: arc(r, side),
    side,
    ring: i,
    // each arc pivots on its chord, the side facing the beacon
    origin: side < 0 ? "100% 50%" : "0% 50%",
  })),
)

const sel = (part: string) => `[data-part=${part}]`

/** 2 colors: tower (primary), beacon and radio waves (accent). */
export const RadioTower = createAnimatedIcon({
  name: "radio-tower",
  family: "radio",
  category: "communication",
  keywords: ["broadcast", "transmitter", "signal", "antenna", "radio station", "mast", "podcast", "live"],
  slots: { primary: "tower", accent: "beacon + radio waves" },
  defaultVariant: "broadcast",
  variants: {
    // the beacon throbs twice and each time the waves roll outward and toward you, fading as they go,
    // while a fresh ring swells back in behind them, inner ring leading
    broadcast: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("beacon"),
            { scale: [1, 1.7, 1, 1.7, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          ...ARCS.map(({ part, side, ring }) =>
            animate(
              sel(part),
              {
                x: [0, side * 2.5, -side, 0, side * 2.5, -side, 0],
                scale: [1, 1.2, 0.7, 1, 1.2, 0.7, 1],
                opacity: [1, 0, 0, 1, 0, 0, 1],
              },
              {
                duration: seconds * 0.82,
                delay: seconds * 0.08 * ring,
                times: [0, 0.3, 0.32, 0.5, 0.8, 0.82, 1],
                ease: ["easeIn", "linear", "easeOut", "easeIn", "linear", "easeOut"],
              },
            ),
          ),
        ]),
    },
    // a lighthouse beam: the waves on one side swing toward you, big and bright, while the far side
    // shrinks and dims, then the beam comes round to the other side and back to the front
    sweep: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...ARCS.map(({ part, side, ring }) => {
            // near: toward you; far: away. Left side comes round first.
            const near = { x: side * (1 + ring * 0.5), scale: 1.2, opacity: 1 }
            const far = { x: -side * 0.5, scale: 0.75, opacity: 0.25 }
            const [a, b] = side < 0 ? [near, far] : [far, near]
            return animate(
              sel(part),
              {
                x: [0, a.x, b.x, 0],
                scale: [1, a.scale, b.scale, 1],
                opacity: [1, a.opacity, b.opacity, 1],
              },
              { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
            )
          }),
          // the beacon turns with the beam: narrowing as it goes edge-on between the sides
          animate(
            sel("beacon"),
            { scaleX: [1, 0.5, 1, 0.5, 1] },
            { duration: seconds, times: [0, 0.15, 0.5, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the tower crouches and kicks, the beacon flares and the waves light up from the beacon outward
    pulse: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("tower"),
            { scaleY: [1, 0.88, 1.06, 1] },
            { duration: seconds * 0.5, times: [0, 0.35, 0.7, 1], ease: ["easeOut", "easeOut", "easeInOut"] },
          ),
          animate(
            sel("beacon"),
            { scale: [1, 1, 2, 1] },
            { duration: seconds * 0.6, times: [0, 0.3, 0.55, 1], ease: ["linear", "easeOut", ease.overshoot] },
          ),
          ...ARCS.map(({ part, ring }) =>
            animate(
              sel(part),
              { opacity: [1, 0.15, 0.15, 1, 1], scale: [1, 0.85, 0.85, 1.15, 1] },
              {
                duration: seconds,
                times: [0, 0.12, 0.3 + ring * 0.2, 0.5 + ring * 0.2, 0.68 + ring * 0.2],
                ease: ["easeOut", "linear", "easeOut", "easeInOut"],
              },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {/* radio waves are round, so they are true arcs */}
        {ARCS.map(({ part, d, origin }) => (
          <path key={part} data-part={part} d={d} style={pivot(origin)} />
        ))}
      </g>
      {/* a beacon light is round */}
      <circle data-part="beacon" cx={CX} cy={CY} r="1.5" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      <g data-part="tower" style={pivot("50% 100%")}>
        {/* a lattice mast: splayed legs under a flat top, braced by one crossbar */}
        <path d="M8 22l3-9.5h2l3 9.5" />
        <path d="M9.6 17h4.8" />
      </g>
    </>
  ),
})
