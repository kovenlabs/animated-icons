"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    globe: "turn" | "tilt"
  }
}

const fmt = (n: number) => Number(n.toFixed(2))

/** The globe's radius: it spans the 2..22 drawing area. */
const R = 10

/**
 * Meridian tracks every 15° of longitude, each a fixed arc from pole to pole: the half ellipse a meridian
 * traces there, `R·sin(longitude)` wide (a straight axis at 0°). A turn never reshapes a path: each
 * meridian travels by lighting the tracks it passes and dimming the ones it leaves.
 */
const TRACK = 15
const TRACKS = Array.from({ length: 11 }, (_, i) => -75 + i * TRACK)

function arc(longitude: number) {
  if (longitude === 0) return `M12 ${12 - R}V${12 + R}`
  const rx = fmt(Math.abs(R * Math.sin((longitude * Math.PI) / 180)))
  return `M12 ${12 - R}A${rx} ${R} 0 0 ${longitude > 0 ? 1 : 0} 12 ${12 + R}`
}

/** Meridians fade as they near the rim, where they would only double the outline. */
const rim = (longitude: number) => Math.min(1, Math.max(0, (90 - Math.abs(longitude)) / 30))

/** The globe's meridians, 60° apart; the one at -90° waits on the rim, ready to turn into view. */
const MERIDIANS = [-90, -30, 30] as const
const STEP = 60

/**
 * How lit a track is with the meridians at these longitudes: full while a meridian is near it, handed over
 * to the next track in a quick crossfade halfway between, so the moving line stays crisp.
 */
const near = (distance: number) => Math.min(1, Math.max(0, (1 - Math.abs(distance) / TRACK - 0.3) / 0.4))
const lit = (track: number, meridians: number[]) => fmt(Math.max(...meridians.map((m) => near(m - track))) * rim(track))

/** One 60° turn, eased overall. It ends a whole step on, which is exactly the resting picture. */
const FRAMES = 24
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
const POSES = Array.from({ length: FRAMES + 1 }, (_, i) => MERIDIANS.map((m) => m + STEP * easeInOut(i / FRAMES)))

/** 2 colors: sphere and equator (primary), meridians (accent). */
export const Globe = createAnimatedIcon({
  name: "globe",
  category: "navigation",
  keywords: ["world", "earth", "international", "language", "web", "planet", "global"],
  slots: { primary: "sphere + equator", accent: "meridians" },
  defaultVariant: "turn",
  variants: {
    // the earth turns: each meridian slides one place east, the last one rolling under the rim
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          TRACKS.map((track) =>
            animate(
              `[data-part=meridian${track}]`,
              { opacity: POSES.map((pose) => lit(track, pose)) },
              { duration: seconds, ease: "linear" },
            ),
          ),
        ),
    },
    // tips on its axis, like a desk globe given a nudge, and rights itself
    tilt: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=globe]", { rotate: [0, -16, 10, -4, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <g data-part="globe" style={pivot("50% 50%")}>
      <g stroke={slot.accent}>
        {TRACKS.map((track) => (
          <path
            key={track}
            data-part={`meridian${track}`}
            d={arc(track)}
            style={{ opacity: lit(track, [...MERIDIANS]) }}
          />
        ))}
      </g>
      {/* the globe is round, so it gets a true circle; drawn over the meridians so they slip under the rim */}
      <circle cx="12" cy="12" r={R} />
      <path d="M2 12h20" />
    </g>
  ),
})
