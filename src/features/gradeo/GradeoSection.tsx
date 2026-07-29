"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTranslation } from "@/hooks/useTranslation"
import { useGradeoCopy } from "@/hooks/useGradeoCopy"
import { Reveal } from "@/components/motion/Reveal"
import { GradeoBento } from "./GradeoBento"
import { GradeoCaseStudy } from "./GradeoCaseStudy"
import { ProjectLinks } from "@/components/project/ProjectLinks"
import { PROJECTS } from "@/lib/site"
import type { GradeoStats } from "@/lib/gradeo-stats"

/**
 * La secuencia de scroll es el único bloque que de verdad necesita Framer Motion
 * (progreso de scroll + `AnimatePresence`). Queda muy por debajo del pliegue, así
 * que se carga aparte y no pesa en el primer render (ver P-01).
 */
const GradeoScrolly = dynamic(
  () => import("./GradeoScrolly").then((m) => m.GradeoScrolly),
  { ssr: false, loading: () => <div className="h-[200vh]" aria-hidden="true" /> }
)

export function GradeoSection({ stats }: { stats: GradeoStats }) {
  const { t } = useTranslation()
  const copy = useGradeoCopy(stats)

  return (
    <section id="gradeo" className="relative z-10 scroll-mt-20 bg-zinc-950 pb-32">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal className="mb-12">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold tracking-widest text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
            {t.gradeo.eyebrow}
          </p>
          <h2 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-6xl">
            {t.gradeo.title}
          </h2>
          <p className="text-xl text-zinc-300">{t.gradeo.subtitle}</p>
          <p className="mt-4 max-w-2xl text-balance text-zinc-400">
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
            />
          </div>
        </Reveal>

        <GradeoBento stats={stats} />

        <div className="mt-8">
          <GradeoCaseStudy stats={stats} />
        </div>
      </div>

      <GradeoScrolly />
    </section>
  )
}
