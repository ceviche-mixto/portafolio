import type { Metadata } from "next"
import { SiteChrome } from "@/components/chrome/SiteChrome"
import { MagneticField } from "@/components/motion/MagneticField"
import { SplashLoader } from "@/components/motion/SplashLoader"
import { htmlLang, type Language } from "@/lib/language"
import { SITE_URL } from "@/lib/site"
import { fontVariables } from "./fonts"

/** Base de las URLs absolutas (Open Graph, canonical) para todo el árbol. */
export const rootMetadata: Metadata = { metadataBase: new URL(SITE_URL) }

/**
 * Documento compartido por los dos root layouts; sólo cambia el idioma.
 * `suppressHydrationWarning`: el script de la intro marca `data-splash` en
 * <html> antes de hidratar (SplashLoader).
 */
export function RootDocument({
  lang,
  children,
}: {
  lang: Language
  children: React.ReactNode
}) {
  return (
    <html lang={htmlLang(lang)} className={`scroll-smooth ${fontVariables}`} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground selection:bg-highlight/20">
        <SplashLoader lang={lang} />
        <SiteChrome lang={lang} />
        {children}
        <MagneticField />
      </body>
    </html>
  )
}
