"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    router: "signal" | "fold" | "beam"
  }
}

/** The antenna's tip, the shared centre of the waves. */
const TIP = { x: 15, y: 10 }

const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** A true arc of radius r over the tip, a quarter turn wide (45° either side of straight up). */
function arc(r: number) {
  const d = r * Math.SQRT1_2
  return `M${fmt(TIP.x - d)} ${fmt(TIP.y - d)}A${r} ${r} 0 0 1 ${fmt(TIP.x + d)} ${fmt(TIP.y - d)}`
}

/**
 * Where the tip sits in a quarter arc's own box, as a pivot: straight below its middle, one radius
 * down from its top, and the box is r(1 - cos 45°) tall. The same for every radius.
 */
const AT_TIP = pivot(`50% ${fmt(100 / (1 - Math.SQRT1_2))}%`)

/**
 * The same for both waves together: their box runs from the outer wave's top (7 above the tip) down
 * to the inner wave's ends (3 cos 45° above it).
 */
const WAVES_AT_TIP = pivot(`50% ${fmt(700 / (7 - 3 * Math.SQRT1_2))}%`)

/** Inner and outer wave, 2 clear of the tip and of each other. */
const WAVES = [
  { part: "wave-1", d: arc(3) },
  { part: "wave-2", d: arc(7) },
] as const

/** 2 colors: box + antenna (primary), waves and lights (accent). */
export const Router = createAnimatedIcon({
  name: "router",
  category: "devices",
  keywords: ["wifi", "modem", "network", "internet", "wireless", "hotspot", "access point", "broadband"],
  slots: { primary: "box + antenna", accent: "waves + lights" },
  defaultVariant: "signal",
  variants: {
    // the waves grow out of the antenna one after the other while the lights blink in turn
    signal: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...WAVES.map(({ part }, i) => {
            const start = 0.1 + i * 0.25
            return animate(
              `[data-part=${part}]`,
              { scale: [0.3, 0.3, 1.15, 1, 1], opacity: [0, 0, 1, 1, 1] },
              { duration: seconds, times: [0, start, start + 0.3, start + 0.45, 1], ease: ease.out },
            )
          }),
          ...["light-1", "light-2"].map((part, i) =>
            animate(`[data-part=${part}]`, { opacity: [1, 0.2, 1, 0.2, 1] }, { duration: seconds * 0.8, delay: seconds * i * 0.15 }),
          ),
        ]),
    },
    // the antenna folds down flat toward you, waves and all, and springs back up, its lights flashing
    fold: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mast]",
            { scaleY: [1, 0.15, 0.15, 1] },
            { duration: seconds, times: [0, 0.3, 0.45, 1], ease: ["easeIn", "linear", ease.overshoot] },
          ),
          animate("[data-part=waves]", { opacity: [1, 0, 0, 1, 1] }, { duration: seconds, times: [0, 0.3, 0.5, 0.75, 1] }),
          animate("[data-part=glow]", blink, { duration: seconds * 0.4, delay: seconds * 0.5, ease: "easeOut" }),
        ]),
    },
    // the waves sweep from side to side about the antenna's tip, searching for a device
    beam: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=waves]",
          { rotate: [0, -35, 25, -10, 0] },
          { duration: seconds, times: [0, 0.3, 0.65, 0.85, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <path d="M2 14h20v8H2Z" />
      {/* the box's inside: its stroke has its inner edge at 3..21 × 15..21 */}
      <rect data-part="glow" x="3" y="15" width="18" height="6" fill={slot.accent} fillOpacity={0.2} stroke="none" style={flash()} />
      <rect data-part="light-1" x="5" y="17" width="2" height="2" fill={slot.accent} stroke="none" />
      <rect data-part="light-2" x="9" y="17" width="2" height="2" fill={slot.accent} stroke="none" />
      {/* the mast is the antenna and its waves: it folds on the antenna's foot, on top of the box */}
      <g data-part="mast" style={pivot("50% 100%")}>
        <path d={`M${TIP.x} 14v-3`} />
        {/* the waves are round, so they are true arcs; they turn about the tip */}
        <g data-part="waves" stroke={slot.accent} style={WAVES_AT_TIP}>
          {WAVES.map(({ part, d }) => (
            <path key={part} data-part={part} d={d} style={AT_TIP} />
          ))}
        </g>
      </g>
    </>
  ),
})
