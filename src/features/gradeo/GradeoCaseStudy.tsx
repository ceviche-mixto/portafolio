"use client"

import { useEffect, useRef, useState, type ComponentType, type RefObject } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import type { GradeoStats } from "@/lib/gradeo-stats"

/**
 * El diálogo se carga al primer clic, no al renderizar la sección: así Base UI
 * queda fuera del bundle inicial (ver P-01). El botón es HTML normal, así que
 * está presente y enfocable desde el primer momento.
 */
type DialogProps = { open: boolean; onOpenChange: (open: boolean) => void; stats: GradeoStats; returnFocus: RefObject<HTMLButtonElement | null> }

export function GradeoCaseStudy({ stats }: { stats: GradeoStats }) {
  const { t } = useTranslation()
  const [DialogComponent, setDialogComponent] = useState<ComponentType<DialogProps> | null>(null)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle")
  const mounted = useRef(true)
  const triggerRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])

  async function openCaseStudy() {
    if (DialogComponent) { setOpen(true); return }
    setStatus("loading")
    try {
      const loadedDialog = await import("./GradeoCaseStudyDialog")
      if (!mounted.current) return
      setDialogComponent(() => loadedDialog.default)
      setStatus("idle")
      setOpen(true)
    } catch {
      if (mounted.current) setStatus("failed")
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openCaseStudy}
        disabled={status === "loading"}
        aria-haspopup="dialog" aria-expanded={open} aria-busy={status === "loading"}
        className="min-h-11 rounded-full bg-action px-6 py-3 text-sm font-bold text-action-foreground transition-colors hover:bg-foreground disabled:cursor-wait disabled:opacity-70 md:text-base"
      >
        {t.gradeo.caseStudyBtn}
      </button>
      <p role="status" className="mt-2 min-h-5 text-sm text-body">
        {status === "loading" ? t.gradeo.loadingCaseStudy : status === "failed" ? t.gradeo.failedCaseStudy : ""}
      </p>

      {/* Una vez pedido, el componente permanece montado: reabrirlo no vuelve a
          descargar el chunk. */}
      {DialogComponent && (
        <DialogComponent open={open} onOpenChange={setOpen} stats={stats} returnFocus={triggerRef} />
      )}
    </>
  )
}
