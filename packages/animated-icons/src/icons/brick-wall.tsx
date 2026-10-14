"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "brick-wall": "build" | "spin" | "punch"
  }
}

/**
 * The three courses, top to bottom. Each owns its sides and the bed line on top of it (the bottom course owns
 * the base too), so they move as rows without leaving a seam, and every head joint's ends are painted over by a
 * bed line drawn after it. The inner bed lines are separate strokes, so no corner gets rounded into the sides.
 * `drop` lifts a course just clear of the frame's top edge (stroke included), `start` is when it falls: the bottom course is laid first.
 */
const COURSES = [
  { d: "M3 9V3h18v6", joints: "M8 3v6M16 3v6", drop: 11, start: 0.6 },
  { d: "M3 9h18M3 9v6M21 9v6", joints: "M12 9v6", drop: 17, start: 0.38 },
  { d: "M3 15h18M3 15v6h18v-6", joints: "M8 15v6M16 15v6", drop: 23, start: 0.16 },
] as const

const course = (i: number) => `[data-part=course]:nth-of-type(${i + 1})`

/** 2 colors: courses (primary), head joints (accent). */
export const BrickWall = createAnimatedIcon({
  name: "brick-wall",
  category: "security",
  keywords: ["firewall", "wall", "bricks", "barrier", "masonry", "construction", "block", "protection"],
  slots: { primary: "courses", accent: "head joints" },
  defaultVariant: "build",
  variants: {
    // the wall crumbles down out of the frame, then is relaid course by course from the bottom, each one dropping
    // in from above and squashing as it lands
    build: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all(
          COURSES.map(({ drop, start: s }, i) =>
            animate(
              course(i),
              {
                y: [0, 2, -drop, -drop, 0, 0, 0, 0],
                opacity: [1, 0, 0, 1, 1, 1, 1, 1],
                scaleY: [1, 1, 1, 1, 1, 0.75, 1, 1],
                scaleX: [1, 1, 1, 1, 1, 1.06, 1, 1],
              },
              {
                duration: seconds,
                times: [0, 0.12, s - 0.01, s, s + 0.2, s + 0.27, s + 0.36, 1],
                ease: ["easeIn", "linear", "linear", ease.in, "easeOut", "easeOut", "linear"],
              },
            ),
          ),
        ),
    },
    // the wall turns all the way round on its centre like a panel, shrinking a little as it goes edge-on
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=wall]",
          { scaleX: [1, 0, -1, 0, 1], scaleY: [1, 0.9, 1, 0.9, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the middle course is shoved out toward you, the courses above and below give way, and it slams back in
    punch: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            course(1),
            { scale: [1, 1.12, 0.96, 1.02, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
          ),
          animate(course(0), { y: [0, -0.8, 0.3, 0] }, { duration: seconds * 0.75, ease: "easeInOut" }),
          animate(course(2), { y: [0, 0.8, -0.3, 0] }, { duration: seconds * 0.75, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="wall" style={pivot("50% 50%")}>
      {COURSES.map(({ d, joints }) => (
        <g key={d} data-part="course" style={pivot("50% 100%")}>
          {/* joints first, under their own course's bed line and the next one's */}
          <path d={joints} stroke={slot.accent} />
          <path d={d} />
        </g>
      ))}
    </g>
  ),
})
