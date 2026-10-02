import type {
  Behavior,
  ColorSlot,
  Corners,
  IconColors,
  IconConfig,
  IconOverrides,
  ResolvedConfig,
  ReducedMotion,
  Trigger,
} from "./types"

export const BUILT_IN: Behavior = {
  trigger: "hover",
  interval: 1000,
  speed: 1,
  reducedMotion: "respect",
  corners: "round",
  cornerRadius: 2,
}

const BEHAVIOR_KEYS = ["trigger", "interval", "speed", "reducedMotion", "corners", "cornerRadius"] as const

function defined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Partial<T>
}

function mergeOverrides(parent: IconOverrides | undefined, child: IconOverrides): IconOverrides {
  const merged: IconOverrides = { ...parent, ...defined(child) }
  if (parent?.colors || child.colors) merged.colors = { ...parent?.colors, ...defined(child.colors ?? {}) }
  return merged
}

/** Layer a child config (config.ts or a nested provider) over its parent. */
export function mergeConfig(parent: ResolvedConfig, child: IconConfig): ResolvedConfig {
  const behavior = defined(Object.fromEntries(BEHAVIOR_KEYS.map((key) => [key, child[key]])) as Partial<Behavior>)
  const icons = { ...parent.icons }
  for (const [name, overrides] of Object.entries(child.icons ?? {})) {
    if (overrides) icons[name] = mergeOverrides(icons[name], overrides)
  }
  return { ...parent, ...behavior, icons }
}

interface IconMeta {
  name: string
  defaultVariant: string
  variants: Record<string, { duration: number }>
  defaults?: Partial<Behavior>
}

interface InstanceProps extends Partial<Behavior> {
  variant?: string
  duration?: number
}

export interface ResolvedIconOptions {
  trigger: Trigger
  interval: number
  reducedMotion: ReducedMotion
  corners: Corners
  cornerRadius: number
  variant: string
  /** ms */
  duration: number
}

/** Precedence, specific beats general: props > per-icon config > icon's own defaults > global config > built-ins. */
export function resolveIconOptions(icon: IconMeta, config: ResolvedConfig, props: InstanceProps): ResolvedIconOptions {
  const own = config.icons[icon.name] ?? {}
  const pick = <K extends keyof Behavior>(key: K): Behavior[K] => props[key] ?? own[key] ?? icon.defaults?.[key] ?? config[key]

  const requested = props.variant ?? own.variant
  const variant = requested && requested in icon.variants ? requested : icon.defaultVariant
  const tuned = icon.variants[variant]?.duration ?? 0

  return {
    trigger: pick("trigger"),
    interval: pick("interval"),
    reducedMotion: pick("reducedMotion"),
    corners: pick("corners"),
    cornerRadius: pick("cornerRadius"),
    variant,
    duration: props.duration ?? tuned / pick("speed"),
  }
}

const TOKEN = /^[a-z][a-z0-9-]*$/i

/** "destructive" → var(--destructive, destructive). A CSS color keyword still works through the fallback. */
export function resolveColor(value: string): string {
  return TOKEN.test(value) ? `var(--${value}, ${value})` : value
}

/** A missing slot takes the nearest given slot above it: primary → secondary → accent. Never upward. */
export function cascadeColors(colors: IconColors | undefined): IconColors {
  const { primary, secondary = primary, accent = secondary } = colors ?? {}
  return defined({ primary, secondary, accent })
}

export function colorVars(colors: IconColors | undefined): Record<`--icon-${ColorSlot}`, string> {
  const vars = {} as Record<`--icon-${ColorSlot}`, string>
  for (const [slot, value] of Object.entries(cascadeColors(colors))) {
    if (value) vars[`--icon-${slot as ColorSlot}`] = resolveColor(value)
  }
  return vars
}
