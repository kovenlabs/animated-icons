"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"
import { useShapedDrawing } from "../lib/shape"
import { useId } from "react"

declare module "../lib/types" {
  interface IconVariants {
    "video-off": "stop" | "zoom" | "pop"
  }
}

/**
 * The `video` camera, cut 2px clear of the slash: a 6px band along the slash masks it out. The record
 * light is left out, since the band would cut it in half. The band is a `slash` part too, so it draws
 * on, pops and fades with the slash, and the camera only ever moves behind it.
 */
function Drawing() {
  const mask = `video-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask height="32" id={mask} maskUnits="userSpaceOnUse" width="32" x="-4" y="-4">
        <rect fill="#fff" height="32" stroke="none" width="32" x="-4" y="-4" />
        <path d={SLASH} data-part="slash" stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        <g data-part="camera" style={pivot("50% 50%")}>
          {/* the body and lens hood, as in `video` */}
          <path d="M2 6h14v12H2z" />
          <path d="M16 10l6-3v10l-6-3" data-part="lens" style={pivot("0% 50%")} />
        </g>
      </g>
      <path d={SLASH} data-part="slash" stroke={slot.accent} style={pivot("50% 50%")} />
    </>,
  )
}

/** 2 colors: camera (primary), slash (accent). */
export const VideoOff = createAnimatedIcon({
  name: "video-off",
  family: "video",
  category: "media",
  keywords: ["stop recording", "camera off", "video disabled", "no video", "webcam off", "hide camera"],
  slots: { primary: "camera", accent: "slash" },
  defaultVariant: "stop",
  variants: {
    // the slash fades out and strikes across again from the top-left; the camera sinks a little under it
    stop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            {
              duration: seconds * 0.35,
              times: [0, 0.4, 0.55, 1],
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.2, 0.22, 1],
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=camera]",
            { scale: [1, 1, 0.92, 1] },
            {
              duration: seconds,
              times: [0, 0.45, 0.7, 1],
              ease: "easeInOut",
            },
          ),
        ]),
    },
    // the lens hood folds shut behind the slash and opens again
    zoom: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=lens]",
          { scaleY: [1, 0.5, 1] },
          { duration: seconds, times: [0, 0.45, 1], ease: "easeInOut" },
        ),
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
