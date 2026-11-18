import Link from "next/link"
import { PROJECTS, projectPath } from "@/content/projects"
import { fill, translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"

/**
 * Enfoque de ingeniería: la decisión principal de cada caso, enlazada a su
 * explicación completa. Es la única superficie oscura de la portada.
 */
export function EngineeringSection({ lang }: { lang: Language }) {
  const t = translations[lang]

  return (
    <section id="ingenieria" aria-labelledby="ingenieria-titulo" className="theme-ink py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <h2 id="ingenieria-titulo" className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight text-foreground">
          {t.engineering.title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-body">{t.engineering.subtitle}</p>
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {PROJECTS.map((project) => {
            const decision = project.decisions[0]
            return (
              <li key={project.slug} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
                <p className="font-mono text-xs font-bold tracking-widest text-highlight uppercase">{project.name}</p>
                <h3 className="text-xl font-semibold text-foreground">{decision.title[lang]}</h3>
                <p className="text-sm leading-relaxed text-body">{decision.choice[lang]}</p>
                <Link
                  href={`${projectPath(lang, project.slug)}#${decision.id}`}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight underline underline-offset-4"
                >
                  {fill(t.engineering.readDecision, { name: project.name })}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
