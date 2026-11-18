import "../globals.css"
import { RootDocument, rootMetadata } from "@/components/site/RootDocument"

export const metadata = rootMetadata

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="en">{children}</RootDocument>
}
