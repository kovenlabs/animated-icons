"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "calendar-off": "strike" | "flip" | "shake"
  }
}

/**
 * The `calendar`, cut 2px clear of the slash: a 6px band along the slash masks it out. The left binder
 * ring sits right on the slash, so (like the cut corners) it is left out; the band is a `slash` part
 * too, so it draws on and fades with the slash.
 */
function Drawing() {
  const mask = `calendar-off-${useId().replace(/[^\w-]/g, "")}`
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        <g data-part="calendar" style={pivot("50% 50%")}>
          <rect x="3" y="4" width="18" height="18" />
          <path d="M3 10h18" />
          <path d="M16 2v4" stroke={slot.secondary} />
          <g data-part="page" fill={slot.primary} stroke="none" style={pivot("50% 0%")}>
            <rect x="6" y="13" width="2" height="2" />
            <rect x="6" y="17" width="2" height="2" />
            <rect x="10" y="17" width="2" height="2" />
          </g>
        </g>
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>,
  )
}

/** 3 colors: frame (primary), binder ring (secondary), slash (accent). */
export const CalendarOff = createAnimatedIcon({
  name: "calendar-off",
  family: "calendar",
  category: "time",
  keywords: ["no events", "unavailable", "day off", "holiday", "cancelled", "closed", "absence"],
  slots: { primary: "frame + days", secondary: "binder ring", accent: "slash" },
  defaultVariant: "strike",
  variants: {
    // the slash fades out and strikes across the calendar again from the top-left
    strike: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.4, 0.55, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.8, times: [0, 0.2, 0.22, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the page folds up into the header and a fresh, still empty one drops back down
    flip: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=page]",
          { scaleY: [1, 0, 1], opacity: [1, 0.3, 1] },
          { duration: seconds, times: [0, 0.45, 1], ease: "easeInOut" },
        ),
    },
    // the calendar gives a small, damped "no" shake behind the slash
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=calendar]", { rotate: [0, -6, 5, -3, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => <Drawing />,
})
