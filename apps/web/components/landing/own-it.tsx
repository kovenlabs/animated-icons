import Link from "next/link"

const STEPS = [
  {
    label: "1 · add",
    code: "npx shadcn add @kovenlabs/bell @kovenlabs/loader\n\n# or the whole set\nnpx shadcn add @kovenlabs/all\n\n# or as a package\npnpm add @kovenlabs/animated-icons motion",
    note: "The shadcn way copies the source into components/animated-icons/, yours to edit. The package keeps it all in one dependency.",
  },
  {
    label: "2 · use",
    code: `<BellIcon />\n<BellIcon variant="shake" trigger="auto" />\n<BellIcon colors={{ accent: "destructive" }} />`,
    note: "Hover, click, auto, in view, or drive it yourself through a ref.",
  },
  {
    label: "3 · configure once",
    code: `export default defineIconConfig({\n  trigger: "hover",\n  corners: "round",\n  icons: { bell: { variant: "shake" } },\n})`,
    note: "Global defaults in config.ts; providers for a subtree; props win.",
  },
]

export function OwnIt() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-muted-foreground">install</p>
          <h2 className="text-2xl font-semibold tracking-tight">Yours to own</h2>
        </div>
        <Link href="/docs/installation" className="text-sm underline-offset-4 hover:underline">
          Installation guide
        </Link>
      </div>
      <ol className="grid gap-px border bg-border lg:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.label} className="flex flex-col gap-4 bg-background p-6">
            <p className="font-mono text-xs text-muted-foreground">{step.label}</p>
            <pre className="flex-1 overflow-x-auto border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
              {step.code}
            </pre>
            <p className="text-sm text-muted-foreground">{step.note}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
