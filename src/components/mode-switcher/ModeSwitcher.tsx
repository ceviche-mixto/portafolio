"use client"

import * as React from "react"
import { Terminal, Briefcase } from "lucide-react"
import { useModeStore } from "@/store/useModeStore"
import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/lib/utils"

/**
 * Alterna entre la vista de reclutador y la de desarrollador.
 *
 * `aria-pressed` es lo que convierte un botón en un interruptor para un lector
 * de pantalla: sin él se anuncia como acción suelta y no comunica si está
 * activado (ver A-06).
 */
export function ModeSwitcher() {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const toggleMode = useModeStore((state) => state.toggleMode)
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-pressed={isDeveloperMode}
      aria-label={isDeveloperMode ? t.mode.switchToRecruiter : t.mode.switchToDeveloper}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:px-4 md:text-sm",
        isDeveloperMode
          ? "border-green-500/50 bg-green-950/80 text-green-400"
          : "border-transparent bg-white text-zinc-900"
      )}
    >
      {isDeveloperMode ? (
        <Terminal className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Briefcase className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">
        {isDeveloperMode ? t.mode.developer : t.mode.recruiter}
      </span>
    </button>
  )
}
