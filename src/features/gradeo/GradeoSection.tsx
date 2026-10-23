"use client"

import * as React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { useGradeoCopy } from "@/hooks/useGradeoCopy"
import { Reveal } from "@/components/motion/Reveal"
import { GradeoBento } from "./GradeoBento"
import { GradeoCaseStudy } from "./GradeoCaseStudy"
import { ProjectLinks } from "@/components/project/ProjectLinks"
import { PROJECTS } from "@/lib/site"
import { GradeoLifecycle } from "./GradeoLifecycle"
import type { GradeoStats } from "@/lib/gradeo-stats"

export function GradeoSection({ stats }: { stats: GradeoStats }) {
  const { t } = useTranslation()
  const copy = useGradeoCopy(stats)

  return (
    <section id="gradeo" className="relative z-10 bg-background pb-32">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal className="mb-12">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-highlight/20 bg-highlight/10 px-3 py-1 text-xs font-bold tracking-widest text-highlight">
            <span className="h-2 w-2 rounded-full bg-highlight motion-safe:animate-pulse" />
            {t.gradeo.eyebrow}
          </p>
          <h2 className="mb-2 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            {t.gradeo.title}
          </h2>
          <p className="text-xl text-body">{t.gradeo.subtitle}</p>
          <p className="mt-4 max-w-2xl text-balance text-muted-foreground">
            {copy(t.gradeo.oneLiner)}
          </p>

          {/* Los enlaces al proyecto van arriba, no sólo al final del case study:
              quien ya está convencido no debería tener que abrir un modal para
              encontrar el código (ver U-03). */}
          <div className="mt-6">
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
        </Reveal>

        <GradeoBento stats={stats} />

        <div className="mt-8">
          <GradeoCaseStudy stats={stats} />
        </div>
      </div>

      <GradeoLifecycle />
    </section>
  )
}
