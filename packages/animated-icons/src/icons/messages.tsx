"use client"

import { stagger } from "motion/react"
import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot } from "../lib/motion"
import { bubble, dots } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    messages: "reply" | "typing" | "nudge"
  }
}

/** The reply, in front (top-right, tail right): wide enough for three dots 2px clear of its sides. */
const REPLY = bubble(6, 2, 16, 8, "right")
/** The first message behind it (bottom-left, tail left): its tail stays clear of the reply and rakes like the reply's. */
const BACK = bubble(2, 6, 16, 9)
/** The reply grows from the tip of its tail: (19, 14) in its 16 × 12 box. */
const REPLY_PIVOT = pivot("81.25% 100%")

/** One typing beat: a dot dims and lifts 1px (its bubble is too short for the 2px hop of `message`). */
const TYPE = { opacity: [1, 0.35, 1], y: [0, -1, 0] }

/**
 * The back bubble is masked by a 6px band around the reply, so its lines stop 2px short of the reply's
 * stroke. The band is a `reply` part too: it moves and scales with the reply, so whatever the reply
 * covers mid-animation is exactly what the back bubble loses, and nothing ever crosses.
 */
function Drawing() {
  const mask = `messages-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        {/* the band's mitered tail tip cuts the back bubble's bottom edge parallel to the reply's tail */}
        <path data-part="reply" d={REPLY} fill="#000" stroke="#000" strokeWidth={6} style={REPLY_PIVOT} />
      </mask>
      {/* the mask stays put on the outer group; the bubble moves inside it, behind the reply */}
      <g mask={`url(#${mask})`}>
        <path data-part="back" d={BACK} />
      </g>
      <g data-part="reply" stroke={slot.secondary} style={REPLY_PIVOT}>
        <path d={REPLY} />
        <g fill={slot.accent} stroke="none">
          {dots(14, 6).map(({ x, y }) => (
            <rect key={x} data-part="dot" x={x} y={y} width="2" height="2" style={pivot("50% 50%")} />
          ))}
        </g>
      </g>
    </>
  )
}

/** 3 colors: first message (primary), reply (secondary), typing dots (accent). */
export const MessagesIcon = createAnimatedIcon({
  name: "messages",
  family: "message",
  category: "communication",
  keywords: ["chat", "conversation", "reply", "thread", "discussion", "typing", "dm"],
  slots: { primary: "first message", secondary: "reply", accent: "typing dots" },
  defaultVariant: "reply",
  variants: {
    // the reply pops in from its tail, then its dots type; it never grows past full size toward the back bubble
    reply: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=reply]", { scale: [0, 1] }, { duration: seconds * 0.4, ease: ease.out }),
          animate("[data-part=dot]", TYPE, {
            duration: seconds * 0.4,
            delay: stagger(seconds * 0.12, { startDelay: seconds * 0.35 }),
            ease: "easeInOut",
          }),
        ]),
    },
    // the dots dim and lift one after another, like someone typing
    typing: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=dot]", TYPE, { duration: seconds * 0.6, delay: stagger(seconds * 0.2), ease: "easeInOut" }),
    },
    // the first message bobs up and settles, sliding behind the reply: the mask keeps it cut 2px clear
    nudge: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=back]", { y: [0, -2, 0.5, 0] }, { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" }),
    },
  },
  render: () => <Drawing />,
})
