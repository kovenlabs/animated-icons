"use client"

// End-to-end harness: every icon × variant, played together so e2e/variants.spec.ts can diff frames.
// Exists only in builds made with NEXT_PUBLIC_E2E=1; everywhere else it's a 404.
import type { AnimatedIconHandle } from "@kovenlabs/animated-icons"
import { notFound } from "next/navigation"
import { useEffect, useRef } from "react"

import { icons } from "@/lib/catalog"

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
    Object.assign(window, { __play: () => refs.current.forEach((handle) => void handle.play()) })
  }, [])
  return (
    <div className="flex flex-wrap bg-background" style={{ width: 1152 }}>
      {tiles.map(({ Icon, variant, id }) => (
        <div key={id} data-tile={id} style={{ width: 64, height: 64, display: "grid", placeItems: "center" }}>
          <Icon
            variant={variant}
            size={40}
            trigger="manual"
            ref={(handle) => {
              if (handle) refs.current.set(id, handle)
            }}
          />
        </div>
      ))}
    </div>
  )
}
