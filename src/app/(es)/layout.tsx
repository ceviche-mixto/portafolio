import "../globals.css"
import { RootDocument, rootMetadata } from "@/components/site/RootDocument"

export const metadata = rootMetadata

export default function SpanishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="es">{children}</RootDocument>
}
