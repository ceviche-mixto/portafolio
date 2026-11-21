import Image from "next/image"
import Link from "next/link"
import { projectPath, type Project } from "@/content/projects"
import type { ProjectMedia } from "@/content/projects/types"
import { fill, translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { cn } from "@/lib/utils"
import { StatusBadge } from "./StatusBadge"

/**
 * Tarjeta de un proyecto en el listado: pantalla real, problema y decisión en
 * una frase. Toda la tarjeta abre el caso con un solo toque; el `id` es el slug,
 * así «Volver a proyectos» regresa a esta misma tarjeta.
 *
 * `.card-media` amplía la imagen al pasar un puntero fino y `.project-card`
 * responde al pulsar (globals.css). Con `reveal`, una segunda captura asoma
 * por el borde de la ventana al cruzar el centro de la pantalla, y una línea
 * de ejemplo enlaza a la demo del caso.
 */
export function ProjectCard({
  project,
  lang,
  featured = false,
  reveal,
}: {
  project: Project
  lang: Language
  featured?: boolean
  reveal?: ProjectMedia
}) {
  const t = translations[lang]
  const titleId = `${project.slug}-titulo`

  return (
    <article
      id={project.slug}
      aria-labelledby={titleId}
      className={cn(
        "project-card group relative flex h-full flex-col overflow-clip rounded-2xl border border-border bg-card",
        featured && "lg:grid lg:grid-cols-12"
      )}
    >
      <div className={cn("overflow-clip border-b border-soft bg-surface-raised", featured && "lg:col-span-7 lg:border-r lg:border-b-0")}>
        <div className="reveal-window relative overflow-clip">
          <Image
            src={project.cover.src}
            width={project.cover.width}
            height={project.cover.height}
            alt={project.cover.alt[lang]}
            sizes={featured ? "(min-width: 1024px) 700px, 100vw" : "(min-width: 1024px) 600px, 100vw"}
            className="card-media aspect-[16/10] h-auto w-full object-cover object-top"
          />
          {reveal && (
            // Decorativa: la línea de ejemplo de abajo cuenta lo mismo en texto.
            <div aria-hidden="true" className="reveal-layer absolute right-[4%] bottom-0 w-[56%] overflow-clip rounded-t-xl border border-b-0 border-border bg-card shadow-[0_-8px_24px_-12px_rgba(21,23,28,0.35)]">
              <Image
                src={reveal.src}
                width={reveal.width}
                height={reveal.height}
                alt=""
                sizes={featured ? "(min-width: 1024px) 400px, 56vw" : "56vw"}
                className="h-auto w-full"
              />
            </div>
          )}
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col gap-5 p-6 sm:p-8", featured && "lg:col-span-5 lg:justify-center")}>
        <div className="flex flex-wrap items-center gap-3">
          <h3 id={titleId} className="text-2xl font-bold tracking-tight text-foreground">{project.name}</h3>
          <StatusBadge status={project.status} label={t.status[project.status]} />
        </div>
        <p className="-mt-2 font-mono text-xs text-muted-foreground">
          {t.relation[project.relation]} · {project.role[lang]}
        </p>
        <p className="leading-relaxed text-body">{project.summary[lang]}</p>
        <dl className="flex flex-col gap-4 text-sm">
          <div>
            <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{t.work.problemLabel}</dt>
            <dd className="mt-1 leading-relaxed text-body">{project.problem[lang]}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {project.relation === "own" ? t.work.decisionLabel : t.work.systemLabel}
            </dt>
            <dd className="mt-1 leading-relaxed text-body">{project.decisions[0].title[lang]}</dd>
          </div>
        </dl>
        {reveal && (
          <p className="relative z-10 flex flex-wrap items-center gap-x-3 font-mono text-xs text-body">
            <span>{t.work.demoQuery}</span>
            <Link
              href={`${projectPath(lang, project.slug)}#demo`}
              className="inline-flex min-h-11 items-center font-semibold text-highlight underline underline-offset-4"
            >
              {t.work.demoLink}
            </Link>
          </p>
        )}
        <Link
          href={projectPath(lang, project.slug)}
          className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-bold text-highlight underline decoration-highlight/40 underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:decoration-highlight"
        >
          {fill(t.work.readCase, { name: project.name })}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
