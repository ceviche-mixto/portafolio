"use client"

import * as React from "react"
import { useModeStore } from "@/store/useModeStore"
import { useTranslation } from "@/hooks/useTranslation"
import { Star, Users, DatabaseZap, Code2, TrendingUp, Sparkles } from "lucide-react"
import Image from "next/image"
import { PROJECTS } from "@/lib/site"
import { useGradeoCopy } from "@/hooks/useGradeoCopy"
import type { GradeoStats } from "@/lib/gradeo-stats"

const CARD =
  "portfolio-panel card-sheen relative h-full overflow-hidden p-6"

/** Formatea con separador de miles del idioma activo, o un guion si no hay dato. */
function useNumber() {
  const { lang } = useTranslation()
  return React.useCallback(
    (value: number | null) =>
      value === null ? "—" : value.toLocaleString(lang === "es" ? "es-PE" : "en-US"),
    [lang]
  )
}

/**
 * Métricas en vivo.
 *
 * Los valores llegan por props desde el servidor: antes se pedían desde el
 * navegador tras hidratar, así que las tarjetas mostraban "..." y saltaban al
 * número (ver P-04).
 */
function LiveStatsWidget({ stats }: { stats: GradeoStats }) {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t } = useTranslation()
  const fmt = useNumber()

  return (
    <div className={`${CARD} group flex flex-col`}>
      {isDeveloperMode ? (
        <div className="mb-3 flex w-fit items-center gap-2 rounded bg-success/10 px-2 py-1 font-mono text-xs text-success">
          <span className="h-2 w-2 rounded-full bg-success motion-safe:animate-pulse" />
          select count(*)
        </div>
      ) : null}

      <h3 className="mb-6 text-xl font-bold tracking-tight text-foreground">
        {t.bento.liveMetrics}
      </h3>

      {/* Las cifras se centran en el espacio restante: con `justify-between` la
          tarjeta alta dejaba un hueco muerto entre el título y los números. */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-5">
        <div>
          <span className="metric-in block bg-gradient-to-r from-highlight to-accent-secondary bg-clip-text text-4xl font-black text-transparent">
            {fmt(stats.reviews)}
          </span>
          <p className="flex items-center gap-1.5 text-sm font-medium text-body">
            <Star className="h-4 w-4 text-warning" aria-hidden="true" />
            {t.bento.totalReviews}
          </p>
        </div>
        <div>
          <span className="metric-in block text-2xl font-black text-foreground">{fmt(stats.professors)}</span>
          <p className="flex items-center gap-1.5 text-sm font-medium text-body">
            <Users className="h-4 w-4 text-info" aria-hidden="true" />
            {t.bento.listedProfessors}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {stats.pending ? t.bento.loadingLabel : stats.live ? t.bento.liveLabel : t.bento.unavailableLabel}
        </p>
      </div>

      <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-10 transition-opacity group-hover:opacity-20">
        <DatabaseZap className="h-48 w-48 text-highlight" aria-hidden="true" />
      </div>
    </div>
  )
}

/** A genuine product screenshot replaces a map unrelated to the hiring task. */
function ProductWidget() {
  const { t } = useTranslation()
  return (
    <figure className={`${CARD} flex flex-col gap-4`}>
      <h3 className="text-lg font-bold text-foreground">{t.bento.screenshotTitle}</h3>
      <a href={PROJECTS.gradeo.demo ?? undefined} target="_blank" rel="noopener noreferrer"
        aria-label={`${t.gradeo.viewLive} — GRADEO (${t.nav.newTab})`}
        className="block overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4">
        <Image src="/images/gradeo-producto.jpg" width={650} height={480}
          sizes="(min-width: 1280px) 800px, (min-width: 768px) 66vw, 100vw" alt={t.bento.screenshotAlt}
          className="h-auto w-full" />
      </a>
      <figcaption className="text-xs text-muted-foreground">{t.bento.screenshotNote}</figcaption>
    </figure>
  )
}

/** Top 5 real. En modo desarrollador enseña la consulta que lo produce. */
function TopRatedWidget({ stats }: { stats: GradeoStats }) {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t } = useTranslation()

  return (
    <div className={`${CARD} flex flex-col`}>
      <h3 className="mb-4 text-lg font-bold text-foreground">{t.bento.topRated}</h3>

      {isDeveloperMode ? (
        <pre
          tabIndex={0}
          role="region"
          aria-label={t.bento.topRated}
          className="flex-1 overflow-x-auto rounded-xl border border-soft/50 bg-surface-deep/50 p-3 font-mono text-[10px] leading-relaxed text-body sm:text-xs"
        >
          <code>{`select first_name, last_name, total_score
from   public.professors
where  review_count > 0
order  by total_score desc,
          review_count desc
limit  5;`}</code>
        </pre>
      ) : stats.topProfessors.length > 0 ? (
        <ol className="flex flex-col gap-3">
          {stats.topProfessors.map((prof, i) => (
            <li key={prof.name} className="flex items-center justify-between gap-3">
              <span className="min-w-0 text-sm font-medium text-subtle [overflow-wrap:anywhere]">
                <span className="text-muted-foreground tabular-nums">{i + 1}.</span> {prof.name}
              </span>
              <span className="flex flex-none items-center gap-1 text-sm font-bold text-warning tabular-nums">
                {prof.score}
                <Star className="h-3 w-3 fill-warning text-warning" aria-hidden="true" />
                <span className="sr-only">{t.bento.scale}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted-foreground">
          {stats.pending ? t.bento.loadingLabel : stats.live ? t.bento.emptyRanking : t.bento.unavailableLabel}
        </p>
      )}
    </div>
  )
}

/**
 * Cuarta celda del bento.
 *
 * Antes esta celda, en modo reclutador (el modo por defecto), sólo contenía una
 * caja punteada pidiendo activar el modo desarrollador: espacio privilegiado
 * gastado en una instrucción (ver U-08). Ahora dice por qué existe GRADEO, y al
 * cambiar de modo se convierte en el trigger real.
 *
 * El código que se muestra es `update_professor_metrics()` tal como corre en
 * producción. La versión anterior era un promedio ponderado inventado que no
 * existe en el esquema (ver C-01).
 */
function InsightWidget({ stats }: { stats: GradeoStats }) {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t } = useTranslation()
  const copy = useGradeoCopy(stats)

  if (!isDeveloperMode) {
    return (
      <div className={`${CARD} group flex flex-col justify-center`}>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
          <TrendingUp className="h-5 w-5 text-highlight" aria-hidden="true" />
          {t.bento.impactTitle}
        </h3>
        <p className="text-sm leading-relaxed text-body">
          {copy(t.bento.impactText)}
        </p>
        <p className="mt-4 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          {t.bento.devHint}
        </p>
        <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-[0.07] transition-opacity group-hover:opacity-15">
          <Sparkles className="h-40 w-40 text-highlight" aria-hidden="true" />
        </div>
      </div>
    )
  }

  return (
    <div className={`${CARD} flex flex-col gap-3 ring-1 ring-success/20`}>
      <div>
        <h3 className="flex items-center gap-2 font-mono text-sm font-bold text-success">
          <Code2 className="h-4 w-4" aria-hidden="true" />
          {t.bento.insightTitle}
        </h3>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          {t.bento.insightSubtitle}
        </p>
      </div>

      <pre
        tabIndex={0}
        role="region"
        aria-label={t.bento.insightTitle}
        className="overflow-x-auto rounded-lg border border-soft bg-surface-deep/80 p-3 font-mono text-[10px] leading-relaxed text-body"
      >
        <code>{`select avg(rating_personality), avg(rating_methodology),
       avg(rating_clarity), avg(rating_fairness), count(*)
into   _p, _m, _c, _f, _count
from   public.reviews
where  professor_id = _prof_id
  and  status = 'approved';

_total := (_p + _m + _c + _f) / 4.0;`}</code>
      </pre>

      <p className="text-[11px] leading-relaxed text-muted-foreground">{t.bento.insightNote}</p>
    </div>
  )
}

export function GradeoBento({ stats }: { stats: GradeoStats }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:auto-rows-[minmax(210px,auto)]">
      <div className="rise-in">
        <LiveStatsWidget stats={stats} />
      </div>
      <div className="rise-in md:col-span-2 md:row-span-2">
        <ProductWidget />
      </div>
      <div className="rise-in">
        <TopRatedWidget stats={stats} />
      </div>
      <div className="rise-in md:col-span-3">
        <InsightWidget stats={stats} />
      </div>
    </div>
  )
}
