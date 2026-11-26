"use client"

import { usePathname } from "next/navigation"
import { Pause, Play } from "lucide-react"
import { setMotionPaused, useMotionPaused } from "./motion-pause"

/**
 * Pausa compartida del movimiento continuo (WCAG 2.2.2): el fondo global y la
 * pista del logo del hero. Vive en la cabecera para no ensuciar el hero y
 * sólo aparece en la portada, que es donde algo se mueve solo. Con movimiento
 * reducido no hay bucle que pausar y se oculta desde CSS, sin mover nada.
 */
export function MotionPauseToggle({ home, label }: { home: string; label: string }) {
  const paused = useMotionPaused()
  const pathname = usePathname()
  if (pathname !== home) return null
  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label={label}
      onClick={() => setMotionPaused(!paused)}
      className="tactile flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-card text-subtle transition-colors hover:border-strong hover:text-foreground motion-reduce:hidden"
    >
      {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
    </button>
  )
}
