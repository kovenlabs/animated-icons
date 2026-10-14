"use client";

import { stagger } from "motion/react";

import { createAnimatedIcon } from "../lib/create-icon";
import { ease, flash, pivot, slot } from "../lib/motion";

declare module "../lib/types" {
  interface IconVariants {
    glasses: "glint" | "tilt" | "unfold";
  }
}

/** 2 colors: frame (primary), glint (accent). The glint only exists in motion. */
export const Glasses = createAnimatedIcon({
  name: "glasses",
  category: "commerce",
  keywords: [
    "spectacles",
    "eyewear",
    "eyeglasses",
    "optician",
    "reading",
    "vision",
    "nerd",
    "accessory",
  ],
  slots: { primary: "frame", accent: "glint" },
  defaultVariant: "glint",
  variants: {
    // the frame tips to catch the light and a glint streaks across one lens, then the other
    glint: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glint]",
            { x: [-2, 2], opacity: [0, 1, 0], scale: [0.6, 1.1, 0.8] },
            {
              duration: seconds * 0.5,
              delay: stagger(seconds * 0.22, { startDelay: seconds * 0.15 }),
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=frame]",
            { rotate: [0, -7, 3, 0], scale: [1, 1.06, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // turns its head in perspective: one lens looms as the other recedes, then the other way, and it
    // springs flat
    tilt: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.3, 0.7, 1],
          ease: ["easeInOut" as const, "easeInOut" as const, ease.overshoot],
        };
        return Promise.all([
          animate(
            "[data-part=side-left]",
            { scale: [1, 1.2, 0.8, 1] },
            options,
          ),
          animate(
            "[data-part=side-right]",
            { scale: [1, 0.8, 1.2, 1] },
            options,
          ),
          animate("[data-part=frame]", { skewY: [0, 5, -5, 0] }, options),
        ]);
      },
    },
    // the arms fold shut behind the lenses, swing back open past straight and settle, and the frame
    // bounces as they lock
    unfold: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.25, 0.45, 0.75, 1],
          ease: [
            ease.in,
            "linear" as const,
            ease.overshoot,
            "easeOut" as const,
          ],
        };
        return Promise.all([
          animate(
            "[data-part=temple]",
            { scaleX: [1, 0.2, 0.2, 1.2, 1] },
            options,
          ),
          animate(
            "[data-part=frame]",
            { y: [0, 0, 0, -2, 0], scaleY: [1, 1, 1, 0.9, 1] },
            options,
          ),
        ]);
      },
    },
  },
  render: () => (
    <g data-part="frame" style={pivot("50% 50%")}>
      {/* each side (lens and arm) scales from where the bridge meets it */}
      <g data-part="side-left" style={pivot("100% 54%")}>
        <path d="M2 11h8v7H2Z" />
        <path data-part="temple" d="M2 11l3-5h2" style={pivot("0% 100%")} />
        <path
          data-part="glint"
          d="M5 16l2.5-2.5"
          stroke={slot.accent}
          style={flash()}
        />
      </g>
      <g data-part="side-right" style={pivot("0% 54%")}>
        <path d="M14 11h8v7h-8Z" />
        <path
          data-part="temple"
          d="M22 11l-3-5h-2"
          style={pivot("100% 100%")}
        />
        <path
          data-part="glint"
          d="M17 16l2.5-2.5"
          stroke={slot.accent}
          style={flash()}
        />
      </g>
      <path d="M10 12.5l2-1.5 2 1.5" />
    </g>
  ),
});
