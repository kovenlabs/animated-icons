"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    nfc: "pulse" | "tap" | "flip"
  }
}

const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** A true arc standing on x, 2h tall, bulging b to the right. */
function arc(x: number, h: number, b: number) {
  const r = (h * h + b * b) / (2 * b)
  return `M${x} ${12 - h}A${fmt(r)} ${fmt(r)} 0 0 1 ${x} ${12 + h}`
}

/** Inner to outer: each wave taller and rounder than the last, 4 apart. */
const WAVES = [arc(4, 3.5, 1.5), arc(8, 5.5, 2.2), arc(12, 7.5, 3), arc(16, 9.5, 3.8)]

const sel = (i: number) => `[data-part=wave-${i + 1}]`

/** Every wave, inner to outer in document order, so a stagger runs outward. */
const ALL = "[data-part^=wave]"

/** 1 color: the waves. */
export const Nfc = createAnimatedIcon({
  name: "nfc",
  category: "communication",
  keywords: ["contactless", "tap", "wireless", "payment", "near field", "rfid", "pay", "tap to pay"],
  slots: { primary: "waves" },
  defaultVariant: "pulse",
  variants: {
    // a ripple runs outward: each wave dims, then surges forward taller and snaps back, one after another
    // (it dims in place rather than stepping back, and surges only as far as keeps it clear of the next wave)
    pulse: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          ALL,
          { opacity: [1, 0.25, 1, 1], x: [0, 0, 0.8, 0], scaleY: [1, 0.92, 1.12, 1] },
          { duration: seconds * 0.6, times: [0, 0.3, 0.65, 1], delay: stagger(seconds * 0.12), ease: "easeInOut" },
        ),
    },
    // a card taps against it: the waves squash back toward the source, the outer ones furthest, and
    // spring out past rest
    tap: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          WAVES.map((_, i) =>
            animate(
              sel(i),
              { x: [0, -(i + 1) * 0.9, (i + 1) * 0.45, 0], scaleY: [1, 0.82, 1.1, 1] },
              { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ["easeIn", ease.overshoot, "easeInOut"] },
            ),
          ),
        ),
    },
    // the waves turn over one after another like dominoes, each spinning round its upright axis and
    // swelling toward you as it faces the other way
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          ALL,
          { scaleX: [1, 0, -1, 0, 1], scaleY: [1, 1.08, 1.12, 1.08, 1] },
          { duration: seconds * 0.6, delay: stagger(seconds * 0.12), ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the field's waves are round, so they are true arcs */}
      {WAVES.map((d, i) => (
        <path key={d} data-part={`wave-${i + 1}`} d={d} style={pivot("50% 50%")} />
      ))}
    </>
  ),
})
