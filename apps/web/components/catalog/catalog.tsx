"use client"

import type { IconCategory, Trigger } from "@kovenlabs/animated-icons"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { InstallMenu } from "@/components/install-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { icons, iconsByName, searchIcons, type CatalogIcon } from "@/lib/catalog"

import { CategoryList, ColorsFilter, PREVIEWS, PreviewPicker, SizePicker, TriggerPicker, type Preview } from "./filters"
import { IconDetail, StylePanel } from "./inspector"
import { IconTile } from "./icon-tile"

const CYCLE_MS = 2200
const WIDE = "(min-width: 1280px)"

/** Whether the inspector has room to sit beside the grid; below that it opens as a sheet. */
function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(WIDE)
      query.addEventListener("change", onChange)
      return () => query.removeEventListener("change", onChange)
    },
    () => window.matchMedia(WIDE).matches,
    () => true,
  )
}

function Inspector({
  icon,
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
  return (
    <Tabs defaultValue="icon" className="gap-5">
      <TabsList className="w-full">
        <TabsTrigger value="icon">Icon</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
      </TabsList>
      <TabsContent value="icon">
        <IconDetail
          icon={icon}
          variant={variant}
          onVariant={onVariant}
          size={size}
          trigger={trigger}
          onSelect={onSelect}
        />
      </TabsContent>
      <TabsContent value="style">
        <StylePanel />
      </TabsContent>
    </Tabs>
  )
}

export function Catalog() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<IconCategory | null>(null)
  const [colors, setColors] = useState<number | null>(null)
  const [preview, setPreview] = useState<Preview>("1st")
  const [step, setStep] = useState(0)
  const [size, setSize] = useState(32)
  const [trigger, setTrigger] = useState<Trigger | "default">("default")
  const [selected, setSelected] = useState<string | null>(null)
  const [variant, setVariant] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [browsing, setBrowsing] = useState(false)
  const search = useRef<HTMLInputElement>(null)
  const wide = useWide()

  // the colors filter counts against what the other filters leave
  const pool = searchIcons({ query, category, colors: null })
  const results = colors === null ? pool : pool.filter((icon) => icon.meta.colors === colors)

  const variantIndex = preview === "cycle" ? step : PREVIEWS.indexOf(preview)
  const variantOf = (icon: CatalogIcon) => icon.meta.variants[variantIndex % icon.meta.variants.length]!

  // the board always shows something: the picked icon, or the first result
  const shown = (selected ? iconsByName.get(selected) : undefined) ?? results[0] ?? icons[0]!
  const shownVariant = variant && shown.meta.variants.includes(variant) ? variant : variantOf(shown)

  const select = (name: string) => {
    setSelected(name)
    setVariant(null)
    if (!wide) setSheetOpen(true)
    const url = new URL(window.location.href)
    url.searchParams.set("icon", name)
    window.history.replaceState(null, "", url)
  }

  // cycle: every icon steps to its next move together
  useEffect(() => {
    if (preview !== "cycle") return
    const id = setInterval(() => setStep((s) => s + 1), CYCLE_MS)
    return () => clearInterval(id)
  }, [preview])

  // deep link: /icons?icon=bell opens on that icon (read after mount: the page is static)
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

  const filtered = Boolean(query || category || colors !== null)
  const clear = () => {
    setQuery("")
    setCategory(null)
    setColors(null)
  }

  const inspector = (
    <Inspector
      icon={shown}
      variant={shownVariant}
      onVariant={setVariant}
      size={size}
      trigger={trigger}
      onSelect={select}
    />
  )

  return (
    <>
      <div className="flex w-full flex-1">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r p-3 lg:block">
          <CategoryList category={category} onCategory={setCategory} />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="drafting flex flex-col gap-5 border-b px-4 pt-8 pb-5 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="dot-headline text-5xl leading-none sm:text-6xl" aria-live="polite">
                  {results.length} {results.length === 1 ? "icon" : "icons"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filtered ? (
                    <>
                      of {icons.length}
                      {category && <span className="capitalize">, in {category}</span>}
                      {query && <>, matching “{query}”</>}
                    </>
                  ) : (
                    "Click one to inspect it. Every one is drawn on the same 24-unit grid."
                  )}
                </p>
              </div>
              <InstallMenu name="all" />
            </div>

            <label className="relative">
              <span className="sr-only">Search icons</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={search}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Escape" && setQuery("")}
                placeholder="Search by name, meaning or move: bell, unread, shake"
                className="h-12 bg-background pr-12 pl-12 text-base md:text-base"
              />
              <kbd className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 border px-1.5 font-mono text-xs text-muted-foreground">
                /
              </kbd>
            </label>

            <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
              <ColorsFilter value={colors} onChange={setColors} pool={pool} />
              <PreviewPicker value={preview} onChange={setPreview} />
              <SizePicker value={size} onChange={setSize} />
              <TriggerPicker value={trigger} onChange={setTrigger} />
              <Button variant="outline" className="h-8 lg:hidden" onClick={() => setBrowsing(true)}>
                <SlidersHorizontal /> Categories and style
              </Button>
              {filtered && (
                <button
                  type="button"
                  onClick={clear}
                  className="flex h-8 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" /> Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {results.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] pt-px pl-px">
                {results.map((icon) => (
                  <IconTile
                    key={icon.meta.name}
                    icon={icon}
                    variant={variantOf(icon)}
                    size={size}
                    trigger={trigger}
                    selected={icon === shown}
                    onOpen={() => select(icon.meta.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 border border-dashed p-16 text-center">
                <p className="font-medium">No icon matches{query && ` “${query}”`}.</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Try a broader word, like the object (arrow, chat, file) or what it means (alert, success, unread).
                </p>
                <Button variant="outline" size="sm" onClick={clear}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </main>

        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-[26rem] shrink-0 overflow-y-auto border-l p-5 xl:block">
          {inspector}
        </aside>
      </div>

      <Sheet open={sheetOpen && !wide} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full gap-0 overflow-y-auto p-5 sm:max-w-md">
          <SheetHeader className="sr-only">
            <SheetTitle>{shown.meta.name}</SheetTitle>
          </SheetHeader>
          {inspector}
        </SheetContent>
      </Sheet>

      <Sheet open={browsing} onOpenChange={setBrowsing}>
        <SheetContent side="left" className="w-80 gap-6 overflow-y-auto p-5">
          <SheetHeader className="p-0">
            <SheetTitle>Categories and style</SheetTitle>
          </SheetHeader>
          <CategoryList
            category={category}
            onCategory={(next) => {
              setCategory(next)
              setBrowsing(false)
            }}
          />
          <StylePanel />
        </SheetContent>
      </Sheet>
    </>
  )
}
