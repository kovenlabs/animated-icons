import type { Metadata } from "next"

import { Catalog } from "@/components/catalog/catalog"

export const metadata: Metadata = {
  title: "Icons",
  description: "Search, customize and copy every animated icon.",
}

export default function IconsPage() {
  return <Catalog />
}
