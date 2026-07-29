"use client"

import * as React from "react"
import { useModeStore } from "@/store/useModeStore"
import { useTranslation } from "@/hooks/useTranslation"
import { MapPin, Star, Users, DatabaseZap, Code2, TrendingUp, Sparkles } from "lucide-react"
import { useGradeoCopy } from "@/hooks/useGradeoCopy"
import type { GradeoStats } from "@/lib/gradeo-stats"

const CARD =
  "h-full rounded-3xl border border-zinc-800 bg-zinc-900 p-6 relative overflow-hidden"

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
        <div className="absolute top-4 right-4 flex items-center gap-2 rounded bg-green-500/10 px-2 py-1 font-mono text-xs text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-500 motion-safe:animate-pulse" />
          select count(*)
        </div>
      ) : null}

      <h3 className="mb-6 text-xl font-bold tracking-tight text-white">
        {t.bento.liveMetrics}
      </h3>

      {/* Las cifras se centran en el espacio restante: con `justify-between` la
          tarjeta alta dejaba un hueco muerto entre el título y los números. */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-5">
        <div>
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-4xl font-black text-transparent">
            {fmt(stats.reviews)}
          </span>
          <p className="flex items-center gap-1.5 text-sm font-medium text-zinc-300">
            <Star className="h-4 w-4 text-yellow-500" aria-hidden="true" />
            {t.bento.totalReviews}
          </p>
        </div>
        <div>
          <span className="text-2xl font-black text-white">{fmt(stats.professors)}</span>
          <p className="flex items-center gap-1.5 text-sm font-medium text-zinc-300">
            <Users className="h-4 w-4 text-blue-400" aria-hidden="true" />
            {t.bento.listedProfessors}
          </p>
        </div>
        {stats.live ? (
          <p className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
            {t.bento.liveLabel}
          </p>
        ) : null}
      </div>

      <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-10 transition-opacity group-hover:opacity-20">
        <DatabaseZap className="h-48 w-48 text-emerald-400" aria-hidden="true" />
      </div>
    </div>
  )
}

/**
 * Ubicación del campus.
 *
 * El iframe ya no se carga de entrada: se pinta un mapa estático en CSS y el
 * mapa real sólo se pide cuando alguien lo pulsa, quitando un tercero del
 * arranque (ver P-05). El iframe además lleva `title`, que faltaba (A-05).
 */
function LocationWidget() {
  const { t } = useTranslation()
  const [showMap, setShowMap] = React.useState(false)

  return (
    <div className={`${CARD} group flex flex-col`}>
      <div className="relative z-20">
        <h3 className="mb-1 flex items-center gap-1.5 text-lg font-bold text-white">
          <MapPin className="h-5 w-5 text-red-500" aria-hidden="true" />
          {t.bento.campus}
        </h3>
        <p className="text-sm text-zinc-300">{t.bento.city}</p>
      </div>

      <div className="absolute inset-0 top-16 overflow-hidden rounded-b-3xl select-none">
        {showMap ? (
          <iframe
            title={t.bento.mapTitle}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              border: 0,
              filter: "invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%)",
            }}
            src="https://www.openstreetmap.org/export/embed.html?bbox=-79.8643%2C-6.7616%2C-79.8623%2C-6.7596&layer=mapnik&marker=-6.7606043%2C-79.8632655"
          />
        ) : (
          <>
            {/* Retícula tipo mapa, en CSS: cero peticiones. */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="absolute h-16 w-16 rounded-full border-2 border-red-500/60 motion-safe:animate-ping"
                style={{ animationDuration: "2s" }}
              />
              <div className="absolute h-32 w-32 rounded-full border border-red-500/30" />
              <div className="absolute h-48 w-48 rounded-full border border-red-500/10" />
              <MapPin className="relative h-6 w-6 text-red-500" aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="absolute inset-0 flex items-end justify-center pb-4 text-[11px] font-medium text-zinc-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400"
            >
              <span className="rounded-full border border-zinc-700 bg-black/70 px-3 py-1.5 backdrop-blur-md">
                {t.bento.loadMap}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/** Top 5 real. En modo desarrollador enseña la consulta que lo produce. */
function TopRatedWidget({ stats }: { stats: GradeoStats }) {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t } = useTranslation()

  return (
    <div className={`${CARD} flex flex-col`}>
      <h3 className="mb-4 text-lg font-bold text-white">{t.bento.topRated}</h3>

      {isDeveloperMode ? (
        <pre
          tabIndex={0}
          role="region"
          aria-label={t.bento.topRated}
          className="flex-1 overflow-x-auto rounded-xl border border-zinc-800/50 bg-black/50 p-3 font-mono text-[10px] leading-relaxed text-zinc-300 sm:text-xs"
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
              <span className="truncate text-sm font-medium text-zinc-200">
                <span className="text-zinc-400 tabular-nums">{i + 1}.</span> {prof.name}
              </span>
              <span className="flex flex-none items-center gap-1 text-sm font-bold text-yellow-400 tabular-nums">
                {prof.score}
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" aria-hidden="true" />
                <span className="sr-only">{t.bento.scale}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-zinc-400">—</p>
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
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
          <TrendingUp className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          {t.bento.impactTitle}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-300">
          {copy(t.bento.impactText)}
        </p>
        <p className="mt-4 font-mono text-[10px] tracking-wide text-zinc-400 uppercase">
          {t.bento.devHint}
        </p>
        <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-[0.07] transition-opacity group-hover:opacity-15">
          <Sparkles className="h-40 w-40 text-emerald-400" aria-hidden="true" />
        </div>
      </div>
    )
  }

  return (
    <div className={`${CARD} flex flex-col gap-3 ring-1 ring-green-500/20`}>
      <div>
        <h3 className="flex items-center gap-2 font-mono text-sm font-bold text-green-400">
          <Code2 className="h-4 w-4" aria-hidden="true" />
          {t.bento.insightTitle}
        </h3>
        <p className="mt-1 font-mono text-[10px] text-zinc-400">
          {t.bento.insightSubtitle}
        </p>
      </div>

      <pre
        tabIndex={0}
        role="region"
        aria-label={t.bento.insightTitle}
        className="overflow-x-auto rounded-lg border border-zinc-800 bg-black/80 p-3 font-mono text-[10px] leading-relaxed text-zinc-300"
      >
        <code>{`select avg(rating_personality), avg(rating_methodology),
       avg(rating_clarity), avg(rating_fairness), count(*)
into   _p, _m, _c, _f, _count
from   public.reviews
where  professor_id = _prof_id
  and  status = 'approved';

_total := (_p + _m + _c + _f) / 4.0;`}</code>
      </pre>

      <p className="text-[11px] leading-relaxed text-zinc-400">{t.bento.insightNote}</p>
    </div>
  )
}

export function GradeoBento({ stats }: { stats: GradeoStats }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:auto-rows-[210px]">
      <div className="md:row-span-2">
        <LiveStatsWidget stats={stats} />
      </div>
      <div>
        <LocationWidget />
      </div>
      <div className="md:row-span-2">
        <TopRatedWidget stats={stats} />
      </div>
      <div>
        <InsightWidget stats={stats} />
      </div>
    </div>
  )
}
