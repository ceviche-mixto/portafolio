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
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-6 text-center">
      <p className="font-mono text-sm tracking-widest text-zinc-400 uppercase">Error</p>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">Algo se rompió de nuestro lado</h1>
        <p className="text-zinc-400" lang="en">
          Something broke on our side.
        </p>
      </div>
      {error.digest && (
        <code className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-xs text-zinc-400">
          {error.digest}
        </code>
      )}
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        Reintentar · Retry
      </button>
    </main>
  )
}
