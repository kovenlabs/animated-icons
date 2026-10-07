"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { slot } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"
import { useId } from "react"

declare module "../lib/types" {
  interface IconVariants {
    printer: "print" | "rumble"
  }
}

/**
 * The printed sheet comes out of a slot: a mask hides everything above the sheet's top edge, so the sheet
 * can slide up into the body and feed back out without crossing the input tray.
 */
function Drawing() {
  const mask = `printer-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <g data-part="printer">
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="13" width="32" height="15" fill="#fff" stroke="none" />
      </mask>
      {/* the input tray, standing on the body's top edge */}
      <path d="M6 9V2h12v7" />
      {/* the body, open along the bottom where the sheet comes out */}
      <path d="M6 18H2V9h20v9h-4" />
      <g mask={`url(#${mask})`}>
        <path data-part="sheet" d="M6 14h12v8H6z" stroke={slot.accent} />
      </g>
    </g>,
  )
}

/** 2 colors: printer (primary), printed sheet (accent). */
export const Printer = createAnimatedIcon({
  name: "printer",
  category: "devices",
  keywords: ["print", "printout", "hard copy", "paper", "document", "output"],
  slots: { primary: "printer", accent: "printed sheet" },
  defaultVariant: "print",
  variants: {
    // the sheet is drawn back into the slot, then fed out again a line at a time
    print: {
      clip: false,
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sheet]",
          { y: [0, -9, -9, -6, -6, -3, -3, 0] },
          {
            duration: seconds,
            times: [0, 0.18, 0.3, 0.45, 0.55, 0.7, 0.8, 1],
            ease: "easeInOut",
          },
        ),
    },
    // the printer hums while it works: a short shudder side to side
    rumble: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=printer]", { x: [0, -1, 1, -1, 1, -0.5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => <Drawing />,
})
