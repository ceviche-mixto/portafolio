import Image from "next/image"
import { Code2, DatabaseZap, Sparkles, Star, TrendingUp, Users } from "lucide-react"
import { GRADEO_SNAPSHOT } from "@/lib/gradeo-stats"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { PROJECTS } from "@/lib/site"

const CARD = "portfolio-panel card-sheen relative h-full overflow-clip p-6"

/**
 * Datos, captura y cálculo de GRADEO en una sola estructura.
 *
 * Las cifras son el recuento fechado de producción: la portada es estática y no
 * depende de que la base responda.
 */
export function GradeoBento({ lang, fill }: { lang: Language; fill: (template: string) => string }) {
  const t = translations[lang]
  const format = (value: number) => value.toLocaleString(lang === "es" ? "es-PE" : "en-US")

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:auto-rows-[minmax(210px,auto)]">
      <div className="rise-in">
        <div className={`${CARD} group flex flex-col`}>
          <h3 className="mb-6 text-xl font-bold tracking-tight text-foreground">{t.bento.liveMetrics}</h3>
          <div className="relative z-10 flex flex-1 flex-col justify-center gap-5">
            <div>
              <span className="metric-in block text-4xl font-black text-highlight">
                {format(GRADEO_SNAPSHOT.reviews)}
              </span>
              <p className="flex items-center gap-1.5 text-sm font-medium text-body">
                <Star className="h-4 w-4 text-warning" aria-hidden="true" />
                {t.bento.totalReviews}
              </p>
            </div>
            <div>
              <span className="metric-in block text-2xl font-black text-foreground">
                {format(GRADEO_SNAPSHOT.professors)}
              </span>
              <p className="flex items-center gap-1.5 text-sm font-medium text-body">
                <Users className="h-4 w-4 text-info" aria-hidden="true" />
                {t.bento.listedProfessors}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{t.bento.snapshotLabel}</p>
          </div>
          <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-10 transition-opacity group-hover:opacity-20">
            <DatabaseZap className="h-48 w-48 text-highlight" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="rise-in md:col-span-2 md:row-span-2">
        <figure className={`${CARD} flex flex-col gap-4`}>
          <h3 className="text-lg font-bold text-foreground">{t.bento.screenshotTitle}</h3>
          <a href={PROJECTS.gradeo.demo ?? undefined} target="_blank" rel="noopener noreferrer"
            aria-label={`${t.gradeo.viewLive} — GRADEO (${t.nav.newTab})`}
            className="block overflow-clip rounded-xl">
            <Image src="/images/gradeo-producto.jpg" width={650} height={480}
              sizes="(min-width: 1280px) 800px, (min-width: 768px) 66vw, 100vw" alt={t.bento.screenshotAlt}
              className="h-auto w-full" />
          </a>
          <figcaption className="text-xs text-muted-foreground">{t.bento.screenshotNote}</figcaption>
        </figure>
      </div>

      <div className="rise-in">
        <div className={`${CARD} group flex flex-col justify-center`}>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
            <TrendingUp className="h-5 w-5 text-highlight" aria-hidden="true" />
            {t.bento.impactTitle}
          </h3>
          <p className="text-sm leading-relaxed text-body">{fill(t.bento.impactText)}</p>
          <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-[0.07] transition-opacity group-hover:opacity-15">
            <Sparkles className="h-40 w-40 text-highlight" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* `update_professor_metrics()` tal como corre en producción. */}
      <div className="rise-in md:col-span-3">
        <div className={`${CARD} flex flex-col gap-3`}>
          <div>
            <h3 className="flex items-center gap-2 font-mono text-sm font-bold text-success">
              <Code2 className="h-4 w-4" aria-hidden="true" />
              {t.bento.insightTitle}
            </h3>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{t.bento.insightSubtitle}</p>
          </div>
          <pre
            tabIndex={0}
            role="region"
            aria-label={t.bento.insightTitle}
            className="overflow-x-auto rounded-lg border border-soft bg-background p-3 font-mono text-xs leading-relaxed text-body"
          >
            <code>{`select avg(rating_personality), avg(rating_methodology),
       avg(rating_clarity), avg(rating_fairness), count(*)
into   _p, _m, _c, _f, _count
from   public.reviews
where  professor_id = _prof_id
  and  status = 'approved';

_total := (_p + _m + _c + _f) / 4.0;`}</code>
          </pre>
          <p className="text-xs leading-relaxed text-muted-foreground">{t.bento.insightNote}</p>
        </div>
      </div>
    </div>
  )
}
