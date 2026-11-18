"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { useSystemReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { useMotionStore } from "@/store/useMotionStore"

/**
 * Pausa opcional del movimiento. También publica la preferencia efectiva en
 * `<html data-motion>`, que es lo que leen las reglas CSS de movimiento.
 */
export function MotionSwitcher({ labels }: { labels: { pause: string; resume: string; system: string } }) {
  const systemReduced = useSystemReducedMotion()
  const paused = useMotionStore((state) => state.paused)
  const togglePaused = useMotionStore((state) => state.togglePaused)
  const reduced = systemReduced || paused

  React.useEffect(() => {
    void useMotionStore.persist.rehydrate()
  }, [])
  React.useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full"
  }, [reduced])

  const label = systemReduced ? labels.system : paused ? labels.resume : labels.pause
  const Icon = reduced ? Play : Pause
  return (
    <button type="button" onClick={togglePaused} disabled={systemReduced}
      aria-pressed={reduced} aria-label={label} title={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-body transition-colors hover:border-strong hover:text-foreground disabled:cursor-default">
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
