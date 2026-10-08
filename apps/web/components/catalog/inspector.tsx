"use client"

import type { ColorSlot, Trigger } from "@kovenlabs/animated-icons"
import { useEffect, useState } from "react"

import { InstallMenu } from "@/components/install-menu"
import { DraftingBoard } from "@/components/style/drafting"
import { StyleControls } from "@/components/style/style-controls"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { siblingsOf, type CatalogIcon } from "@/lib/catalog"
import { useIconStyle } from "@/lib/icon-style"
import { usageSnippet } from "@/lib/snippet"
import { cn } from "@/lib/utils"

import { CopyButton } from "./copy-button"

const SLOTS: ColorSlot[] = ["primary", "secondary", "accent"]
const sources = new Map<string, string>()

function useSource(name: string) {
  const [html, setHtml] = useState(() => sources.get(name))
  useEffect(() => {
    if (sources.has(name)) return
    let live = true
    fetch(`/api/source/${name}`)
      .then((response) => response.text())
      .then((text) => {
        sources.set(name, text)
        if (live) setHtml(text)
      })
    return () => {
      live = false
    }
  }, [name])
  return html ?? sources.get(name)
}

const pressable =
  "transition-colors focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--keyline)]"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

/** One icon, on its drawing grid: its moves, what each color paints, its family, and how to get it. */
export function IconDetail({
  icon: Icon,
  variant,
  onVariant,
  size,
  trigger,
  onSelect,
}: {
  icon: CatalogIcon
  variant: string
  onVariant: (variant: string) => void
  size: number
  trigger: Trigger | "default"
  onSelect: (name: string) => void
}) {
  const { meta } = Icon
  const { style } = useIconStyle()
  const source = useSource(meta.name)
  const snippet = usageSnippet(meta, variant, { ...style, size, trigger })
  const siblings = siblingsOf(Icon)

  return (
    <div className="flex flex-col gap-6">
      <DraftingBoard>
        <Icon
          key={`${meta.name}:${variant}`}
          size="100%"
          variant={variant}
          trigger="auto"
          interval={800}
          className="relative"
          aria-label={`${meta.name}, ${variant}`}
        />
      </DraftingBoard>

      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">{meta.name}</h2>
        <p className="text-sm text-muted-foreground">
          In {meta.category}, paints {meta.colors} color{meta.colors > 1 ? "s" : ""}, has {meta.variants.length} move
          {meta.variants.length > 1 ? "s" : ""}.
        </p>
      </div>

      <Section title="Moves">
        <div role="radiogroup" aria-label="Move" className="flex gap-px border bg-border">
          {meta.variants.map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={name === variant}
              onClick={() => onVariant(name)}
              className={cn(
                pressable,
                "flex-1 bg-background px-2 py-2 text-sm",
                name === variant ? "bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              {name}
              {name === meta.defaultVariant && <span className="sr-only"> (default)</span>}
            </button>
          ))}
        </div>
      </Section>

      <Section title="What each color paints">
        <dl className="flex flex-col gap-1.5 text-sm">
          {SLOTS.filter((slot) => meta.slots[slot]).map((slot) => (
            <div key={slot} className="flex items-center gap-2">
              <dt className="flex w-24 items-center gap-2">
                <span className="size-3 shrink-0" style={{ background: `var(--icon-${slot})` }} />
                {slot}
              </dt>
              <dd className="text-muted-foreground">{meta.slots[slot]}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {siblings.length > 0 && (
        <Section title={`Same family`}>
          <div className="flex flex-wrap gap-1.5">
            {siblings.map((Sibling) => (
              <button
                key={Sibling.meta.name}
                type="button"
                onClick={() => onSelect(Sibling.meta.name)}
                className={cn(pressable, "flex items-center gap-2 border px-2 py-1.5 text-sm hover:bg-muted")}
              >
                <Sibling size={18} trigger="hover" aria-hidden />
                {Sibling.meta.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      <div className="flex flex-wrap gap-2">
        <InstallMenu name={meta.name} className="min-w-0 flex-1" />
        <CopyButton text={snippet} label="JSX" className="h-8" />
      </div>

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>
        <TabsContent value="usage">
          <pre className="overflow-x-auto border bg-muted/40 p-4 font-mono text-xs leading-relaxed">{snippet}</pre>
        </TabsContent>
        <TabsContent value="source">
          {source ? (
            <div
              className="max-h-[480px] overflow-auto border p-4 text-xs leading-relaxed [&_pre]:font-mono"
              dangerouslySetInnerHTML={{ __html: source }}
            />
          ) : (
            <p className="p-4 text-xs text-muted-foreground">Loading source…</p>
          )}
        </TabsContent>
      </Tabs>

      {meta.keywords.length > 0 && (
        <Section title="Found by">
          <div className="flex flex-wrap gap-1.5">
            {meta.keywords.map((keyword) => (
              <span key={keyword} className="border px-2 py-0.5 text-xs text-muted-foreground">
                {keyword}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

/** The style tab: the same site-wide controls as the header, with room to breathe. */
export function StylePanel() {
  const { changed, reset } = useIconStyle()
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-pretty text-muted-foreground">
          Every icon on the site follows this style, and it&apos;s kept for your next visit. Copied JSX includes it.
        </p>
        {changed && (
          <button type="button" onClick={reset} className="shrink-0 text-sm underline underline-offset-4">
            Reset
          </button>
        )}
      </div>
      <StyleControls />
    </div>
  )
}
