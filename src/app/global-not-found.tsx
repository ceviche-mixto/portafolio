import "./globals.css"
import type { Metadata } from "next"
import { fontVariables } from "@/components/site/fonts"
import { buttonVariants } from "@/components/ui/button-variants"
import { HOME_PATH } from "@/lib/language"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "404 — Giancarlo Larios",
  robots: { index: false },
}

/**
 * 404 de todo el sitio. Cada idioma tiene su propio root layout, así que esta
 * página trae su documento y da el mensaje en los dos idiomas.
 */
export default function GlobalNotFound() {
  return (
    <html lang="es-PE" className={fontVariables}>
      <body className="antialiased bg-background text-foreground">
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="font-mono text-6xl font-black text-muted-foreground">404</p>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">Esta página no existe</h1>
            <p className="text-muted-foreground" lang="en">This page does not exist.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={HOME_PATH.es} className={buttonVariants()}>Volver al inicio</a>
            <a href={HOME_PATH.en} lang="en" className={buttonVariants({ variant: "secondary" })}>Back home</a>
          </div>
        </main>
      </body>
    </html>
  )
}
