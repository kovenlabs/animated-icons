"use client"

import type { AnimatedIconHandle, ColorSlot } from "@kovenlabs/animated-icons"
import { Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { siblingsOf, type CatalogIcon } from "@/lib/catalog"
import { installCommand, usageSnippet, type Customization } from "@/lib/snippet"
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

function Family({ icon, onSelect }: { icon: CatalogIcon; onSelect: (name: string) => void }) {
  const siblings = siblingsOf(icon)
  if (siblings.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        Family <span className="font-mono">{icon.meta.family}</span>
      </span>
      <div className="flex flex-wrap gap-2">
        {siblings.map((Sibling) => (
          <button
            key={Sibling.meta.name}
            type="button"
            onClick={() => onSelect(Sibling.meta.name)}
            className="flex items-center gap-2 border px-2.5 py-1.5 font-mono text-xs transition-colors hover:bg-muted"
          >
            <Sibling size={18} trigger="hover" />
            {Sibling.meta.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function Detail({
  icon: Icon,
  initialVariant,
  customization,
  onSelect,
}: {
  icon: CatalogIcon
  initialVariant: string
  customization: Customization
  onSelect: (name: string) => void
}) {
  const { meta } = Icon
  const [variant, setVariant] = useState(initialVariant)
  const ref = useRef<AnimatedIconHandle>(null)
  const source = useSource(meta.name)

  // play on open and on every variant change
  useEffect(() => {
    const id = setTimeout(() => void ref.current?.play(), 150)
    return () => clearTimeout(id)
  }, [variant])

  const snippet = usageSnippet(meta, variant, customization)

  return (
    <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-8">
      <div className="icon-stage relative flex aspect-[4/3] items-center justify-center border">
        <Icon key={variant} ref={ref} variant={variant} size={144} trigger="manual" aria-label={`${meta.name} icon`} />
        <Button
          variant="outline"
          size="icon-sm"
          className="absolute right-3 bottom-3"
          onClick={() => void ref.current?.play()}
          aria-label="Replay"
        >
          <Play />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Variants</span>
        <div className="flex flex-wrap gap-px border bg-border">
          {meta.variants.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => (v === variant ? void ref.current?.play() : setVariant(v))}
              className={cn(
                "flex-1 bg-background px-3 py-1.5 font-mono text-xs transition-colors",
                v === variant ? "bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              {v}
              {v === meta.defaultVariant && <span className="ml-1 opacity-50">·default</span>}
            </button>
          ))}
        </div>
      </div>

      <Family icon={Icon} onSelect={onSelect} />

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        {SLOTS.filter((slot) => meta.slots[slot]).map((slot) => (
          <div key={slot} className="contents">
            <dt className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="size-3 border" style={{ background: `var(--icon-${slot})` }} />
              {slot}
            </dt>
            <dd>{meta.slots[slot]}</dd>
          </div>
        ))}
        {meta.defaults && (
          <>
            <dt className="font-mono text-xs text-muted-foreground">defaults</dt>
            <dd className="font-mono text-xs">
              {Object.entries(meta.defaults)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")}
            </dd>
          </>
        )}
      </dl>

      <div className="flex flex-wrap gap-1.5">
        {meta.keywords.map((keyword) => (
          <span key={keyword} className="border px-2 py-0.5 text-xs text-muted-foreground">
            {keyword}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <code className="block border bg-muted/40 px-3 py-2 font-mono text-xs">{installCommand(meta.name)}</code>
        <div className="flex gap-2">
          <CopyButton text={installCommand(meta.name)} label="Install command" />
          <CopyButton text={snippet} label="JSX" />
        </div>
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
    </div>
  )
}

export function IconSheet({
  icon,
  variant,
  customization,
  onSelect,
  onClose,
}: {
  icon: CatalogIcon | null
  variant: string
  customization: Customization
  onSelect: (name: string) => void
  onClose: () => void
}) {
  return (
    <Sheet open={icon !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-lg">
        {icon && (
          <>
            <SheetHeader className="px-6 pt-6 pb-4">
              <SheetTitle className="font-mono">{icon.meta.name}</SheetTitle>
              <SheetDescription className="capitalize">
                {icon.meta.category} · {icon.meta.colors} color{icon.meta.colors > 1 ? "s" : ""} ·{" "}
                {icon.meta.variants.length} variants
              </SheetDescription>
            </SheetHeader>
            <Detail
              key={icon.meta.name}
              icon={icon}
              initialVariant={icon.meta.variants.includes(variant) ? variant : icon.meta.defaultVariant}
              customization={customization}
              onSelect={onSelect}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
