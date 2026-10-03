import { pageMetadata } from "@/lib/seo"

// in the layout, not the page: a page-level `openGraph` would drop the opengraph-image file's tags
export const metadata = pageMetadata({
  title: "Icons",
  description:
    "Search, customize and copy 70 animated icons: pick colors from your theme, size, speed, corners and trigger, then copy the JSX or the install command.",
  path: "/icons",
})

export default function IconsLayout({ children }: LayoutProps<"/icons">) {
  return children
}
