"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "timer-off": "stop" | "rattle" | "pop"
  }
}

/**
 * The `timer`, cut 2px clear of the slash: a 6px band along the slash masks it out. The hand is left
 * out, since its foot sits on the slash. The band is a `slash` part too, so it draws on, pops and fades
 * with the slash, and the watch only ever moves behind it.
 */
function Drawing() {
  const mask = `timer-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        <g data-part="timer" style={pivot("50% 50%")}>
          {/* the start button floats over the crown, 2 clear of the case */}
          <path data-part="button" d="M10 2h4" />
          {/* a stopwatch case is round, so it gets a true circle */}
          <circle cx="12" cy="14" r="8" />
        </g>
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>,
  )
}

/** 2 colors: case and button (primary), slash (accent). */
export const TimerOff = createAnimatedIcon({
  name: "timer-off",
  family: "timer",
  category: "time",
  keywords: ["stopwatch off", "timer stopped", "no timer", "cancel timer", "no time limit", "paused", "deadline off"],
  slots: { primary: "case + button", accent: "slash" },
  defaultVariant: "stop",
  variants: {
    // the button is pressed home and the slash strikes across again from the top-left, stopping the watch
    stop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=button]",
            { y: [0, 1.5, -0.5, 0] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.7, 1], ease: ["easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.4, 0.6, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.8, times: [0, 0.3, 0.32, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the alarm tries to go off, but only rattles: a small, damped jolt
    rattle: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=timer]", { rotate: [0, -6, 5, -3, 1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the slash presses in from its middle
    pop: {
      duration: 450,
      run: ({ animate, seconds }) =>
        animate("[data-part=slash]", { scale: [1, 1.08, 1] }, { duration: seconds, ease: ease.out }),
    },
  },
  render: () => <Drawing />,
})
