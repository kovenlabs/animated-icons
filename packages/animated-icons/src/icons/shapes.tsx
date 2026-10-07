"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    shapes: "spin" | "pop" | "tilt"
  }
}

/** 3 colors: square (primary), circle (secondary), triangle (accent). */
export const Shapes = createAnimatedIcon({
  name: "shapes",
  category: "design",
  keywords: ["triangle square circle", "geometry", "objects", "elements", "primitives", "toys", "design", "assets"],
  slots: { primary: "square", secondary: "circle", accent: "triangle" },
  defaultVariant: "spin",
  variants: {
    // one after another, each shape turns over on its own axis and swells toward you as it goes: the
    // triangle and the circle turn like coins, the square tumbles head over heels
    spin: {
      duration: 1350,
      run: ({ animate, seconds }) =>
        Promise.all(
          (["triangle", "square", "circle"] as const).map((part, i) =>
            animate(
              `[data-part=${part}]`,
              part === "square"
                ? { scaleY: [1, 0, -1, 0, 1], scaleX: [1, 1.15, 1.15, 1.15, 1] }
                : { scaleX: [1, 0, -1, 0, 1], scaleY: [1, 1.15, 1.15, 1.15, 1] },
              { duration: seconds * 0.5, delay: seconds * 0.25 * i, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
            ),
          ),
        ),
    },
    // each shape sinks away into the page and springs back out past its size, in turn
    pop: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=shape]",
          { scale: [1, 0.2, 1.25, 1] },
          { duration: seconds * 0.6, delay: stagger(seconds * 0.2), times: [0, 0.35, 0.7, 1], ease: ["easeIn", ease.out, "easeInOut"] },
        ),
    },
    // the whole set tips back on its base like a card, then springs upright past straight
    tilt: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=shapes]",
          { scaleY: [1, 0.62, 1.08, 0.97, 1], skewX: [0, -16, 5, -1.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.62, 0.82, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="shapes" style={pivot("50% 100%")}>
      <g data-part="shape" style={pivot("50% 50%")}>
        {/* 2 clear above the square and the circle */}
        <path data-part="triangle" d="M12 2.5l5 8H7z" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
      <g data-part="shape" style={pivot("50% 50%")}>
        <path data-part="square" d="M3 14.5h7v7H3z" style={pivot("50% 50%")} />
      </g>
      <g data-part="shape" style={pivot("50% 50%")}>
        <circle data-part="circle" cx={17.5} cy={18} r={3.5} stroke={slot.secondary} style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
