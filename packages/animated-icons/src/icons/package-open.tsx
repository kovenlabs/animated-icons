"use client";

import { createAnimatedIcon } from "../lib/create-icon";
import { pivot, slot } from "../lib/motion";

declare module "../lib/types" {
  interface IconVariants {
    "package-open": "flap" | "pop" | "shake";
  }
}

/** 2 colors: box (primary), flaps (accent). */
export const PackageOpen = createAnimatedIcon({
  name: "package-open",
  family: "package",
  category: "commerce",
  keywords: [
    "unboxing",
    "open box",
    "parcel",
    "delivery",
    "unpack",
    "shipping",
    "received",
    "cardboard",
  ],
  slots: { primary: "box", accent: "flaps" },
  defaultVariant: "flap",
  variants: {
    // the flaps fold shut toward you one after the other and fling back open past their rest, and
    // the box gives under the slam
    flap: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds * 0.75,
          times: [0, 0.35, 0.65, 0.85, 1],
          ease: "easeInOut" as const,
        };
        return Promise.all([
          animate(
            "[data-part=flap-left]",
            { scaleY: [1, 0.15, 1.25, 0.92, 1], skewX: [0, 0, -10, 4, 0] },
            options,
          ),
          animate(
            "[data-part=flap-right]",
            { scaleY: [1, 0.15, 1.25, 0.92, 1], skewX: [0, 0, 10, -4, 0] },
            { ...options, delay: seconds * 0.12 },
          ),
          animate(
            "[data-part=body]",
            { scaleY: [1, 1, 0.9, 1.03, 1], scaleX: [1, 1, 1.06, 0.99, 1] },
            {
              duration: seconds,
              times: [0, 0.3, 0.45, 0.65, 1],
              ease: "easeOut",
            },
          ),
        ]);
      },
    },
    // hops off the floor and lands squashed, the flaps flung up and flapping a beat behind
    pop: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.18, 0.45, 0.7, 1],
          ease: "easeInOut" as const,
        };
        return Promise.all([
          animate(
            "[data-part=box]",
            {
              y: [0, 1, -4, 0, 0],
              scaleY: [1, 0.86, 1.1, 0.84, 1],
              scaleX: [1, 1.08, 0.94, 1.12, 1],
            },
            options,
          ),
          animate(
            "[data-part=flap-left]",
            { scaleY: [1, 1, 0.7, 1.3, 1], skewX: [0, 0, 8, -8, 0] },
            options,
          ),
          animate(
            "[data-part=flap-right]",
            { scaleY: [1, 1, 0.7, 1.3, 1], skewX: [0, 0, -8, 8, 0] },
            options,
          ),
        ]);
      },
    },
    // rattled side to side on its base, the loose flaps whipping the opposite way (their skew leans
    // against the tilt, which also keeps the flap tips inside the frame)
    shake: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, ease: "easeInOut" as const };
        return Promise.all([
          animate(
            "[data-part=box]",
            { rotate: [0, -8, 7, -5, 4, -1, 0] },
            options,
          ),
          animate(
            "[data-part=flap-left]",
            { skewX: [0, -14, 12, -9, 5, -2, 0] },
            options,
          ),
          animate(
            "[data-part=flap-right]",
            { skewX: [0, -14, 12, -9, 5, -2, 0] },
            options,
          ),
        ]);
      },
    },
  },
  render: () => (
    <g data-part="box" style={pivot("50% 100%")}>
      {/* the box from the front, its top edge the hinge both flaps open from */}
      <path data-part="body" d="M4 11h16v10H4Z" style={pivot("50% 100%")} />
      <g stroke={slot.accent}>
        <path
          data-part="flap-left"
          d="M4 11L2 6h7l3 5"
          style={pivot("50% 100%")}
        />
        <path
          data-part="flap-right"
          d="M20 11l2-5h-7l-3 5"
          style={pivot("50% 100%")}
        />
      </g>
    </g>
  ),
});
