import type { IconMeta, Trigger } from "@kovenlabs/animated-icons"

import { DEFAULT_STYLE, type IconStyle } from "./icon-style"
import { SITE_URL } from "./site"

/** What the JSX snippet reflects: the site-wide style, plus the catalog's own size and trigger. */
export interface SnippetOptions extends IconStyle {
  size?: number
  trigger?: Trigger | "default"
}

export const pascal = (name: string) => name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())

export const installCommand = (name: string) => `npx shadcn add @kovenlabs/${name}`

/** The whole set in one command: the registry's generated `all` bundle. */
export const INSTALL_ALL = "npx shadcn add @kovenlabs/all"

/** The JSX for an icon as currently styled, with only the props that differ from the defaults. */
export function usageSnippet(
  meta: IconMeta,
  variant: string,
  { colors, size = 24, speed, trigger = "default", corners, cornerRadius, strokeWidth }: SnippetOptions,
  { imports = true }: { imports?: boolean } = {},
) {
  const component = pascal(meta.name)
  const props: string[] = []
  if (variant !== meta.defaultVariant) props.push(`variant="${variant}"`)
  if (trigger !== "default") props.push(`trigger="${trigger}"`)
  if (speed !== DEFAULT_STYLE.speed) props.push(`speed={${speed}}`)
  if (corners !== DEFAULT_STYLE.corners) props.push(`corners="${corners}"`)
  if (corners !== "sharp" && cornerRadius !== DEFAULT_STYLE.cornerRadius) props.push(`cornerRadius={${cornerRadius}}`)
  if (strokeWidth !== DEFAULT_STYLE.strokeWidth) props.push(`strokeWidth={${strokeWidth}}`)
  if (size !== 24) props.push(`size={${size}}`)
  // only the slots this icon paints: the palette's other colors would do nothing here
  const used = Object.entries(colors).filter(([slot, value]) => value && slot in meta.slots)
  if (used.length) props.push(`colors={{ ${used.map(([slot, value]) => `${slot}: "${value}"`).join(", ")} }}`)

  const attrs = props.length > 1 ? `\n  ${props.join("\n  ")}\n` : props.length ? ` ${props[0]} ` : " "
  const jsx = `<${component}${attrs}/>`
  return imports ? `import { ${component} } from "@/components/animated-icons/icons/${meta.name}"\n\n${jsx}` : jsx
}

export interface InstallOption {
  id: string
  label: string
  hint: string
  text: string
  group: "registry" | "package" | "agent"
}

/** A brief an AI coding agent can follow from a blank page: what to install, how, and how to check it. */
function agentPrompt(names: string[] | "all") {
  const items = names === "all" ? ["all"] : names
  const what =
    names === "all"
      ? "every icon from Animated Icons"
      : `the ${names.join(", ")} icon${names.length > 1 ? "s" : ""} from Animated Icons`
  return [
    `Add ${what} (${SITE_URL}) to this project.`,
    "",
    "1. If this project uses shadcn/ui (it has a components.json), add the registry namespace once:",
    `   "registries": { "@kovenlabs": "${SITE_URL}/r/{name}.json" }`,
    `   then run: npx shadcn add ${items.map((item) => `@kovenlabs/${item}`).join(" ")}`,
    "   The CLI copies the source into components/animated-icons/ and adds --icon-primary, --icon-secondary and --icon-accent to globals.css.",
    "2. Otherwise install the package: the project's package manager, add @kovenlabs/animated-icons and motion.",
    "   Then add the three color variables to the global CSS, pointing at the theme's tokens:",
    "   --icon-primary: var(--foreground); --icon-secondary: var(--chart-2); --icon-accent: var(--chart-1);",
    "3. Icons are React client components. Props: variant, trigger (hover | click | inView | auto | manual | none), colors ({ primary, secondary, accent } as shadcn token names or CSS colors), corners (round | bevel | sharp), cornerRadius, strokeWidth, size, speed.",
    "   App-wide defaults go in config.ts (registry) or <AnimatedIconsProvider> (package).",
    `4. Pick variants from the catalog: ${SITE_URL}/icons.json lists every icon's variants and color slots.`,
    `Docs: ${SITE_URL}/docs (full text for agents: ${SITE_URL}/llms-full.txt).`,
    "Use the project's existing conventions and verify it typechecks.",
  ].join("\n")
}

/** Every way to get an icon (or the whole set) into a project, for the install menus. */
export function installOptions(name: string | "all"): InstallOption[] {
  const item = name === "all" ? "all" : name
  return [
    {
      id: "prompt",
      label: "Prompt for your AI agent",
      hint: "Install steps and API, ready to paste into Claude Code, Codex or Cursor",
      text: agentPrompt(name === "all" ? "all" : [name]),
      group: "agent",
    },
    {
      id: "shadcn",
      label: "shadcn CLI",
      hint: "Once the @kovenlabs namespace is in components.json",
      text: `npx shadcn add @kovenlabs/${item}`,
      group: "registry",
    },
    {
      id: "shadcn-url",
      label: "shadcn CLI, no setup",
      hint: "The registry item's URL, no namespace needed",
      text: `npx shadcn add ${SITE_URL}/r/${item}.json`,
      group: "registry",
    },
    {
      id: "pnpm",
      label: "pnpm",
      hint: "The package, tree-shaken",
      text: "pnpm add @kovenlabs/animated-icons motion",
      group: "package",
    },
    {
      id: "npm",
      label: "npm",
      hint: "The package, tree-shaken",
      text: "npm install @kovenlabs/animated-icons motion",
      group: "package",
    },
    {
      id: "yarn",
      label: "yarn",
      hint: "The package, tree-shaken",
      text: "yarn add @kovenlabs/animated-icons motion",
      group: "package",
    },
    {
      id: "bun",
      label: "bun",
      hint: "The package, tree-shaken",
      text: "bun add @kovenlabs/animated-icons motion",
      group: "package",
    },
    {
      id: "skill",
      label: "Agent skill",
      hint: "Teaches your agent to pick icons, variants and triggers",
      text: "npx skills add kovenlabs/animated-icons --skill find-animated-icon",
      group: "agent",
    },
  ]
}
