import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc"
import Link from "next/link"

import { CopyButton } from "@/components/catalog/copy-button"

const SKILL = "npx skills add kovenlabs/animated-icons --skill find-animated-icon"

const STEPS = [
  {
    title: "Add",
    lang: "bash",
    code: "npx shadcn add @kovenlabs/bell\n\n# or the whole set\nnpx shadcn add @kovenlabs/all\n\n# or as one package\npnpm add @kovenlabs/animated-icons motion",
    note: "The shadcn CLI copies each icon's source into components/animated-icons/, yours to edit. The package keeps the set in one dependency.",
  },
  {
    title: "Use",
    lang: "tsx",
    code: `<Bell />\n<Bell variant="shake" trigger="auto" />\n<Bell colors={{ accent: "destructive" }} />`,
    note: "Colors take a shadcn token name or any CSS color. Give one and it paints the whole icon.",
  },
  {
    title: "Configure once",
    lang: "ts",
    code: `export default defineIconConfig({\n  trigger: "hover",\n  corners: "bevel",\n  icons: { bell: { variant: "shake" } },\n})`,
    note: "Global defaults live in config.ts, a provider overrides them for a subtree, and props win over both.",
  },
]

export function Install() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="text-3xl font-semibold tracking-tight">Yours in three steps</h2>
          <p className="text-muted-foreground">
            Copy the source or install the package. Either way, the code is plain React and motion.
          </p>
        </div>
        <Link href="/docs/installation" className="text-sm font-medium underline underline-offset-4">
          Installation guide
        </Link>
      </div>
      <ol className="grid grid-cols-1 gap-px border bg-border lg:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex min-w-0 flex-col gap-4 bg-background p-6">
            <h3 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
              <span className="text-muted-foreground tabular-nums">{i + 1}</span>
              {step.title}
            </h3>
            <div className="flex-1 [&_figure]:my-0">
              <ServerCodeBlock lang={step.lang} code={step.code} />
            </div>
            <p className="text-sm text-muted-foreground">{step.note}</p>
          </li>
        ))}
      </ol>
      <div className="mt-px flex flex-col gap-4 border bg-background p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-xl flex-col gap-1">
          <h3 className="text-lg font-semibold tracking-tight">Let your coding agent pick</h3>
          <p className="text-sm text-muted-foreground">
            A skill that searches the catalog and chooses the icon, variant and trigger for what you&apos;re building.
          </p>
        </div>
        <div className="flex min-w-0 items-center gap-2 border py-1 pr-1 pl-3">
          <code className="min-w-0 truncate font-mono text-sm">{SKILL}</code>
          <CopyButton text={SKILL} label="Copy" />
        </div>
      </div>
    </section>
  )
}
