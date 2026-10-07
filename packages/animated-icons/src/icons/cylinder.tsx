"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"
import { marks } from "../lib/turntable"

declare module "../lib/types" {
  interface IconVariants {
    cylinder: "spin" | "tumble" | "squish"
  }
}

/** A drum 18 wide and 14 tall, its rims ellipses 6 deep: the top one centred at y 5, the bottom at 19. */
const RX = 9
const RY = 3
const TOP = 5
const BOTTOM = 19

/** Seams every 60° round the drum; the two at ±30° face you, 9 apart and 4.5 clear of the walls. */
const SEAMS = [-150, -90, -30, 30, 90, 150]
const rad = (deg: number) => (deg * Math.PI) / 180

/** A seam's foot and head both ride the rims, so it slides across and dips as the drum turns. */
const at = (angle: number) => ({ x: 12 + RX * Math.sin(rad(angle)), y: RY * Math.cos(rad(angle)) })

/** Lit while it faces you, faded out as it rounds the wall (between 50° and 80° off the front). */
const lit = (angle: number) =>
  Math.min(1, Math.max(0, (Math.cos(rad(angle)) - Math.cos(rad(80))) / (Math.cos(rad(50)) - Math.cos(rad(80)))))

/** Each seam is drawn where it rests, and moved from there. */
const SPIN = marks(SEAMS, 120, (angle, start) => ({
  x: at(angle).x - at(start).x,
  y: at(angle).y - at(start).y,
  opacity: lit(angle),
}))

/** One full tumble, sampled every 45°: the drum's height on screen is the cosine of the turn. */
const TUMBLE = Array.from({ length: 9 }, (_, i) => Number(Math.cos((i * Math.PI) / 4).toFixed(2)))

/** 2 colors: drum (primary), seams (accent). */
export const Cylinder = createAnimatedIcon({
  name: "cylinder",
  category: "design",
  keywords: ["3d", "shape", "solid", "geometry", "can", "tube", "drum", "pipe"],
  slots: { primary: "drum", accent: "seams" },
  defaultVariant: "spin",
  variants: {
    // the drum spins on its axis: its seams slide round the front, fade off round the wall and new ones come
    // round from behind
    spin: {
      clip: false,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          SPIN.keyframes.map((keyframes, i) =>
            animate(`[data-part=seam${i}]`, keyframes, { duration: seconds, times: SPIN.times, ease: SPIN.ease }),
          ),
        ),
    },
    // tossed up, it tumbles end over end in the air and lands on its base
    tumble: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cylinder]",
            { y: [0, -3.5, -3.5, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.85, 1], ease: ["easeOut", "linear", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=cylinder]",
            { scaleY: [1, ...TUMBLE, 1] },
            { duration: seconds, times: [0, ...TUMBLE.map((_, i) => 0.1 + (0.72 * i) / 8), 1], ease: "linear" },
          ),
          animate(
            "[data-part=drum]",
            { scaleY: [1, 1, 0.9, 1] },
            { duration: seconds, times: [0, 0.85, 0.92, 1], ease: "easeOut" },
          ),
        ]),
    },
    // pressed flat from above, it bulges out and springs back, wobbling to a stop
    squish: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=drum]",
          { scaleY: [1, 0.7, 1.12, 0.94, 1.03, 1], scaleX: [1, 1.14, 0.94, 1.03, 0.99, 1] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.72, 0.87, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="cylinder" style={pivot("50% 50%")}>
      <g data-part="drum" style={pivot("50% 100%")}>
        {/* a drum is round, so its rims are a true ellipse and an elliptical arc */}
        <ellipse cx="12" cy={TOP} rx={RX} ry={RY} />
        <path d={`M${12 - RX} ${TOP}V${BOTTOM}A${RX} ${RY} 0 0 0 ${12 + RX} ${BOTTOM}V${TOP}`} />
        <g stroke={slot.accent}>
          {SEAMS.map((angle, i) => {
            const { x, y } = at(angle)
            return (
              <path
                key={angle}
                data-part={`seam${i}`}
                d={`M${x.toFixed(2)} ${(TOP + y).toFixed(2)}V${(BOTTOM + y).toFixed(2)}`}
                style={lit(angle) === 1 ? undefined : { opacity: 0 }}
              />
            )
          })}
        </g>
      </g>
    </g>
  ),
})
