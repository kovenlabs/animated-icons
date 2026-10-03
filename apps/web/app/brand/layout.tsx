import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Brand",
  description:
    "Escape, the Animated Icons mark: an open-cornered canvas with an accent badge escaping along a motion trail. Sizes, colors and files.",
  path: "/brand",
})

export default function BrandLayout({ children }: LayoutProps<"/brand">) {
  return children
}
