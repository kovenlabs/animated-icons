"use client"

import { createContext, useContext, useMemo } from "react"

import config from "../config"
import { BUILT_IN, colorVars, mergeConfig } from "./resolve"
import type { IconColors, IconConfig, ResolvedConfig } from "./types"

const ROOT: ResolvedConfig = mergeConfig({ ...BUILT_IN, icons: {} }, config)

const AnimatedIconsContext = createContext<ResolvedConfig>(ROOT)

export function useIconConfig() {
  return useContext(AnimatedIconsContext)
}

export interface AnimatedIconsProviderProps extends IconConfig {
  /** Recolors every icon in this subtree. An icon's own `className` vars and `colors` prop still win. */
  colors?: IconColors
  children: React.ReactNode
}

/** Scoped defaults. Providers nest: each one only overrides what it sets. */
export function AnimatedIconsProvider({
  children,
  colors,
  trigger,
  interval,
  speed,
  reducedMotion,
  corners,
  cornerRadius,
  size,
  icons,
}: AnimatedIconsProviderProps) {
  const parent = useIconConfig()
  const value = useMemo(
    () => mergeConfig(parent, { trigger, interval, speed, reducedMotion, corners, cornerRadius, size, icons }),
    [parent, trigger, interval, speed, reducedMotion, corners, cornerRadius, size, icons],
  )

  const provided = <AnimatedIconsContext.Provider value={value}>{children}</AnimatedIconsContext.Provider>
  if (!colors) return provided

  // Colors cascade as CSS vars, so a className override on a single icon still beats the subtree.
  return <span style={{ display: "contents", ...colorVars(colors) }}>{provided}</span>
}
