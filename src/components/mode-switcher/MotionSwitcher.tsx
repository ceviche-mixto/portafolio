"use client"

import { Pause, Play } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { useSystemReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { useMotionStore } from "@/store/useMotionStore"

export function MotionSwitcher() {
  const { t } = useTranslation()
  const systemReduced = useSystemReducedMotion()
  const paused = useMotionStore((state) => state.paused)
  const togglePaused = useMotionStore((state) => state.togglePaused)
  const reduced = systemReduced || paused
  const label = systemReduced ? t.motion.system : paused ? t.motion.resume : t.motion.pause
  const Icon = reduced ? Play : Pause
  return (
    <button type="button" onClick={togglePaused} disabled={systemReduced}
      aria-pressed={reduced} aria-label={label} title={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card/80 text-body transition-colors hover:border-strong hover:text-foreground disabled:cursor-default">
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
