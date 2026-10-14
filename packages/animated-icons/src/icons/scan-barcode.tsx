"use client";

import { stagger } from "motion/react";

import { createAnimatedIcon } from "../lib/create-icon";
import { ease, flash, pivot, slot } from "../lib/motion";

declare module "../lib/types" {
  interface IconVariants {
    "scan-barcode": "sweep" | "lock" | "tilt";
  }
}

/** Perspective poses for a corner on the left (near first) and on the right (far first) of the tilt. */
const LEFT = { x: [0, -1, 2, 0], scale: [1, 1.15, 0.85, 1] };
const RIGHT = { x: [0, -2, 1, 0], scale: [1, 0.85, 1.15, 1] };

/** The four corner brackets of the scan family, each with the way it closes in and its tilt pose. */
const CORNERS = [
  {
    part: "top-left",
    d: "M3 8V3h5",
    origin: "0% 0%",
    inward: { x: 2, y: 2 },
    tilt: { ...LEFT, y: [0, -1.5, 1.5, 0] },
  },
  {
    part: "top-right",
    d: "M16 3h5v5",
    origin: "100% 0%",
    inward: { x: -2, y: 2 },
    tilt: { ...RIGHT, y: [0, 1.5, -1.5, 0] },
  },
  {
    part: "bottom-right",
    d: "M21 16v5h-5",
    origin: "100% 100%",
    inward: { x: -2, y: -2 },
    tilt: { ...RIGHT, y: [0, -1.5, 1.5, 0] },
  },
  {
    part: "bottom-left",
    d: "M8 21H3v-5",
    origin: "0% 100%",
    inward: { x: 2, y: -2 },
    tilt: { ...LEFT, y: [0, 1.5, -1.5, 0] },
  },
];

/** Three bars of two widths, 2px apart, centred in the window: [x, width]. */
const BARS = [
  [6, 3],
  [11, 2],
  [15, 3],
] as const;

/** 2 colors: brackets and bars (primary), scanner laser (accent). The laser only exists in motion. */
export const ScanBarcode = createAnimatedIcon({
  name: "scan-barcode",
  family: "scan",
  category: "commerce",
  keywords: [
    "barcode scanner",
    "scan",
    "product",
    "checkout",
    "sku",
    "upc",
    "inventory",
    "price check",
  ],
  slots: { primary: "brackets + bars", accent: "scanner laser" },
  defaultVariant: "sweep",
  variants: {
    // a laser sweeps across the code, each bar jumping toward you as it is read, and the brackets
    // snap in once the read is done
    sweep: {
      clip: false,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=laser]",
            { x: [-6, 6], opacity: [0, 1, 1, 0] },
            { duration: seconds * 0.6, ease: "easeInOut" },
          ),
          animate(
            "[data-part=bar]",
            { scale: [1, 1.2, 1] },
            {
              duration: seconds * 0.25,
              delay: stagger(seconds * 0.15, { startDelay: seconds * 0.08 }),
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=brackets]",
            { scale: [1, 1, 0.86, 1.05, 1] },
            {
              duration: seconds,
              times: [0, 0.65, 0.78, 0.9, 1],
              ease: "easeInOut",
            },
          ),
        ]),
    },
    // the brackets close in to lock on and spring back out, as the bars sink away and pop forward
    lock: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...CORNERS.map(({ part, inward }) =>
            animate(
              `[data-part=${part}]`,
              {
                x: [0, inward.x, -inward.x * 0.5, 0],
                y: [0, inward.y, -inward.y * 0.5, 0],
              },
              {
                duration: seconds,
                times: [0, 0.35, 0.65, 1],
                ease: [ease.in, ease.out, "easeInOut"],
              },
            ),
          ),
          animate(
            "[data-part=bar]",
            { scale: [1, 0.7, 1.18, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.35, 0.7, 1],
              delay: stagger(seconds * 0.06, { startDelay: seconds * 0.1 }),
              ease: [ease.in, ease.out, "easeInOut"],
            },
          ),
        ]),
    },
    // swings round its vertical axis in perspective: the brackets loom and recede while the code,
    // further back, slides the other way, then it springs flat
    tilt: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.3, 0.7, 1],
          ease: ["easeInOut" as const, "easeInOut" as const, ease.overshoot],
        };
        return Promise.all([
          ...CORNERS.map(({ part, tilt }) =>
            animate(`[data-part=${part}]`, { ...tilt }, options),
          ),
          animate(
            "[data-part=code]",
            { x: [0, 1.5, -1.5, 0], scaleX: [1, 0.82, 0.82, 1] },
            options,
          ),
        ]);
      },
    },
  },
  render: () => (
    <>
      <g
        data-part="code"
        fill={slot.primary}
        stroke="none"
        style={pivot("50% 50%")}
      >
        {BARS.map(([x, width]) => (
          <rect
            key={x}
            data-part="bar"
            x={x}
            y="7"
            width={width}
            height="10"
            style={pivot("50% 50%")}
          />
        ))}
      </g>
      <path
        data-part="laser"
        d="M12 6v12"
        stroke={slot.accent}
        style={flash()}
      />
      <g data-part="brackets" style={pivot("50% 50%")}>
        {CORNERS.map(({ part, d, origin }) => (
          <path key={part} data-part={part} d={d} style={pivot(origin)} />
        ))}
      </g>
    </>
  ),
});
