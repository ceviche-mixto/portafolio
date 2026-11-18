"use client"

import { useEffect, useRef, useState, type ComponentProps, type ComponentType, type RefObject } from "react"
import { Button } from "@/components/ui/button"
import type { ProjectLinks } from "@/components/project/ProjectLinks"

export type CaseStudyContent = {
  title: string
  desc: string
  closeLabel: string
  sections: { title: string; body: string }[]
  links: ComponentProps<typeof ProjectLinks>
}

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: CaseStudyContent
  returnFocus: RefObject<HTMLButtonElement | null>
}

/**
 * El diálogo se carga al primer clic, no al renderizar la sección: así Base UI
 * queda fuera del bundle inicial. El botón está presente y enfocable desde el
 * HTML del servidor.
 */
export function GradeoCaseStudy({
  labels,
  content,
}: {
  labels: { button: string; loading: string; failed: string }
  content: CaseStudyContent
}) {
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
      <Button
        ref={triggerRef}
        onClick={openCaseStudy}
        disabled={status === "loading"}
        aria-haspopup="dialog" aria-expanded={open} aria-busy={status === "loading"}
      >
        {labels.button}
      </Button>
      <p role="status" className="mt-2 min-h-5 text-sm text-body">
        {status === "loading" ? labels.loading : status === "failed" ? labels.failed : ""}
      </p>

      {/* Una vez pedido, el componente permanece montado: reabrirlo no vuelve a
          descargar el chunk. */}
      {DialogComponent && (
        <DialogComponent open={open} onOpenChange={setOpen} content={content} returnFocus={triggerRef} />
      )}
    </>
  )
}
