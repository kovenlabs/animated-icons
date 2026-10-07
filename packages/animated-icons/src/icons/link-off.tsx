"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "link-off": "snap" | "dangle" | "spark"
  }
}

type Point = readonly [number, number]

/**
 * Like `link`, the chain runs along the diagonal, bottom-left to top-right, but centred on (12, 12):
 * `a` along the chain, `b` across it, in steps of √2 so every corner lands on the half-pixel grid.
 */
const at = (a: number, b: number): Point => [12 + a + b, 12 + b - a]
const box = (a0: number, a1: number, b0: number, b1: number) => [at(a0, b0), at(a1, b0), at(a1, b1), at(a0, b1)]
const outline = (points: Point[]) => `M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z`

/** Two square-cornered links, 6.5 along and 4 across, their facing ends 3 steps (4.2px) apart. */
const BACK = box(-8, -1.5, -2, 2)
const FRONT = box(1.5, 8, -2, 2)

/** Along the chain, in pixels: one step of `a` is (1, -1). */
const tug = (steps: number[]) => ({ x: steps, y: steps.map((s) => -s) })

/** 2 colors: links (primary), break sparks (accent). */
export const LinkOff = createAnimatedIcon({
  name: "link-off",
  family: "link",
  category: "actions",
  keywords: ["unlink", "disconnect", "detach", "broken link", "remove link", "break", "separate"],
  slots: { primary: "links", accent: "break sparks" },
  defaultVariant: "snap",
  variants: {
    // the links ease together, then spring apart to rest as the sparks burst out of the break
    snap: {
      duration: 800,
      run: ({ animate, seconds }) => {
        const timing = {
          duration: seconds,
          times: [0, 0.35, 0.5, 0.75, 1],
          ease: "easeInOut" as const,
        }
        return Promise.all([
          animate("[data-part=back]", tug([0, 0.75, 0.75, -0.25, 0]), timing),
          animate("[data-part=front]", tug([0, -0.75, -0.75, 0.25, 0]), timing),
          animate("[data-part=spark]", { scale: [1, 0, 0, 1.2, 1] }, { ...timing, ease: ease.out }),
        ])
      },
    },
    // the loose ends sag from their outer ends, like a broken chain, and swing still
    dangle: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=back]", { rotate: [0, 8, -4, 2, 0] }, timing),
          animate("[data-part=front]", { rotate: [0, -8, 4, -2, 0] }, timing),
        ])
      },
    },
    // the sparks flicker out and flare back from the break
    spark: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=spark]",
          { scale: [1, 0.2, 1.3, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* each link pivots on the middle of its outer end, so its loose end swings */}
      <path data-part="back" d={outline(BACK)} style={pivot("19.05% 80.95%")} />
      <path data-part="front" d={outline(FRONT)} style={pivot("80.95% 19.05%")} />
      <g stroke={slot.accent}>
        {/* two sparks either side of the break, square to each other and scaling from the gap */}
        <path data-part="spark" d="M8 2.5v3M2.5 8h3" style={pivot("100% 100%")} />
        <path data-part="spark" d="M16 18.5v3M18.5 16h3" style={pivot("0% 0%")} />
      </g>
    </>
  ),
})
