"use client"

// End-to-end harness: every icon × variant, played together so e2e/variants.spec.ts can diff frames.
// Exists only in builds made with NEXT_PUBLIC_E2E=1; everywhere else it's a 404.
import type { AnimatedIconHandle } from "@kovenlabs/animated-icons"
import { notFound } from "next/navigation"
import { useEffect, useRef } from "react"

import { icons } from "@/lib/catalog"

/** Quarter speed: every variant stays on screen 4× as long, so slow CI screenshots can't skip a short one. */
const SPEED = 0.25

/** Tiles per chunk (4 rows of 18): the test plays and screenshots one chunk at a time, so each shot stays small and fast. */
const CHUNK = 72

const tiles = icons.flatMap((Icon) =>
  Icon.meta.variants.map((variant) => ({ Icon, variant, id: `${Icon.meta.name}/${variant}` })),
)

export default function VariantsHarness() {
  if (process.env.NEXT_PUBLIC_E2E !== "1") notFound()
  return <Harness />
}

function Harness() {
  const refs = useRef(new Map<string, AnimatedIconHandle>())
  useEffect(() => {
    Object.assign(window, {
      __play: (chunk: number) =>
        tiles.slice(chunk * CHUNK, (chunk + 1) * CHUNK).forEach(({ id }) => void refs.current.get(id)?.play()),
    })
  }, [])
  const chunks = Array.from({ length: Math.ceil(tiles.length / CHUNK) }, (_, i) => tiles.slice(i * CHUNK, (i + 1) * CHUNK))
  return (
    <div className="bg-background" style={{ width: 1152 }}>
      {chunks.map((chunk, i) => (
        <div key={i} data-chunk={i} className="flex flex-wrap">
          {chunk.map(({ Icon, variant, id }) => (
            <div key={id} data-tile={id} style={{ width: 64, height: 64, display: "grid", placeItems: "center" }}>
              <Icon
                variant={variant}
                size={40}
                speed={SPEED}
                trigger="manual"
                ref={(handle) => {
                  if (handle) refs.current.set(id, handle)
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
