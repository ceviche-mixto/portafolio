import { Odometer } from "@/components/motion/Odometer"
import { GRADEO_VERIFIED } from "@/content/projects/gradeo"
import { getGradeoStats } from "@/lib/gradeo-stats"
import { fill, formatDate, translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"

/**
 * Lectura viva de GRADEO, sólo en la página del caso. La consulta está
 * cacheada y acotada en el tiempo. Si la base no responde en la regeneración,
 * se publica el recuento verificado con su fecha, nunca un hueco ni un cero.
 */
export async function GradeoLiveMetrics({ lang }: { lang: Language }) {
  const stats = await getGradeoStats()
  const t = translations[lang].caseStudy.live
  // Las cifras ruedan hasta su valor al entrar en pantalla; sin dato, un guion fijo.
  const format = (value: number | null) =>
    value === null ? "—" : <Odometer value={value} locale={lang === "es" ? "es-PE" : "en-US"} />

  const items = stats.live
    ? [
        { label: t.professors, value: format(stats.professors) },
        { label: t.reviews, value: format(stats.reviews) },
      ]
    : [
        { label: t.professors, value: format(GRADEO_VERIFIED.professors) },
        { label: t.reviews, value: format(GRADEO_VERIFIED.approvedReviews) },
        { label: t.rlsTables, value: format(GRADEO_VERIFIED.tables) },
      ]

  return (
    <section aria-labelledby="lectura-gradeo" className="rounded-2xl border border-border bg-card p-6">
      <h3 id="lectura-gradeo" className="font-semibold text-foreground">
        {stats.live ? t.title : t.snapshotTitle}
      </h3>
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="mt-1 font-mono text-2xl font-bold text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-muted-foreground">
        {stats.live ? t.note : fill(t.snapshotNote, { date: formatDate(GRADEO_VERIFIED.asOf, lang) })}
      </p>
    </section>
  )
}
