import { notFound } from "next/navigation"

import { getPageImageUrl } from "@/lib/shared"
import { ogImage } from "@/lib/og"
import { source } from "@/lib/source"

export const revalidate = false

export async function GET(_req: Request, { params }: RouteContext<"/og/docs/[...slug]">) {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page) notFound()

  return ogImage({
    label: page.slugs.length ? `docs / ${page.slugs.join(" / ")}` : "docs",
    title: page.data.title,
    description: page.data.description ?? "",
  })
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }))
}
