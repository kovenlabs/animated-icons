"use client"

import { AnimatedIconsProvider, type ColorSlot, type Corners, type IconColors } from "@kovenlabs/animated-icons"
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

/** The site-wide icon style: set it anywhere (landing, catalog, header), every icon on every page follows. */
export interface IconStyle {
  colors: IconColors
  corners: Corners
  cornerRadius: number
  strokeWidth: number
  speed: number
}

export const DEFAULT_STYLE: IconStyle = { colors: {}, corners: "round", cornerRadius: 2, strokeWidth: 2, speed: 1 }

export const CORNERS: Corners[] = ["round", "bevel", "sharp"]
export const SLOTS: ColorSlot[] = ["primary", "secondary", "accent"]

/** Ready-made palettes. `Theme` sets nothing, so icons read the site's own shadcn tokens. */
export const PRESETS: Array<{ name: string; colors: IconColors }> = [
  { name: "Theme", colors: {} },
  { name: "Ink", colors: { primary: "foreground" } },
  { name: "Brand", colors: { primary: "foreground", secondary: "#10b981", accent: "#2563eb" } },
  { name: "Ember", colors: { primary: "foreground", secondary: "#f59e0b", accent: "destructive" } },
  { name: "Ocean", colors: { primary: "#0891b2", secondary: "#2dd4bf", accent: "#6366f1" } },
]

/** A slot's value as CSS: a token name reads the theme variable, anything else is a CSS color. */
export const cssColor = (value: string) => (/^[a-z][a-z0-9-]*$/i.test(value) ? `var(--${value})` : value)

/** What each slot paints with these colors, after the library's cascade (primary → secondary → accent). */
export function slotColors(colors: IconColors): Record<ColorSlot, string> {
  const primary = colors.primary ? cssColor(colors.primary) : "var(--theme-icon-primary)"
  const secondary = colors.secondary
    ? cssColor(colors.secondary)
    : colors.primary
      ? primary
      : "var(--theme-icon-secondary)"
  const accent = colors.accent
    ? cssColor(colors.accent)
    : colors.secondary || colors.primary
      ? secondary
      : "var(--theme-icon-accent)"
  return { primary, secondary, accent }
}

const sameColors = (a: IconColors, b: IconColors) => SLOTS.every((slot) => a[slot] === b[slot])

/** The preset these colors match, or null once a slot has been customized. */
export const presetOf = (colors: IconColors) => PRESETS.find((p) => sameColors(p.colors, colors))?.name ?? null

const STORAGE_KEY = "animated-icons:style"

function load(): IconStyle {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<IconStyle> | null
    return saved ? { ...DEFAULT_STYLE, ...saved, colors: { ...saved.colors } } : DEFAULT_STYLE
  } catch {
    return DEFAULT_STYLE
  }
}

interface IconStyleContext {
  style: IconStyle
  update: (patch: Partial<IconStyle>) => void
  reset: () => void
  changed: boolean
}

const Context = createContext<IconStyleContext | null>(null)

export function useIconStyle() {
  const context = useContext(Context)
  if (!context) throw new Error("useIconStyle needs an <IconStyleProvider>")
  return context
}

/** Holds the style for the whole site, applies it to every icon, and remembers it across visits and tabs. */
export function IconStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState(DEFAULT_STYLE)

  // read after mount: the pages are static, so the server always renders the default style
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from storage once, on mount
    setStyle(load())
    const onStorage = (event: StorageEvent) => event.key === STORAGE_KEY && setStyle(load())
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const save = useCallback((next: IconStyle) => {
    setStyle(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // private mode or blocked storage: the style still applies for this visit
    }
  }, [])

  const value = useMemo<IconStyleContext>(
    () => ({
      style,
      update: (patch) => save({ ...style, ...patch }),
      reset: () => save(DEFAULT_STYLE),
      changed: JSON.stringify(style) !== JSON.stringify(DEFAULT_STYLE),
    }),
    [style, save],
  )

  useEffect(() => {
    const root = document.documentElement.style
    for (const [slot, color] of Object.entries(rootColors(style.colors))) {
      if (color) root.setProperty(`--icon-${slot}`, color)
      else root.removeProperty(`--icon-${slot}`)
    }
    root.setProperty("--rond", String(roundness(style)))
  }, [style])

  return (
    <Context.Provider value={value}>
      <AnimatedIconsProvider
        corners={style.corners}
        cornerRadius={style.cornerRadius}
        strokeWidth={style.strokeWidth}
        speed={style.speed}
      >
        {children}
      </AnimatedIconsProvider>
    </Context.Provider>
  )
}

/**
 * How round Doto's dots are (ROND, 0–100), so dot-matrix headings take the same corners as the icons.
 * Exposed as `--rond` on the document.
 */
export function roundness({ corners, cornerRadius }: Pick<IconStyle, "corners" | "cornerRadius">) {
  if (corners === "sharp") return 0
  if (corners === "bevel") return 30
  return Math.round(50 + (cornerRadius / 4) * 50)
}

/**
 * The colors as document-level CSS variables, after the library's cascade. On the root element rather than
 * a wrapper, so icons in portals (sheets, popovers, menus) follow them too. An unset slot is removed and
 * falls back to globals.css, which reads the theme.
 */
function rootColors(colors: IconColors): Record<ColorSlot, string | undefined> {
  const primary = colors.primary
  const secondary = colors.secondary ?? primary
  const accent = colors.accent ?? secondary
  const css = (value: string | undefined) => (value ? cssColor(value) : undefined)
  return { primary: css(primary), secondary: css(secondary), accent: css(accent) }
}
