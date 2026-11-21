"use client"

import * as React from "react"
import { buttonVariants } from "@/components/ui/button-variants"
import type { Language } from "@/lib/language"

const COPY = {
  es: { title: "Algo se rompió de nuestro lado", retry: "Reintentar" },
  en: { title: "Something broke on our side", retry: "Retry" },
} as const

/**
 * Frontera de error de cada idioma. Si el render falla, el visitante ve la
 * identidad del sitio y un botón para reintentar en lugar de la pantalla
 * genérica de Next.
 */
export function ErrorView({
  lang,
  error,
  reset,
}: {
  lang: Language
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("[portafolio] Error de render:", error)
  }, [error])

  const copy = COPY[lang]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">Error</p>
      <h1 className="text-2xl font-bold text-foreground">{copy.title}</h1>
      {error.digest && (
        <code className="rounded border border-soft bg-card px-2 py-1 font-mono text-xs text-muted-foreground">
          {error.digest}
        </code>
      )}
      <button type="button" onClick={reset} className={buttonVariants()}>{copy.retry}</button>
    </main>
  )
}
