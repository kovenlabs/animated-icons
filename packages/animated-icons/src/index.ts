export { AnimatedIconsProvider, useIconConfig } from "./lib/context"
export type { AnimatedIconsProviderProps } from "./lib/context"
export { createAnimatedIcon } from "./lib/create-icon"
export { blink, ease, flash, pivot, radial, slot, snap } from "./lib/motion"
export { BADGE, SLASH, badgeGlyph, bubble, dots } from "./lib/parts"
export { rectPath, roundPath } from "./lib/round"
export { useShapedDrawing } from "./lib/shape"
export { defineIconConfig } from "./config"
export type {
  AnimatedIconComponent,
  AnimatedIconHandle,
  AnimatedIconProps,
  Behavior,
  ColorSlot,
  Corners,
  IconColors,
  IconCategory,
  IconConfig,
  IconDefinition,
  IconMeta,
  IconName,
  IconVariants,
  Trigger,
  VariantContext,
  VariantDefinition,
} from "./lib/types"

export * from "./icons"
