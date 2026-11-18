import { getGradeoStats } from "@/lib/gradeo-stats"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"

/**
 * Lectura viva de GRADEO, sólo en la página del caso. La consulta está
 * cacheada y acotada en el tiempo; sin respuesta se dice «no disponible», que
 * es distinto de cero.
 */
export async function GradeoLiveMetrics({ lang }: { lang: Language }) {
  const stats = await getGradeoStats()
  const t = translations[lang].caseStudy.live
  const format = (value: number | null) =>
    value === null ? "—" : value.toLocaleString(lang === "es" ? "es-PE" : "en-US")

  return (
    <section aria-labelledby="lectura-en-vivo" className="rounded-2xl border border-border bg-card p-6">
      <h3 id="lectura-en-vivo" className="font-semibold text-foreground">{t.title}</h3>
      {stats.live ? (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">{t.professors}</dt>
              <dd className="mt-1 font-mono text-2xl font-bold text-foreground">{format(stats.professors)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">{t.reviews}</dt>
              <dd className="mt-1 font-mono text-2xl font-bold text-foreground">{format(stats.reviews)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">{t.note}</p>
        </>
      ) : (
        <p className="mt-3 text-sm text-body">{t.unavailable}</p>
      )}
    </section>
  )
}
