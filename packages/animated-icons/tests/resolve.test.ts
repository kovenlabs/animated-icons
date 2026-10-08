import { BUILT_IN, colorVars, mergeConfig, resolveColor, resolveIconOptions } from "../src/lib/resolve"
import type { ResolvedConfig } from "../src/lib/types"

const bell = {
  name: "bell",
  defaultVariant: "ring",
  variants: { ring: { duration: 600 }, shake: { duration: 400 } },
}

const root: ResolvedConfig = { ...BUILT_IN, icons: {} }

describe("mergeConfig", () => {
  it("lets a child override behaviour keys and keeps the rest", () => {
    const merged = mergeConfig(root, { trigger: "auto", speed: 2 })
    expect(merged).toMatchObject({ trigger: "auto", speed: 2, interval: BUILT_IN.interval })
  })

  it("merges per-icon overrides key by key across levels", () => {
    const parent = mergeConfig(root, { icons: { bell: { variant: "shake", colors: { accent: "red" } } } })
    const child = mergeConfig(parent, { icons: { bell: { trigger: "click", colors: { primary: "blue" } } } })
    expect(child.icons.bell).toEqual({
      variant: "shake",
      trigger: "click",
      colors: { accent: "red", primary: "blue" },
    })
  })

  it("ignores undefined so an unset provider prop never erases its parent", () => {
    const parent = mergeConfig(root, { trigger: "auto" })
    expect(mergeConfig(parent, { trigger: undefined }).trigger).toBe("auto")
  })
})

describe("resolveIconOptions", () => {
  it("falls back to built-ins and the icon's own tuning", () => {
    expect(resolveIconOptions(bell, root, {})).toEqual({
      trigger: "hover",
      interval: 1000,
      reducedMotion: "respect",
      corners: "round",
      cornerRadius: 2,
      size: 24,
      strokeWidth: 2,
      variant: "ring",
      duration: 600,
    })
  })

  it("applies precedence props > per-icon config > global config", () => {
    const config = mergeConfig(root, { trigger: "auto", interval: 500, icons: { bell: { trigger: "click" } } })
    const resolved = resolveIconOptions(bell, config, { interval: 200 })
    expect(resolved.trigger).toBe("click")
    expect(resolved.interval).toBe(200)
  })

  it("lets an icon's own defaults beat global config, but not per-icon config or props", () => {
    const loader = { ...bell, name: "loader", defaults: { trigger: "auto" as const, interval: 0 } }
    const global = mergeConfig(root, { trigger: "hover", interval: 800 })
    expect(resolveIconOptions(loader, global, {})).toMatchObject({ trigger: "auto", interval: 0 })

    const perIcon = mergeConfig(global, { icons: { loader: { trigger: "click" } } })
    expect(resolveIconOptions(loader, perIcon, {}).trigger).toBe("click")
    expect(resolveIconOptions(loader, global, { trigger: "manual" }).trigger).toBe("manual")
  })

  it("resolves corners like any other setting: props > per-icon > global > built-in round", () => {
    const global = mergeConfig(root, { corners: "round", cornerRadius: 3 })
    expect(resolveIconOptions(bell, global, {})).toMatchObject({ corners: "round", cornerRadius: 3 })
    const perIcon = mergeConfig(global, { icons: { bell: { corners: "bevel" } } })
    expect(resolveIconOptions(bell, perIcon, {}).corners).toBe("bevel")
    expect(resolveIconOptions(bell, perIcon, { corners: "sharp" }).corners).toBe("sharp")
  })

  it("resolves size like any other setting: props > per-icon > global > built-in 24", () => {
    const global = mergeConfig(root, { size: 20 })
    expect(resolveIconOptions(bell, global, {}).size).toBe(20)
    const perIcon = mergeConfig(global, { icons: { bell: { size: "1.5em" } } })
    expect(resolveIconOptions(bell, perIcon, {}).size).toBe("1.5em")
    expect(resolveIconOptions(bell, perIcon, { size: 16 }).size).toBe(16)
  })

  it("scales the variant's tuned duration by speed", () => {
    const config = mergeConfig(root, { speed: 2 })
    expect(resolveIconOptions(bell, config, { variant: "shake" }).duration).toBe(200)
  })

  it("lets an absolute duration prop beat speed", () => {
    const config = mergeConfig(root, { speed: 2 })
    expect(resolveIconOptions(bell, config, { duration: 900 }).duration).toBe(900)
  })

  it("prefers per-icon speed over global speed", () => {
    const config = mergeConfig(root, { speed: 2, icons: { bell: { speed: 0.5 } } })
    expect(resolveIconOptions(bell, config, {}).duration).toBe(1200)
  })

  it("resolves strokeWidth like size: props > per-icon > global > built-in 2", () => {
    const global = mergeConfig(root, { strokeWidth: 1.5 })
    expect(resolveIconOptions(bell, global, {}).strokeWidth).toBe(1.5)
    const perIcon = mergeConfig(global, { icons: { bell: { strokeWidth: 2.5 } } })
    expect(resolveIconOptions(bell, perIcon, {}).strokeWidth).toBe(2.5)
    expect(resolveIconOptions(bell, perIcon, { strokeWidth: 1 }).strokeWidth).toBe(1)
  })

  it("ignores a zero, negative or non-finite strokeWidth and falls through to the next level", () => {
    const global = mergeConfig(root, { strokeWidth: 1.5 })
    expect(resolveIconOptions(bell, global, { strokeWidth: 0 }).strokeWidth).toBe(1.5)
    expect(resolveIconOptions(bell, global, { strokeWidth: -1 }).strokeWidth).toBe(1.5)
    const broken = mergeConfig(root, { strokeWidth: Number.NaN, icons: { bell: { strokeWidth: Infinity } } })
    expect(resolveIconOptions(bell, broken, {}).strokeWidth).toBe(2)
  })

  it("never takes strokeWidth from an icon's own defaults", () => {
    const heavy = { ...bell, defaults: { strokeWidth: 4 } as never }
    expect(resolveIconOptions(heavy, root, {}).strokeWidth).toBe(2)
  })

  it("takes the variant from config, and falls back to the default for unknown names", () => {
    const config = mergeConfig(root, { icons: { bell: { variant: "shake" } } })
    expect(resolveIconOptions(bell, config, {}).variant).toBe("shake")
    expect(resolveIconOptions(bell, root, { variant: "nope" }).variant).toBe("ring")
  })
})

describe("resolveColor", () => {
  it("turns a token name into its CSS variable, falling back to the literal", () => {
    expect(resolveColor("destructive")).toBe("var(--destructive, destructive)")
    expect(resolveColor("chart-2")).toBe("var(--chart-2, chart-2)")
  })

  it("passes raw CSS colors through", () => {
    expect(resolveColor("#facc15")).toBe("#facc15")
    expect(resolveColor("oklch(0.7 0.2 30)")).toBe("oklch(0.7 0.2 30)")
    expect(resolveColor("var(--brand)")).toBe("var(--brand)")
  })
})

describe("colorVars", () => {
  it("emits nothing when no color is given", () => {
    expect(colorVars(undefined)).toEqual({})
    expect(colorVars({})).toEqual({})
  })

  it("paints every slot with a lone primary", () => {
    expect(colorVars({ primary: "#f00" })).toEqual({
      "--icon-primary": "#f00",
      "--icon-secondary": "#f00",
      "--icon-accent": "#f00",
    })
  })

  it("lets a missing slot take the nearest given slot above it", () => {
    expect(colorVars({ primary: "#f00", secondary: "#0f0" })).toMatchObject({ "--icon-accent": "#0f0" })
    expect(colorVars({ primary: "#f00", accent: "#00f" })).toMatchObject({
      "--icon-secondary": "#f00",
      "--icon-accent": "#00f",
    })
  })

  it("never cascades upward: a lone accent only recolors the accent", () => {
    expect(colorVars({ accent: "primary" })).toEqual({ "--icon-accent": "var(--primary, primary)" })
    expect(colorVars({ secondary: "chart-2" })).toEqual({
      "--icon-secondary": "var(--chart-2, chart-2)",
      "--icon-accent": "var(--chart-2, chart-2)",
    })
  })
})
