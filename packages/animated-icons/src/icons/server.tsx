"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    server: "blink" | "slide"
  }
}

/**
 * One rack unit, its top edge at `y`: a 7-tall case, two status lights and a drive bay. A plain
 * function, not a component, so the drawing's corner shaping reaches inside it.
 */
function unit(y: number, part: string) {
  return (
    <g data-part={part} style={pivot("50% 50%")}>
      <path d={`M2 ${y}h20v7H2Z`} />
      <path d={`M14 ${y + 3.5}h4`} stroke={slot.secondary} />
      <g fill={slot.accent} stroke="none">
        <rect data-part={`${part}-light`} x="5" y={y + 2.5} width="2" height="2" />
        <rect data-part={`${part}-light`} x="9" y={y + 2.5} width="2" height="2" />
      </g>
    </g>
  )
}

/** 3 colors: rack units (primary), drive bays (secondary), status lights (accent). */
export const Server = createAnimatedIcon({
  name: "server",
  category: "development",
  keywords: ["rack", "hosting", "backend", "data center", "database", "infrastructure", "cloud server"],
  slots: { primary: "rack units", secondary: "drive bays", accent: "status lights" },
  defaultVariant: "blink",
  variants: {
    // the status lights blink with traffic, the two units answering each other
    blink: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const blink = { opacity: [1, 0, 1, 0, 1] }
        const timing = { duration: seconds * 0.7, times: [0, 0.2, 0.45, 0.7, 1], ease: "linear" as const }
        return Promise.all([
          animate("[data-part=top-light]", blink, timing),
          animate("[data-part=bottom-light]", blink, { ...timing, delay: seconds * 0.15 }),
        ])
      },
    },
    // the top unit is pulled up out of the rack and slid back down into its slot
    slide: {
      duration: 900,
      clip: true,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=top]",
          { y: [0, -11, -11, 0] },
          { duration: seconds, times: [0, 0.35, 0.5, 1], ease: ["easeIn", "linear", "easeOut"] },
        ),
    },
  },
  render: () => (
    <>
      {unit(3, "top")}
      {unit(14, "bottom")}
    </>
  ),
})
