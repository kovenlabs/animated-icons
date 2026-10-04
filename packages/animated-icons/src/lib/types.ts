import type { useAnimate } from "motion/react"

export type ColorSlot = "primary" | "secondary" | "accent"

/** Each slot takes a shadcn token name ("destructive", "chart-2") or any CSS color. */
export type IconColors = Partial<Record<ColorSlot, string>>

/** What starts an animation. `none` keeps the icon static: nothing plays it, not even the ref or `animate`. */
export type Trigger = "hover" | "auto" | "click" | "inView" | "manual" | "none"

export type ReducedMotion = "respect" | "ignore"

/** Corner geometry: `round` curves every corner (default), `bevel` cuts it, `sharp` keeps it as drawn. */
export type Corners = "sharp" | "bevel" | "round"

/** Behaviour every icon shares. Timings are in milliseconds. */
export interface Behavior {
  trigger: Trigger
  /** Rest time between loops (auto / inView / controlled). */
  interval: number
  /** Multiplier on each icon's own tuned duration. 2 = twice as fast. */
  speed: number
  reducedMotion: ReducedMotion
  corners: Corners
  /** How far each rounded or beveled corner reaches, in grid units (the drawing is 24 wide). */
  cornerRadius: number
  /** Width and height of the icon box: px as a number, or any CSS length. A `className` size (`size-6`) still wins. */
  size: number | string
}

/**
 * Icons register their variant names here through module augmentation, so the
 * global config can only name variants an icon actually has:
 *
 *   declare module "../lib/types" {
 *     interface IconVariants { bell: "ring" | "shake" }
 *   }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IconVariants {}

export type IconName = keyof IconVariants

export type IconOverrides<V extends string = string> = Partial<Behavior> & {
  variant?: V
  colors?: IconColors
}

/** Installed icons get typed variants; unknown names stay allowed so config.ts never breaks on an icon you skipped. */
export type PerIconConfig = {
  [K in IconName]?: IconOverrides<IconVariants[K]>
} & Record<string, IconOverrides | undefined>

export interface IconConfig extends Partial<Behavior> {
  icons?: PerIconConfig
}

/** The fully merged config an icon reads from context. */
export interface ResolvedConfig extends Behavior {
  icons: Record<string, IconOverrides | undefined>
}

type ScopedAnimate = ReturnType<typeof useAnimate>[1]

export interface VariantContext {
  /** `useAnimate`'s scoped animate: selectors resolve inside this icon only. */
  animate: ScopedAnimate
  /** Resolved duration in seconds, ready to hand to motion. */
  seconds: number
}

export interface VariantDefinition {
  /** Tuned duration for this variant, in ms, before `speed` is applied. */
  duration: number
  /**
   * `true`: clip to the 24px frame while this variant plays, for parts that slip out and back in.
   * `false`: a long move that stays inside the frame. Required once a part travels 5px or more.
   */
  clip?: boolean
  run: (ctx: VariantContext) => PromiseLike<unknown> | unknown
}

/** Sidebar groups in the catalog. */
export type IconCategory =
  | "actions"
  | "arrows"
  | "charts"
  | "communication"
  | "commerce"
  | "design"
  | "development"
  | "education"
  | "devices"
  | "files"
  | "finance"
  | "gaming"
  | "layout"
  | "media"
  | "nature"
  | "navigation"
  | "security"
  | "social"
  | "status"
  | "text"
  | "time"
  | "transport"
  | "users"
  | "weather"

export interface IconDefinition<V extends string> {
  name: string
  /** Shape siblings share a family, named by its base icon: `messages` and `message-text` are in `message`. */
  family?: string
  category: IconCategory
  /** Search terms beyond the name: what the icon means, synonyms. */
  keywords?: string[]
  /** What each color slot paints. Its keys are the slots the icon uses. */
  slots: Partial<Record<ColorSlot, string>>
  defaultVariant: NoInfer<V>
  variants: Record<V, VariantDefinition>
  /**
   * Behaviour this icon needs to make sense, e.g. a loader loops. Beats global config, loses to per-icon config and
   * props. Never `size`: an icon must not override the size you set globally.
   */
  defaults?: Partial<Omit<Behavior, "size">>
  /** The SVG children. Colour parts with `var(--icon-<slot>)` and tag animated parts with `data-part`. */
  render: () => React.ReactNode
}

/**
 * Static, searchable description of an icon, available as `Icon.meta`.
 * Client-side only: in a React Server Component an icon import is a client reference, without statics.
 */
export interface IconMeta<V extends string = string> {
  name: string
  /** The icon's family: its own name unless it's a shape sibling of another icon. */
  family: string
  category: IconCategory
  keywords: string[]
  slots: Partial<Record<ColorSlot, string>>
  /** How many color slots the icon uses: 1, 2 or 3. */
  colors: number
  variants: V[]
  defaultVariant: V
  defaults?: Partial<Omit<Behavior, "size">>
}

export interface AnimatedIconHandle {
  /** Play one cycle. Resolves when it finishes. */
  play: () => Promise<void>
  /** Loop with `interval` rest between cycles until `stop()`. */
  start: () => void
  /** Stop looping; the cycle in flight finishes so the icon never freezes mid-pose. */
  stop: () => void
}

/** What `createAnimatedIcon` returns: the component, plus its searchable `meta`. */
export type AnimatedIconComponent<V extends string = string> = ((props: AnimatedIconProps<V>) => React.JSX.Element) & {
  displayName: string
  meta: IconMeta<V>
}

export type AnimatedIconProps<V extends string = string> = Partial<Behavior> & {
  variant?: V
  /** Absolute duration in ms. Wins over the icon's tuning and `speed`. */
  duration?: number
  /** Controlled mode: `true` loops, `false` stops. Overrides `trigger`. */
  animate?: boolean
  colors?: IconColors
  ref?: React.Ref<AnimatedIconHandle>
} & Omit<React.SVGProps<SVGSVGElement>, "ref" | "children" | "colors">
