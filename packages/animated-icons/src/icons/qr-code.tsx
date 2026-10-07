"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "qr-code": "shuffle" | "turn" | "lock"
  }
}

const MODULES = ["m1", "m2", "m3", "m4", "m5", "m6"] as const

/** 2 colors: finder squares (primary), data modules (accent). */
export const QrCode = createAnimatedIcon({
  name: "qr-code",
  category: "commerce",
  keywords: ["qr", "scan", "code", "barcode", "payment", "link", "ticket", "check in"],
  slots: { primary: "finder squares", accent: "data modules" },
  defaultVariant: "shuffle",
  variants: {
    // every data module flips over like a tile, in a wave from the top-left corner, then the finders blink
    shuffle: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...MODULES.map((m, i) =>
            animate(
              `[data-part=${m}]`,
              { scaleX: [1, 0, 1], scaleY: [1, 1.2, 1] },
              { duration: seconds * 0.45, delay: seconds * 0.08 * i, ease: "easeInOut" },
            ),
          ),
          animate(
            "[data-part=finder]",
            { scale: [1, 1, 1.18, 1] },
            { duration: seconds, times: [0, 0.75, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the whole code turns over on its vertical axis, coming toward you as it goes
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=code]",
          { scaleX: [1, -1, 1], scale: [1, 1.1, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // a scanner locks on: the three finders pop one after another, then the data pulses
    lock: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...["tl", "tr", "bl"].map((f, i) =>
            animate(
              `[data-part=finder][data-corner=${f}]`,
              { scale: [1, 1.4, 0.9, 1] },
              {
                duration: seconds * 0.45,
                delay: seconds * 0.15 * i,
                times: [0, 0.4, 0.75, 1],
                ease: ["easeOut", ease.overshoot, "easeOut"],
              },
            ),
          ),
          animate(
            "[data-part=data]",
            { scale: [1, 1, 0.85, 1.06, 1] },
            { duration: seconds, times: [0, 0.6, 0.75, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="code" style={pivot("50% 50%")}>
      {/* three finder squares in the corners, each popping about its own centre */}
      <path data-part="finder" data-corner="tl" d="M3 3h5v5H3z" style={pivot("50% 50%")} />
      <path data-part="finder" data-corner="tr" d="M16 3h5v5h-5z" style={pivot("50% 50%")} />
      <path data-part="finder" data-corner="bl" d="M3 16h5v5H3z" style={pivot("50% 50%")} />
      {/* data modules on a 4-unit grid, each 2 clear of its neighbours and of the finders */}
      <g data-part="data" stroke={slot.accent} style={pivot("50% 50%")}>
        <path data-part="m1" d="M12 3v4" style={pivot("50% 50%")} />
        <path data-part="m2" d="M3 12h4" style={pivot("50% 50%")} />
        <path data-part="m3" d="M12 12h4" style={pivot("50% 50%")} />
        <path data-part="m5" d="M12 16v4" style={pivot("50% 50%")} />
        <path data-part="m4" d="M20 12v4h-4" style={pivot("50% 50%")} />
        <path data-part="m6" d="M19 19h2v2h-2z" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
