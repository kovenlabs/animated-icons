"use client"

import { Bell, Check, Heart, Loader, Rocket, Send, Star, type AnimatedIconHandle } from "@kovenlabs/animated-icons"
import { useRef, type ReactNode } from "react"

import { slotColors, useIconStyle } from "@/lib/icon-style"

/** A live strip in the docs: each cell shows one setting, captioned with the prop that produces it. */
function Strip({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <figure className="not-prose my-6 flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {children}
      </div>
      {note && <figcaption className="text-sm text-fd-muted-foreground">{note}</figcaption>}
    </figure>
  )
}

function Cell({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="flex flex-col bg-fd-background">
      <div className="drafting flex h-28 items-center justify-center gap-3">{children}</div>
      <code className="border-t px-3 py-2 font-mono text-xs">{caption}</code>
    </div>
  )
}

export function TriggersPreview() {
  const send = useRef<AnimatedIconHandle>(null)
  return (
    <Strip note="Point, click and scroll: these are live.">
      <Cell caption='trigger="hover"'>
        <Bell size={44} trigger="hover" aria-label="bell" />
      </Cell>
      <Cell caption='trigger="click"'>
        <Heart size={44} trigger="click" variant="burst" aria-label="heart" />
      </Cell>
      <Cell caption='trigger="inView"'>
        <Check size={44} trigger="inView" interval={1200} aria-label="check" />
      </Cell>
      <Cell caption='trigger="auto"'>
        <Loader size={44} aria-label="loader" />
      </Cell>
      <Cell caption='trigger="manual"'>
        <button
          type="button"
          onClick={() => void send.current?.play()}
          className="flex items-center gap-2 border bg-fd-background px-2 py-1 text-xs hover:bg-fd-accent"
        >
          <Send ref={send} size={28} trigger="manual" aria-hidden /> play()
        </button>
      </Cell>
    </Strip>
  )
}

export function CornersPreview() {
  return (
    <Strip note="The same drawing, three ways. Each corner is reshaped at render, not hand-drawn.">
      {(["round", "bevel", "sharp"] as const).map((corners) => (
        <Cell key={corners} caption={`corners="${corners}"`}>
          <Star
            size={48}
            corners={corners}
            cornerRadius={corners === "sharp" ? undefined : 3}
            trigger="hover"
            aria-label={`star, ${corners}`}
          />
          <Bell
            size={48}
            corners={corners}
            cornerRadius={corners === "sharp" ? undefined : 3}
            trigger="hover"
            aria-label={`bell, ${corners}`}
          />
        </Cell>
      ))}
    </Strip>
  )
}

export function StrokePreview() {
  return (
    <Strip note="In grid units, so a width scales with the icon's size.">
      {[1, 1.5, 2, 2.5, 3].map((width) => (
        <Cell key={width} caption={`strokeWidth={${width}}`}>
          <Rocket size={48} strokeWidth={width} trigger="hover" aria-label={`rocket, stroke ${width}`} />
        </Cell>
      ))}
    </Strip>
  )
}

/** Each slot alone, in the reader's current palette, so "primary, secondary, accent" stops being abstract. */
export function SlotsPreview() {
  const { style } = useIconStyle()
  // resolved colors, never var(--icon-*): an icon's own colors set those very variables, so that would be a cycle
  const painted = slotColors(style.colors)
  const dim = "color-mix(in oklch, var(--muted-foreground) 25%, transparent)"
  const only = (slot: "primary" | "secondary" | "accent") => ({
    primary: slot === "primary" ? painted.primary : dim,
    secondary: slot === "secondary" ? painted.secondary : dim,
    accent: slot === "accent" ? painted.accent : dim,
  })
  return (
    <Strip
      note={
        Object.keys(style.colors).length > 0
          ? "Painted with the palette you picked under Icon style."
          : "Painted with this site's theme. Pick a palette under Icon style, in the header, to repaint them."
      }
    >
      <Cell caption="all three">
        <Rocket size={52} trigger="hover" aria-label="rocket" />
      </Cell>
      <Cell caption="primary: hull">
        <Rocket size={52} colors={only("primary")} trigger="hover" aria-label="rocket, primary only" />
      </Cell>
      <Cell caption="secondary: fins">
        <Rocket size={52} colors={only("secondary")} trigger="hover" aria-label="rocket, secondary only" />
      </Cell>
      <Cell caption="accent: flame">
        <Rocket size={52} colors={only("accent")} trigger="hover" aria-label="rocket, accent only" />
      </Cell>
    </Strip>
  )
}
