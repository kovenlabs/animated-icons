"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot, snap } from "../lib/motion"
import { SLASH } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "mic-off": "mute" | "drop" | "pop"
  }
}

/**
 * The `mic` (capsule, cradle, stand), cut 2px clear of the slash: a 6px band along the slash masks it out.
 * The band is a `slash` part too, so it draws on and pops with the slash, and the mic only ever moves
 * behind it. The level and pulse ticks are left out: an off mic has nothing to show.
 */
function Drawing() {
  const mask = `mic-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        {/* stands on its foot: drops and squashes from there */}
        <g data-part="mic" style={pivot("50% 100%")}>
          {/* drawn square: the renderer rounds its ends */}
          <rect x="9" y="2" width="6" height="12" />
          {/* a squared cradle with chamfered bottom corners, a stem and a foot */}
          <path d="M4 12v3l3 3h10l3-3v-3" />
          <path d="M12 18v3M8 21h8" />
        </g>
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>,
  )
}

/** 2 colors: mic (primary), slash (accent). */
export const MicOff = createAnimatedIcon({
  name: "mic-off",
  family: "mic",
  category: "media",
  keywords: ["mute", "microphone off", "muted", "no audio", "silence", "unmute", "voice off"],
  slots: { primary: "mic", accent: "slash" },
  defaultVariant: "mute",
  variants: {
    // the slash fades and strikes across again from the top-left as the mic sinks back into the screen
    mute: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.3, times: [0, 0.4, 0.55, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.65, times: [0, 0.2, 0.22, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=mic]",
            { scale: [1, 1, 0.72, 0.72, 1], y: [0, 0, -2, -2, 0], opacity: [1, 1, 0.5, 0.5, 1] },
            { duration: seconds, times: [0, 0.25, 0.55, 0.75, 1], ease: ["linear", "easeOut", "linear", ease.overshoot] },
          ),
        ]),
    },
    // mic drop: it tips over and falls out of the bottom, then drops back in from the top and lands with a squash
    drop: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mic]",
            { y: [0, -2, 24, -24, 0, 0], rotate: [0, -6, 25, 0, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.401, 0.7, 1], ease: ["easeOut", ease.in, snap, ease.in, "linear"] },
          ),
          animate(
            "[data-part=mic]",
            { scaleY: [1, 1, 0.8, 1.06, 1], scaleX: [1, 1, 1.12, 0.97, 1] },
            { duration: seconds, times: [0, 0.7, 0.78, 0.9, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the slash springs from its middle and the mic flinches under it
    pop: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { scale: [1, 1.18, 0.94, 1.04, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=mic]",
            { scaleY: [1, 0.86, 1.03, 1] },
            { duration: seconds, times: [0, 0.25, 0.6, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
