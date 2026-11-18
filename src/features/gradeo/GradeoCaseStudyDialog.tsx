"use client"

import * as React from "react"
import { Fingerprint, Layers, Search, ShieldAlert, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectLinks } from "@/components/project/ProjectLinks"
import type { CaseStudyContent } from "./GradeoCaseStudy"

const ICONS = [
  { Icon: ShieldAlert, tone: "text-danger" },
  { Icon: Fingerprint, tone: "text-highlight" },
  { Icon: Search, tone: "text-highlight" },
  { Icon: Layers, tone: "text-discovery" },
  { Icon: TrendingUp, tone: "text-info" },
]

/**
 * Contenido del caso técnico de GRADEO.
 *
 * Vive en su propio módulo porque arrastra el Dialog de Base UI: quien no lo
 * abre nunca no lo descarga. El texto describe el sistema que corre hoy: cola
 * de moderación, roles con PIN, rate limiting por hash de IP y la decisión sobre
 * trigramas.
 */
export default function GradeoCaseStudyDialog({
  open,
  onOpenChange,
  content,
  returnFocus,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: CaseStudyContent
  returnFocus: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-modal="true" finalFocus={returnFocus} closeLabel={content.closeLabel} className="flex max-h-[85dvh] w-[95vw] flex-col overflow-clip rounded-2xl border-soft bg-background p-6 text-foreground md:max-w-2xl md:p-8">
        {/* pr-16: el botón de cerrar ocupa 56 px desde el borde (12 de margen + 44
            de ancho), así un título largo no queda por debajo. */}
        <DialogHeader className="shrink-0 pr-16">
          <DialogTitle className="mb-2 text-xl font-black md:text-2xl">{content.title}</DialogTitle>
          <DialogDescription className="text-sm text-body md:text-base">{content.desc}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto overscroll-contain" tabIndex={0} role="region" aria-label={content.title}>
          <div className="mt-6 flex flex-col gap-6">
            {content.sections.map(({ title, body }, i) => {
              const { Icon, tone } = ICONS[i % ICONS.length]
              return (
                <div key={title} className="flex gap-4">
                  <Icon className={`mt-1 h-6 w-6 flex-none ${tone}`} aria-hidden="true" />
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-foreground">{title}</h3>
                    <p className="text-sm leading-relaxed text-body">{body}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 border-t border-soft pt-6">
            <ProjectLinks {...content.links} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
