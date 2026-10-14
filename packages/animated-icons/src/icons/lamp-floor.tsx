"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "lamp-floor": "click" | "nod" | "wobble"
  }
}

/** 2 colors: pole and tripod (primary), shade and light (accent). */
export const LampFloor = createAnimatedIcon({
  name: "lamp-floor",
  family: "lamp",
  category: "home",
  keywords: ["floor lamp", "standing lamp", "light", "lighting", "living room", "furniture", "interior"],
  slots: { primary: "pole + tripod", accent: "shade + light" },
  defaultVariant: "click",
  variants: {
    // switched on: the shade squashes and springs tall, and light flares out from under it twice
    click: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=shade]",
            { scaleY: [1, 0.8, 1.1, 0.96, 1], scaleX: [1, 1.1, 0.94, 1.02, 1] },
            { duration: seconds * 0.7, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ray]",
            { opacity: [0, 1, 0, 1, 0], scale: [0.4, 1.2, 0.5, 1.3, 1.5] },
            { duration: seconds * 0.8, delay: seconds * 0.2, ease: "easeOut" },
          ),
        ]),
    },
    // the shade tips on its joint to look down one side, swings across, and turns back to face you
    nod: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=shade]",
          { rotate: [0, -25, 18, -8, 3, 0], scaleX: [1, 0.85, 0.9, 1, 1, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // bumped: the lamp rocks on its tripod and the shade lags on top of the pole
    wobble: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=lamp]", { rotate: [0, -7, 5, -3, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=shade]",
            { rotate: [0, -6, 8, -4, 1.5, 0] },
            { duration: seconds * 0.92, delay: seconds * 0.08, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* light only exists in motion: two rays below the shade's lip */}
      <g stroke={slot.accent}>
        <path data-part="ray" d="M5 13l-2 2" style={flash("100% 0%")} />
        <path data-part="ray" d="M19 13l2 2" style={flash("0% 0%")} />
      </g>
      <g data-part="lamp" style={pivot("50% 100%")}>
        {/* a tall pole on a tripod, the centre leg carrying straight on to the floor; the pole starts
            inside the shade's rim stroke, so its cap stays hidden when the shade squashes or tips */}
        <path d="M12 9.5V21M12 17l-4 4M12 17l4 4" />
        <path data-part="shade" d="M9 3h6l3 6H6z" stroke={slot.accent} style={pivot("50% 100%")} />
      </g>
    </>
  ),
})
