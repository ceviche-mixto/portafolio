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
  returnFocus,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  stats: GradeoStats
  returnFocus: React.RefObject<HTMLButtonElement | null>
}) {
  const { t } = useTranslation()
  const copy = useGradeoCopy(stats)

  const sections = [
    { Icon: ShieldAlert, tone: "text-danger", title: t.caseStudy.challengeTitle, body: t.caseStudy.challengeText },
    { Icon: Fingerprint, tone: "text-highlight", title: t.caseStudy.solutionTitle, body: t.caseStudy.solutionText },
    { Icon: Search, tone: "text-accent-secondary", title: t.caseStudy.searchTitle, body: t.caseStudy.searchText },
    { Icon: Layers, tone: "text-discovery", title: t.caseStudy.scaleTitle, body: t.caseStudy.scaleText },
    { Icon: TrendingUp, tone: "text-info", title: t.caseStudy.resultTitle, body: copy(t.caseStudy.resultText) },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-modal="true" finalFocus={returnFocus} closeLabel={t.nav.close} className="flex max-h-[85dvh] w-[95vw] flex-col overflow-hidden rounded-2xl border-soft bg-background p-6 text-foreground md:max-w-2xl md:p-8">
        {/* pr-16: el botón de cerrar ocupa 56 px desde el borde (12 de margen + 44
            de ancho); con pr-12 un título largo podía meterse por debajo. */}
        <DialogHeader className="shrink-0 pr-16">
          <DialogTitle className="mb-2 text-xl font-black md:text-2xl">
            {t.caseStudy.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-body md:text-base">
            {t.caseStudy.desc}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto overscroll-contain" tabIndex={0} role="region" aria-label={t.caseStudy.title}>
        <div className="mt-6 flex flex-col gap-6">
          {sections.map(({ Icon, tone, title, body }) => (
            <div key={title} className="flex gap-4">
              <Icon className={`mt-1 h-6 w-6 flex-none ${tone}`} aria-hidden="true" />
              <div>
                <h3 className="mb-1 text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-body">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-soft pt-6">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
