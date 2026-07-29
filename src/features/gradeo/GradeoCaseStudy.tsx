"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTranslation } from "@/hooks/useTranslation"
import type { GradeoStats } from "@/lib/gradeo-stats"

/**
 * El diálogo se carga al primer clic, no al renderizar la sección: así Base UI
 * queda fuera del bundle inicial (ver P-01). El botón es HTML normal, así que
 * está presente y enfocable desde el primer momento.
 */
const GradeoCaseStudyDialog = dynamic(() => import("./GradeoCaseStudyDialog"), {
  ssr: false,
})

export function GradeoCaseStudy({ stats }: { stats: GradeoStats }) {
  const { t } = useTranslation()
  const [requested, setRequested] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  function openCaseStudy() {
    setRequested(true)
    setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={openCaseStudy}
        className="rounded-full bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-900 shadow-xl transition-colors hover:bg-white md:text-base"
      >
        {t.gradeo.caseStudyBtn}
      </button>

      {/* Una vez pedido, el componente permanece montado: reabrirlo no vuelve a
          descargar el chunk. */}
      {requested && (
        <GradeoCaseStudyDialog open={open} onOpenChange={setOpen} stats={stats} />
      )}
    </>
  )
}
