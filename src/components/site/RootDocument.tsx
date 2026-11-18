import type { Metadata } from "next"
import { SiteChrome } from "@/components/chrome/SiteChrome"
import { htmlLang, type Language } from "@/lib/language"
import { SITE_URL } from "@/lib/site"
import { fontVariables } from "./fonts"

/** Base de las URLs absolutas (Open Graph, canonical) para todo el árbol. */
export const rootMetadata: Metadata = { metadataBase: new URL(SITE_URL) }

/** Documento compartido por los dos root layouts; sólo cambia el idioma. */
export function RootDocument({
  lang,
  children,
}: {
  lang: Language
  children: React.ReactNode
}) {
  return (
    <html lang={htmlLang(lang)} className={`scroll-smooth ${fontVariables}`}>
      <body className="antialiased bg-background text-foreground selection:bg-highlight/20">
        <SiteChrome lang={lang} />
        {children}
      </body>
    </html>
  )
}
