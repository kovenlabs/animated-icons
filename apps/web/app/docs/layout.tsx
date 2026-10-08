import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { CSSProperties } from "react"

import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

// The site header sits above the docs like a Fumadocs banner: the layout offsets its sidebar,
// table of contents and mobile subnav by this height (the header is h-14).
const belowSiteHeader = { "--fd-banner-height": "3.5rem" } as CSSProperties

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <div style={belowSiteHeader} className="docs-shell">
      <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
        {children}
      </DocsLayout>
    </div>
  )
}
