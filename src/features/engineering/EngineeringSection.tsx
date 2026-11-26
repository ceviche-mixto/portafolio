import Link from "next/link"
import { HoverImageReveal } from "@/components/motion/HoverImageReveal"
import { ScrollCarousel } from "@/components/motion/ScrollCarousel"
import { SplitText } from "@/components/motion/SplitText"
import { PROJECTS, projectPath } from "@/content/projects"
import { fill, translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"

/**
 * Enfoque de ingeniería: la decisión principal de cada caso, enlazada a su
 * explicación completa. Superficie de tinta translúcida: deja ver el fondo
 * global (`.ink-glass`).
 *
 * Las tarjetas van en un carrusel guiado por scroll (`ScrollCarousel`): en
 * escritorio avanzan en horizontal con el scroll vertical; en móvil son una
 * pista táctil con scroll-snap. Con puntero fino, cada tarjeta asoma la
 * captura de su caso junto al cursor (`HoverImageReveal`).
 */
export function EngineeringSection({ lang }: { lang: Language }) {
  const t = translations[lang]
  const total = String(PROJECTS.length).padStart(2, "0")

  return (
    <section id="ingenieria" aria-labelledby="ingenieria-titulo" className="theme-ink ink-glass py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <h2 id="ingenieria-titulo" className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight text-foreground">
          <SplitText text={t.engineering.title} />
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-body">{t.engineering.subtitle}</p>
      </div>
      <div className="mt-12">
        <ScrollCarousel label={t.engineering.title}>
          {PROJECTS.map((project, index) => {
            const decision = project.decisions[0]
            const d = project.relation === "own" ? t.caseStudy : t.caseStudy.system
            return (
              <li key={project.slug}>
                {/* Contenedor: con ancho de tarjeta de escritorio, necesidad, elección y coste en tres columnas. */}
                <HoverImageReveal image={project.cover} className="@container flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 lg:p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span className="font-bold text-highlight">{project.name}</span> · {t.relation[project.relation]}
                    </p>
                    <p aria-hidden="true" className="shrink-0 font-mono text-xs whitespace-nowrap text-muted-foreground">
                      {String(index + 1).padStart(2, "0")} / {total}
                    </p>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground lg:text-2xl">{decision.title[lang]}</h3>
                  <dl className="grid gap-4 text-sm leading-relaxed @xl:grid-cols-3 @xl:gap-6">
                    {([
                      [d.need, decision.need, "@max-xl:hidden"],
                      [d.choice, decision.choice, ""],
                      [d.cost, decision.cost, "@max-xl:hidden"],
                    ] as const).map(([label, text, visibility]) => (
                      <div key={label} className={visibility}>
                        <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{label}</dt>
                        <dd className="mt-2 text-body">{text[lang]}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href={`${projectPath(lang, project.slug)}#${decision.id}`}
                    className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight underline underline-offset-4"
                  >
                    {fill(t.engineering.readDecision, { name: project.name })}
                    <span aria-hidden="true">→</span>
                  </Link>
                </HoverImageReveal>
              </li>
            )
          })}
        </ScrollCarousel>
      </div>
    </section>
  )
}
