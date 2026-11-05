"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    unplug: "unplug" | "dangle" | "spark"
  }
}

type Point = readonly [number, number]

/**
 * The plug and its socket face each other along the diagonal, bottom-left to top-right, centred on
 * (12, 12): `a` along it, `b` across it, in steps of √2 so every corner lands on the half-pixel grid.
 */
const at = (a: number, b: number): Point => [12 + a + b, 12 + b - a]
const line = (points: Point[]) => `M${points.map(([x, y]) => `${x} ${y}`).join("L")}`

/**
 * A head like `plug`'s: a square face 6 across, then two straight chamfers down to the cord, which runs
 * on to the frame's corner. `side` is 1 for the socket (top-right), -1 for the plug (bottom-left).
 */
function head(side: 1 | -1) {
  const a = (n: number) => n * side
  return {
    body: `${line([at(a(3), -3), at(a(5), -3), at(a(6.5), -1.5), at(a(6.5), 1.5), at(a(5), 3), at(a(3), 3)])}Z`,
    cord: line([at(a(6.5), 0), at(a(9), 0)]),
  }
}

const SOCKET = head(1)
const PLUG = head(-1)

/** The plug's two prongs, reaching 2.5 steps from its face toward the socket. */
const PRONGS = line([at(-3, -1.5), at(-0.5, -1.5)]) + line([at(-3, 1.5), at(-0.5, 1.5)])

/** Sparks off either side of the gap, pointing away from it. */
const SPARKS = [line([at(1, -4), at(1, -5.5)]), line([at(1, 4), at(1, 5.5)])]

/** Along the diagonal, in pixels: one step of `a` is (1, -1). */
const tug = (steps: number[]) => ({ x: steps, y: steps.map((s) => -s) })

/** 2 colors: plug, socket and cords (primary), prongs and sparks (accent). */
export const Unplug = createAnimatedIcon({
  name: "unplug",
  category: "devices",
  keywords: ["disconnect", "unplugged", "power off", "offline", "detach", "plug", "connection lost"],
  slots: { primary: "plug + socket + cords", accent: "prongs + sparks" },
  defaultVariant: "unplug",
  variants: {
    // the plug and socket ease toward each other, then spring apart to rest as sparks jump off the gap
    unplug: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.35, 0.45, 0.72, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=plug]", tug([0, 1.5, 1.5, -0.5, 0]), timing),
          animate("[data-part=socket]", tug([0, -1, -1, 0.4, 0]), timing),
          animate("[data-part=spark]", blink, { duration: seconds * 0.4, delay: seconds * 0.45, ease: "easeOut" }),
        ])
      },
    },
    // both ends hang loose and swing on their cords, damped
    dangle: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=plug]", { rotate: [0, 8, -5, 2, 0] }, timing),
          animate("[data-part=socket]", { rotate: [0, 8, -5, 2, 0] }, { ...timing, delay: seconds * 0.06, duration: seconds * 0.94 }),
        ])
      },
    },
    // the prongs are still live: they crackle and sparks jump off the gap twice
    spark: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=prongs]",
            { x: [0, 0.5, -0.4, 0.4, -0.3, 0], y: [0, -0.5, 0.4, -0.4, 0.3, 0] },
            { duration: seconds * 0.6, ease: "linear" },
          ),
          animate(
            "[data-part=spark]",
            { opacity: [0, 1, 0, 1, 0], scale: [0.6, 1.2, 0.6, 1.2, 1.3] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.65, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the socket hangs from its cord's end in the top-right corner, so it swings from there */}
      <g data-part="socket" style={pivot("100% 0%")}>
        <path d={SOCKET.cord} />
        <path d={SOCKET.body} />
      </g>
      {/* the plug hangs from its cord's end in the bottom-left corner */}
      <g data-part="plug" style={pivot("0% 100%")}>
        <path d={PLUG.cord} />
        <path d={PLUG.body} />
        <path data-part="prongs" d={PRONGS} stroke={slot.accent} />
      </g>
      <g stroke={slot.accent}>
        {SPARKS.map((d, i) => (
          <path key={d} data-part="spark" d={d} style={flash(i === 0 ? "100% 100%" : "0% 0%")} />
        ))}
      </g>
    </>
  ),
})
