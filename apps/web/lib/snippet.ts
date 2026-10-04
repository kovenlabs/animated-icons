import type { Corners, IconColors, IconMeta, Trigger } from "@kovenlabs/animated-icons"

export interface Customization {
  colors: IconColors
  size: number
  speed: number
  trigger: Trigger | "default"
  corners: Corners
  cornerRadius: number
}

export const pascal = (name: string) => name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())

export const installCommand = (name: string) => `npx shadcn add @kovenlabs/${name}`

/** The whole set in one command: the registry's generated `all` bundle. */
export const INSTALL_ALL = "npx shadcn add @kovenlabs/all"

/** The JSX for an icon as currently customized, with only the props that differ from defaults. */
export function usageSnippet(meta: IconMeta, variant: string, { colors, size, speed, trigger, corners, cornerRadius }: Customization) {
  const component = pascal(meta.name)
  const props: string[] = []
  if (variant !== meta.defaultVariant) props.push(`variant="${variant}"`)
  if (trigger !== "default") props.push(`trigger="${trigger}"`)
  if (speed !== 1) props.push(`speed={${speed}}`)
  if (corners !== "round") props.push(`corners="${corners}"`)
  if (corners !== "sharp" && cornerRadius !== 2) props.push(`cornerRadius={${cornerRadius}}`)
  if (size !== 24) props.push(`size={${size}}`)
  const used = Object.entries(colors).filter(([slot, value]) => value && slot in meta.slots)
  if (used.length) props.push(`colors={{ ${used.map(([slot, value]) => `${slot}: "${value}"`).join(", ")} }}`)

  const attrs = props.length > 2 ? `\n  ${props.join("\n  ")}\n` : props.length ? ` ${props.join(" ")} ` : " "
  return `import { ${component} } from "@/components/animated-icons/icons/${meta.name}"\n\n<${component}${attrs}/>`
}
