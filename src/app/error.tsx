"use client"

import * as React from "react"

/**
 * Frontera de error de la ruta. Si el render falla, el visitante ve algo con la
 * identidad del sitio y un botón para reintentar, en lugar de la pantalla
 * genérica de Next.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("[portafolio] Error de render:", error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">Error</p>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Algo se rompió de nuestro lado</h1>
        <p className="text-muted-foreground" lang="en">
          Something broke on our side.
        </p>
      </div>
      {error.digest && (
        <code className="rounded border border-soft bg-card px-2 py-1 font-mono text-xs text-muted-foreground">
          {error.digest}
        </code>
      )}
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-action px-6 py-3 text-sm font-bold text-action-foreground transition-colors hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Reintentar · Retry
      </button>
    </main>
  )
}
