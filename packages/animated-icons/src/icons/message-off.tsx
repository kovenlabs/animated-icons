"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot } from "../lib/motion"
import { bubble, SLASH } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "message-off": "mute" | "wiggle" | "pop"
  }
}

/**
 * The `message` bubble, cut 2px clear of the slash: a 6px band along the slash masks it out. The band is
 * a `slash` part too, so it draws on, pops and fades with the slash, and the bubble only ever moves behind it.
 */
function Drawing() {
  const mask = `message-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        {/* the message bubble, pivoting on its tail, bottom-left */}
        <path data-part="message" d={bubble(3, 4, 18, 12)} style={pivot("15% 100%")} />
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  )
}

/** 2 colors: bubble (primary), slash (accent). */
export const MessageOff = createAnimatedIcon({
  name: "message-off",
  family: "message",
  category: "communication",
  keywords: ["chat off", "muted", "comments disabled", "no messages", "silence", "mute chat"],
  slots: { primary: "bubble", accent: "slash" },
  defaultVariant: "mute",
  variants: {
    // the slash fades out and strikes across again from the top-left; the bubble gives one muffled wobble under it
    mute: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.35, times: [0, 0.4, 0.55, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.7, times: [0, 0.2, 0.22, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=message]",
            { rotate: [0, 0, -5, 3, -1, 0] },
            { duration: seconds, times: [0, 0.45, 0.6, 0.75, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the bubble tries to speak up, but only wobbles behind the slash
    wiggle: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=message]", { rotate: [0, -6, 4, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
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
