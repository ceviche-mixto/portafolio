"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ShieldAlert, Fingerprint, Search, Layers, TrendingUp } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { useGradeoCopy } from "@/hooks/useGradeoCopy"
import type { GradeoStats } from "@/lib/gradeo-stats"
import { ProjectLinks } from "@/components/project/ProjectLinks"
import { PROJECTS } from "@/lib/site"

/**
 * Contenido del case study de GRADEO.
 *
 * Vive en su propio módulo porque arrastra el Dialog de Base UI (~34 KB
 * comprimidos). Se monta ya abierto la primera vez que alguien pulsa el botón,
 * así que quien no lo abre nunca no descarga nada de esto.
 *
 * El texto describe el sistema que corre hoy: cola de moderación, roles con PIN,
 * rate limiting por hash de IP y la decisión sobre trigramas (ver C-04). Antes
 * contaba la V1 y omitía todo eso, lo que hacía parecer el sistema más ingenuo de
 * lo que es.
 */
export default function GradeoCaseStudyDialog({
  open,
  onOpenChange,
  stats,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  stats: GradeoStats
}) {
  const { t } = useTranslation()
  const copy = useGradeoCopy(stats)

  const sections = [
    { Icon: ShieldAlert, tone: "text-red-400", title: t.caseStudy.challengeTitle, body: t.caseStudy.challengeText },
    { Icon: Fingerprint, tone: "text-emerald-400", title: t.caseStudy.solutionTitle, body: t.caseStudy.solutionText },
    { Icon: Search, tone: "text-cyan-400", title: t.caseStudy.searchTitle, body: t.caseStudy.searchText },
    { Icon: Layers, tone: "text-purple-400", title: t.caseStudy.scaleTitle, body: t.caseStudy.scaleText },
    { Icon: TrendingUp, tone: "text-blue-400", title: t.caseStudy.resultTitle, body: copy(t.caseStudy.resultText) },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto rounded-[2rem] border-zinc-800 bg-zinc-950 p-6 text-zinc-100 md:max-w-2xl md:p-8">
        {/* pr-16: el botón de cerrar ocupa 56 px desde el borde (12 de margen + 44
            de ancho); con pr-12 un título largo podía meterse por debajo. */}
        <DialogHeader className="pr-16">
          <DialogTitle className="mb-2 text-xl font-black md:text-2xl">
            {t.caseStudy.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-300 md:text-base">
            {t.caseStudy.desc}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col gap-6">
          {sections.map(({ Icon, tone, title, body }) => (
            <div key={title} className="flex gap-4">
              <Icon className={`mt-1 h-6 w-6 flex-none ${tone}`} aria-hidden="true" />
              <div>
                <h4 className="mb-1 text-lg font-bold text-white">{title}</h4>
                <p className="text-sm leading-relaxed text-zinc-300">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-6">
          <ProjectLinks
            repo={PROJECTS.gradeo.repo}
            demo={PROJECTS.gradeo.demo}
            liveLabel={t.gradeo.viewLive}
            codeLabel={t.gradeo.viewCode}
            newTabHint={t.nav.newTab}
            projectName="GRADEO"
            codeOnRequest={PROJECTS.gradeo.codeOnRequest}
            onRequestLabel={t.projects.codeOnRequest}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
