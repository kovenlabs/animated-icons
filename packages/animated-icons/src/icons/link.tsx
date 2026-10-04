"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    link: "bend" | "pull"
  }
}

type Point = readonly [number, number]

/**
 * The chain runs along the diagonal, bottom-left to top-right. Points are given in chain coordinates:
 * `a` along the chain, `b` across it, in steps of √2 so every corner lands on the half-pixel grid.
 */
const at = (a: number, b: number): Point => [2 + a + b, 12.5 + b - a]
const box = (a0: number, a1: number, b0: number, b1: number) => [at(a0, b0), at(a1, b0), at(a1, b1), at(a0, b1)]
const outline = (points: Point[]) => `M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z`

/**
 * Two square-cornered links, 6 wide (8.5px) so a strand fits through each with 2px to spare. The front
 * link is offset half a width across and 3.5 along, so each one's end sits inside the other's loop.
 */
const BACK = box(0, 7, 0, 6)
const FRONT = box(3.5, 10.5, 3, 9)

/**
 * Where a strand passes under the other link, the other link carries a mask band that cuts it 1.5px
 * clear either side (a weave break: 2px would leave the corners only stubs). The band moves with the link on top, so the break follows it through any pull.
 * `under` is the across-coordinate of the strand being cut; `over` the along-coordinate of the edge on top.
 */
const GAP = 2.5 / Math.SQRT2 // 1px of stroke + 1.5px of clearance, in chain steps
const band = (over: number, under: number) => box(over - GAP, over + GAP, under - 1.25, under + 1.25)
/** The back link's far end crosses over the front link's near strand... */
const OVER_FRONT = band(7, 3)
/** ...and the front link's near end crosses over the back link's far strand: over, then under, they interlock. */
const OVER_BACK = band(3.5, 6)

/** The joint, the middle of the overlap: both links bend about it. */
const JOINT = at(5.25, 4.5)

/** A pivot at the joint, relative to a shape's own box (motion transforms SVG parts about their fill-box). */
function aboutJoint(points: Point[]) {
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)]
  const pct = (v: number, min: number, size: number) => `${(((v - min) / size) * 100).toFixed(2)}%`
  return pivot(`${pct(JOINT[0], x0, Math.max(...xs) - x0)} ${pct(JOINT[1], y0, Math.max(...ys) - y0)}`)
}

const points = (shape: Point[]) => shape.map(([x, y]) => `${x},${y}`).join(" ")

function Drawing() {
  const id = useId().replace(/[^\w-]/g, "")
  const [cutBack, cutFront] = [`link-back-${id}`, `link-front-${id}`]
  const mask = (name: string, cutter: Point[], part: string) => (
    <mask id={name} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
      <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
      {/* a polygon, not a path: the band is a mask, its corners must stay exactly as drawn */}
      <polygon data-part={part} points={points(cutter)} fill="#000" stroke="none" style={aboutJoint(cutter)} />
    </mask>
  )
  // drawn in its own component (for the mask ids), so it shapes its corners from context
  return useShapedDrawing(
    <>
      {mask(cutBack, OVER_BACK, "front")}
      {mask(cutFront, OVER_FRONT, "back")}
      {/* the masks stay put on the outer groups; the links move inside them */}
      <g mask={`url(#${cutBack})`}>
        <path data-part="back" d={outline(BACK)} style={aboutJoint(BACK)} />
      </g>
      <g mask={`url(#${cutFront})`}>
        <path data-part="front" d={outline(FRONT)} stroke={slot.accent} style={aboutJoint(FRONT)} />
      </g>
    </>,
  )
}

/** Along the chain, in pixels: one step of `a` is (1, -1). */
const tug = (steps: number[]) => ({ x: steps, y: steps.map((s) => -s) })

/** 2 colors: one link each, back (primary) and front (accent). */
export const Link = createAnimatedIcon({
  name: "link",
  category: "actions",
  keywords: ["chain", "url", "hyperlink", "connect", "attach", "join", "permalink"],
  slots: { primary: "back link", accent: "front link" },
  defaultVariant: "bend",
  variants: {
    // the chain flexes at the joint, both ends lifting, and straightens out
    bend: {
      duration: 800,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=back]", { rotate: [0, 6, -2, 0] }, timing),
          animate("[data-part=front]", { rotate: [0, -6, 2, 0] }, timing),
        ])
      },
    },
    // tugged apart until the loops catch, then they snap back together and settle; the slack is
    // short (each break has to keep clear of the corners), so the tug is small
    pull: {
      duration: 650,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=back]", tug([0, -0.45, 0.15, 0]), timing),
          animate("[data-part=front]", tug([0, 0.45, -0.15, 0]), timing),
        ])
      },
    },
  },
  render: () => <Drawing />,
})
