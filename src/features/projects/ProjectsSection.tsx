import { ProjectCard } from "@/components/project/ProjectCard"
import { PROJECTS } from "@/content/projects"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"

/**
 * Trabajo seleccionado: GRADEO a ancho completo como caso principal y los
 * demás en una fila de dos columnas. En móvil, mismo orden en una columna.
 */
export function ProjectsSection({ lang }: { lang: Language }) {
  const t = translations[lang]
  const [featured, ...rest] = PROJECTS

  return (
    <section id="proyectos" aria-labelledby="proyectos-titulo" className="bg-background py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <h2 id="proyectos-titulo" className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight text-foreground">
          {t.work.title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-body">{t.work.subtitle}</p>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ProjectCard project={featured} lang={lang} featured />
          </div>
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}
