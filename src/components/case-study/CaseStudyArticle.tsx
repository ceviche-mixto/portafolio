import Link from "next/link"
import { HoverImageReveal } from "@/components/motion/HoverImageReveal"
import { Odometer } from "@/components/motion/Odometer"
import { SplitText } from "@/components/motion/SplitText"
import { ProjectFigure } from "@/components/project/ProjectFigure"
import { ProjectLinks } from "@/components/project/ProjectLinks"
import { StatusBadge } from "@/components/project/StatusBadge"
import { buttonVariants } from "@/components/ui/button-variants"
import { nextProject, projectPath, type Project } from "@/content/projects"
import { fill, formatDate, translations } from "@/lib/i18n"
import { HOME_PATH, type Language } from "@/lib/language"
import { ArchitectureFlow } from "./ArchitectureFlow"
import { StepObserver } from "./StepObserver"

/**
 * Página de un caso. Sigue siempre la misma secuencia: resultado visible,
 * responsabilidad, restricción del dominio, arquitectura, decisiones con su
 * coste, evidencia y siguiente caso.
 *
 * El titular sube carácter a carácter (`SplitText`), las cifras enteras de la
 * evidencia ruedan al entrar en pantalla (`Odometer`) y el enlace al siguiente
 * caso asoma su captura junto al cursor (`HoverImageReveal`).
 */
export function CaseStudyArticle({
  project,
  lang,
  live,
  demo,
  stepPanels,
}: {
  project: Project
  lang: Language
  /** Bloque opcional con datos vivos, dentro de la evidencia. */
  live?: React.ReactNode
  /** Demo interactiva opcional, en su propia sección `#demo` tras las decisiones. */
  demo?: React.ReactNode
  /** Un panel de estado por paso de arquitectura: figura fija en escritorio, bajo cada paso en móvil. */
  stepPanels?: React.ReactNode[]
}) {
  const t = translations[lang]
  const c = t.caseStudy
  const home = HOME_PATH[lang]
  const next = nextProject(project.slug)
  const own = project.relation === "own"
  // En una contribución, las decisiones se presentan como del sistema, no en primera persona.
  const d = own ? c : c.system
  const toc = [
    { id: "resultado", label: c.result },
    { id: "responsabilidad", label: c.responsibility },
    { id: "restriccion", label: c.constraint },
    { id: "arquitectura", label: c.architecture },
    { id: "decisiones", label: d.decisions },
    ...(demo ? [{ id: "demo", label: c.demo.title }] : []),
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
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          {t.relation[project.relation]} · {project.role[lang]}
        </p>
        <h1 id="caso-titulo" className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] leading-[1.06] font-bold tracking-[-0.03em] text-balance text-foreground">
          <SplitText text={project.headline[lang]} trigger="load" />
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">{project.summary[lang]}</p>
        <div className="mt-8">
          <ProjectLinks
            repo={project.repo}
            demo={project.url}
            liveLabel={own ? fill(t.projects.try, { name: project.name }) : t.projects.publicSite}
            liveNote={own ? undefined : t.projects.accountNote}
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

        <section id="arquitectura" aria-labelledby="arquitectura-titulo" data-step={stepPanels ? "1" : undefined}>
          <h2 id="arquitectura-titulo" className="text-2xl font-bold text-foreground md:text-3xl">{c.architecture}</h2>
          <p id="arquitectura-flujo" className="mt-2 text-lg text-body">{project.architecture.title[lang]}</p>
          <div className={stepPanels ? "arch-layout mt-8" : "mt-8"}>
            <ArchitectureFlow steps={project.architecture.steps} lang={lang} labelledBy="arquitectura-flujo" panels={stepPanels} />
            {stepPanels && (
              // Copia visual de los paneles de cada paso; los lectores de pantalla los leen en la lista.
              <div aria-hidden="true" className="step-figure">
                {stepPanels.map((panel, index) => (
                  <div key={index} data-panel={index + 1} className="step-figure-panel">{panel}</div>
                ))}
              </div>
            )}
          </div>
          {stepPanels && <StepObserver sectionId="arquitectura" />}
          {project.architecture.note && (
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">{project.architecture.note[lang]}</p>
          )}
        </section>

        <section id="decisiones" aria-labelledby="decisiones-titulo">
          <h2 id="decisiones-titulo" className="text-2xl font-bold text-foreground md:text-3xl">{d.decisions}</h2>
          <div className="mt-8 flex flex-col gap-10">
            {project.decisions.map((decision) => (
              <article key={decision.id} id={decision.id} aria-labelledby={`${decision.id}-titulo`} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h3 id={`${decision.id}-titulo`} className="text-xl font-semibold text-foreground">{decision.title[lang]}</h3>
                <dl className="mt-6 grid gap-6 md:grid-cols-2">
                  {([
                    [d.need, decision.need],
                    [d.choice, decision.choice],
                    [d.cost, decision.cost],
                    [d.proof, decision.proof],
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

        {demo && (
          <section id="demo" aria-labelledby="demo-titulo">
            <h2 id="demo-titulo" className="text-2xl font-bold text-foreground md:text-3xl">{c.demo.title}</h2>
            <p className="mt-2 max-w-3xl text-lg leading-relaxed text-body">{c.demo.intro}</p>
            <div className="mt-8">{demo}</div>
          </section>
        )}

        <section id="resultados" aria-labelledby="resultados-titulo">
          <h2 id="resultados-titulo" className="text-2xl font-bold text-foreground md:text-3xl">{c.results}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {fill(c.asOf, { date: formatDate(project.evidence.asOf, lang) })}. {project.evidence.source[lang]}
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.evidence.items.map((item) => (
              <div key={item.label.es} className="rounded-2xl border border-border bg-card p-5">
                <dt className="text-sm text-muted-foreground">{item.label[lang]}</dt>
                <dd className="mt-2 font-mono text-2xl font-bold text-foreground">
                  {/^\d+$/.test(item.value[lang]) ? <Odometer value={Number(item.value[lang])} locale={lang === "es" ? "es-PE" : "en-US"} /> : item.value[lang]}
                </dd>
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
        <HoverImageReveal image={next.cover} className="flex">
          <Link href={projectPath(lang, next.slug)} className={buttonVariants({ variant: "secondary" })}>
            {c.next}: {next.name} <span aria-hidden="true">→</span>
          </Link>
        </HoverImageReveal>
      </footer>
    </article>
  )
}
