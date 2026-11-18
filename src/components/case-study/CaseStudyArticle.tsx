import Link from "next/link"
import { ProjectFigure } from "@/components/project/ProjectFigure"
import { ProjectLinks } from "@/components/project/ProjectLinks"
import { StatusBadge } from "@/components/project/StatusBadge"
import { buttonVariants } from "@/components/ui/button-variants"
import { nextProject, projectPath, type Project } from "@/content/projects"
import { fill, formatDate, translations } from "@/lib/i18n"
import { HOME_PATH, type Language } from "@/lib/language"
import { ArchitectureFlow } from "./ArchitectureFlow"
import { EmphasisTrack } from "./ArchitectureEmphasis"

/**
 * Página de un caso. Sigue siempre la misma secuencia: resultado visible,
 * responsabilidad, restricción del dominio, arquitectura, decisiones con su
 * coste, evidencia y siguiente caso.
 */
export function CaseStudyArticle({
  project,
  lang,
  live,
}: {
  project: Project
  lang: Language
  /** Bloque opcional con datos vivos, dentro de la evidencia. */
  live?: React.ReactNode
}) {
  const t = translations[lang]
  const c = t.caseStudy
  const home = HOME_PATH[lang]
  const next = nextProject(project.slug)
  const toc = [
    { id: "resultado", label: c.result },
    { id: "responsabilidad", label: c.responsibility },
    { id: "restriccion", label: c.constraint },
    { id: "arquitectura", label: c.architecture },
    { id: "decisiones", label: c.decisions },
    { id: "resultados", label: c.results },
  ]

  return (
    <article aria-labelledby="caso-titulo" className="mx-auto max-w-5xl px-6 pt-36 pb-24 sm:pt-32 lg:px-10">
      <nav aria-label={c.breadcrumb}>
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <li><Link href={home} className="underline-offset-4 hover:underline">{c.home}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`${home}#proyectos`} className="underline-offset-4 hover:underline">{c.projects}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">{project.name}</li>
        </ol>
      </nav>

      <header className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-sm font-bold tracking-widest text-foreground uppercase">{project.name}</p>
          <StatusBadge status={project.status} label={t.status[project.status]} />
        </div>
        <h1 id="caso-titulo" className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] leading-[1.06] font-bold tracking-[-0.03em] text-balance text-foreground">
          {project.headline[lang]}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">{project.summary[lang]}</p>
        <div className="mt-8">
          <ProjectLinks
            repo={project.repo}
            demo={project.url}
            liveLabel={`${t.projects.open} ${project.name}`}
            codeLabel={t.projects.viewCode}
            newTabHint={t.nav.newTab}
            projectName={project.name}
            codeOnRequest={project.codeOnRequest}
            onRequestLabel={t.projects.codeOnRequest}
            requestCopy={t.projects.codeRequest}
          />
        </div>
      </header>

      <ProjectFigure media={project.cover} lang={lang} sizes="(min-width: 1024px) 960px, 100vw" className="mt-12" />

      <nav aria-labelledby="indice" className="mt-14 border-y border-border py-6">
        <h2 id="indice" className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{c.onThisPage}</h2>
        <ul className="mt-3 flex flex-wrap gap-x-6">
          {toc.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="inline-flex min-h-11 items-center text-sm font-medium text-body underline decoration-border-strong underline-offset-4 hover:text-foreground">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-16 flex flex-col gap-20">
        <section id="resultado" aria-labelledby="resultado-titulo">
          <h2 id="resultado-titulo" className="text-2xl font-bold text-foreground md:text-3xl">{c.result}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-body">{project.result[lang]}</p>
        </section>

        <div className="grid gap-12 md:grid-cols-2">
          <section id="responsabilidad" aria-labelledby="responsabilidad-titulo">
            <h2 id="responsabilidad-titulo" className="text-2xl font-bold text-foreground">{c.responsibility}</h2>
            <p className="mt-4 leading-relaxed text-body">{project.responsibility[lang]}</p>
          </section>
          <section id="restriccion" aria-labelledby="restriccion-titulo">
            <h2 id="restriccion-titulo" className="text-2xl font-bold text-foreground">{c.constraint}</h2>
            <p className="mt-4 leading-relaxed text-body">{project.constraint[lang]}</p>
          </section>
        </div>

        <section id="arquitectura" aria-labelledby="arquitectura-titulo">
          <EmphasisTrack steps={project.architecture.steps.length}>
          <h2 id="arquitectura-titulo" className="text-2xl font-bold text-foreground md:text-3xl">{c.architecture}</h2>
          <p id="arquitectura-flujo" className="mt-2 text-lg text-body">{project.architecture.title[lang]}</p>
          <div className="mt-8">
            <ArchitectureFlow steps={project.architecture.steps} lang={lang} labelledBy="arquitectura-flujo" />
          </div>
          {project.architecture.note && (
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">{project.architecture.note[lang]}</p>
          )}
          </EmphasisTrack>
        </section>

        <section id="decisiones" aria-labelledby="decisiones-titulo">
          <h2 id="decisiones-titulo" className="text-2xl font-bold text-foreground md:text-3xl">{c.decisions}</h2>
          <div className="mt-8 flex flex-col gap-10">
            {project.decisions.map((decision) => (
              <article key={decision.id} id={decision.id} aria-labelledby={`${decision.id}-titulo`} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h3 id={`${decision.id}-titulo`} className="text-xl font-semibold text-foreground">{decision.title[lang]}</h3>
                <dl className="mt-6 grid gap-6 md:grid-cols-2">
                  {([
                    [c.need, decision.need],
                    [c.choice, decision.choice],
                    [c.cost, decision.cost],
                    [c.proof, decision.proof],
                  ] as const).map(([label, text]) => (
                    <div key={label}>
                      <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{label}</dt>
                      <dd className="mt-2 leading-relaxed text-body">{text[lang]}</dd>
                    </div>
                  ))}
                </dl>
                {decision.code && (
                  <figure className="mt-6">
                    <figcaption className="font-mono text-xs text-muted-foreground">{decision.code.label}</figcaption>
                    <pre
                      tabIndex={0}
                      role="region"
                      aria-label={decision.code.label}
                      className="theme-ink mt-2 overflow-x-auto rounded-xl p-4 font-mono text-[13px] leading-relaxed"
                    >
                      <code>{decision.code.source}</code>
                    </pre>
                  </figure>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="resultados" aria-labelledby="resultados-titulo">
          <h2 id="resultados-titulo" className="text-2xl font-bold text-foreground md:text-3xl">{c.results}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {fill(c.asOf, { date: formatDate(project.evidence.asOf, lang) })}. {project.evidence.source[lang]}
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.evidence.items.map((item) => (
              <div key={item.label.es} className="rounded-2xl border border-border bg-card p-5">
                <dt className="text-sm text-muted-foreground">{item.label[lang]}</dt>
                <dd className="mt-2 font-mono text-2xl font-bold text-foreground">{item.value[lang]}</dd>
                {item.note && <dd className="mt-1 text-sm text-muted-foreground">{item.note[lang]}</dd>}
              </div>
            ))}
          </dl>
          {live && <div className="mt-6">{live}</div>}
          {project.environment && (
            <p className="mt-6 rounded-2xl border border-evidence bg-evidence/30 p-5 text-sm leading-relaxed text-foreground">
              {project.environment[lang]}
            </p>
          )}
          {project.gallery.map((media) => (
            <ProjectFigure key={media.src} media={media} lang={lang} sizes="(min-width: 1024px) 960px, 100vw" className="mt-10" />
          ))}
          <p className="mt-8 text-sm text-muted-foreground">
            {c.stack}: {project.stack.join(" · ")}
          </p>
        </section>
      </div>

      <footer className="mt-20 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`${home}#${project.slug}`} className={buttonVariants({ variant: "secondary" })}>
          <span aria-hidden="true">←</span> {c.back}
        </Link>
        <Link href={projectPath(lang, next.slug)} className={buttonVariants()}>
          {c.next}: {next.name} <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </article>
  )
}
