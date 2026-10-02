"use client"

import { AnimatedIconsProvider, type IconCategory } from "@kovenlabs/animated-icons"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/catalog/copy-button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { icons, iconsByName, searchIcons } from "@/lib/catalog"
import { INSTALL_ALL, type Customization } from "@/lib/snippet"

import { ANIMATIONS, CategoryList, Customizer, DEFAULT_CUSTOMIZATION, type Animation } from "./customizer"
import { IconSheet } from "./icon-sheet"
import { IconTile } from "./icon-tile"
import { Segmented } from "./segmented"

const CYCLE_MS = 2200
const COLOR_FILTERS = ["all", "1", "2", "3"] as const

export function Catalog() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<IconCategory | null>(null)
  const [colorFilter, setColorFilter] = useState<(typeof COLOR_FILTERS)[number]>("all")
  const [customization, setCustomization] = useState<Customization>(DEFAULT_CUSTOMIZATION)
  const [animation, setAnimation] = useState<Animation>("1st")
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [customizing, setCustomizing] = useState(false)
  const search = useRef<HTMLInputElement>(null)

  const results = searchIcons({ query, category, colors: colorFilter === "all" ? null : Number(colorFilter) })
  const variantIndex = animation === "cycle" ? step : ANIMATIONS.indexOf(animation)
  const variantOf = (name: string) => {
    const { variants } = iconsByName.get(name)!.meta
    return variants[variantIndex % variants.length]!
  }

  // cycle: every icon steps to its next animation together
  useEffect(() => {
    if (animation !== "cycle") return
    const id = setInterval(() => setStep((s) => s + 1), CYCLE_MS)
    return () => clearInterval(id)
  }, [animation])

  // deep link: /icons?icon=bell opens that icon's panel (read after mount: the page is static)
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("icon")
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the URL once, on mount
    if (name && iconsByName.has(name)) setSelected(name)
  }, [])

  // "/" focuses the search
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && event.target.closest("input, textarea, [contenteditable]")
      if (event.key === "/" && !typing) {
        event.preventDefault()
        search.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const clear = () => {
    setQuery("")
    setCategory(null)
    setColorFilter("all")
  }

  const sidebar = (
    <div className="flex flex-col gap-8">
      <Customizer
        customization={customization}
        onCustomization={setCustomization}
        animation={animation}
        onAnimation={setAnimation}
      />
      <CategoryList category={category} onCategory={setCategory} />
    </div>
  )

  return (
    <AnimatedIconsProvider
      speed={customization.speed}
      colors={customization.colors}
      corners={customization.corners}
      cornerRadius={customization.cornerRadius}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r p-5 lg:block">
          {sidebar}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="relative flex-1">
              <span className="sr-only">Search icons</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={search}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Escape" && setQuery("")}
                placeholder={`Search ${icons.length} icons…`}
                className="h-10 pr-10 pl-9"
              />
              <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 border px-1.5 font-mono text-[10px] text-muted-foreground">
                /
              </kbd>
            </label>
            <div className="flex items-end gap-2">
              <Segmented
                label="Colors"
                options={COLOR_FILTERS}
                value={colorFilter}
                onChange={setColorFilter}
                format={(c) => (c === "all" ? "All" : c)}
              />
              <CopyButton text={INSTALL_ALL} label="Install all" className="h-[30px]" />
              <Button variant="outline" className="lg:hidden" onClick={() => setCustomizing(true)}>
                <SlidersHorizontal /> Customize
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground" aria-live="polite">
            <span>
              {results.length} {results.length === 1 ? "icon" : "icons"}
              {category && <span className="capitalize"> in {category}</span>}
            </span>
            {(query || category || colorFilter !== "all") && (
              <button type="button" onClick={clear} className="flex items-center gap-1 hover:text-foreground">
                <X className="size-3" /> Clear filters
              </button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] pt-px pl-px">
              {results.map((icon) => (
                <IconTile
                  key={icon.meta.name}
                  icon={icon}
                  variant={variantOf(icon.meta.name)}
                  size={customization.size}
                  trigger={customization.trigger}
                  onOpen={() => setSelected(icon.meta.name)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 border border-dashed p-16 text-center text-sm text-muted-foreground">
              No icon matches{query && ` “${query}”`}.
              <Button variant="outline" size="sm" onClick={clear}>
                Clear filters
              </Button>
            </div>
          )}
        </main>
      </div>

      <Sheet open={customizing} onOpenChange={setCustomizing}>
        <SheetContent side="left" className="w-80 overflow-y-auto p-5">
          <SheetHeader className="p-0">
            <SheetTitle>Customize</SheetTitle>
          </SheetHeader>
          {sidebar}
        </SheetContent>
      </Sheet>

      <IconSheet
        icon={selected ? (iconsByName.get(selected) ?? null) : null}
        variant={selected ? variantOf(selected) : ""}
        customization={customization}
        onSelect={setSelected}
        onClose={() => setSelected(null)}
      />
    </AnimatedIconsProvider>
  )
}
