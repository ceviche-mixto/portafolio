"use client"

import * as React from "react"
import { Reveal } from "@/components/motion/Reveal"
import { Pill, GraduationCap, Check } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { ProjectLinks } from "@/components/project/ProjectLinks"
import { PROJECTS } from "@/lib/site"
import { AutomationDemo } from "./AutomationDemo"

/**
 * Sección de proyectos.
 *
 * Antes GRADEO era el único proyecto del sitio y no había estructura donde
 * añadir otro sin rediseñar la página (ver U-04). FARMAPLUS —un ERP de farmacia
 * con facturación electrónica SUNAT— no aparecía en ninguna parte.
 *
 * Cada tarjeta responde lo mismo en el mismo orden: qué problema, qué rol, qué
 * stack, qué tiene de interesante. Añadir un proyecto es añadir una entrada.
 */
export function ProjectsSection() {
  const { t } = useTranslation()

  const projects = [
    {
      key: "farmaplus",
      copy: t.projects.farmaplus,
      links: PROJECTS.farmaplus,
      Icon: Pill,
      accent: "text-accent-secondary",
      ring: "hover:border-accent-secondary/40",
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Tailwind"],
    },
    {
      key: "gradeo",
      copy: t.projects.gradeo,
      links: PROJECTS.gradeo,
      Icon: GraduationCap,
      accent: "text-highlight",
      ring: "hover:border-highlight/40",
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Vercel"],
    },
  ]

  return (
    <section
      id="proyectos"
      className="relative z-10 overflow-hidden bg-background pt-24 pb-32"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent-secondary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Reveal className="mb-14">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t.projects.sectionTitle}
          </h2>
          <p className="max-w-2xl text-balance text-lg text-body">
            {t.projects.sectionSubtitle}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map(({ key, copy, links, Icon, accent, ring, stack }, i) => (
            <Reveal key={key} delay={i * 100}>
              <article
                className={`portfolio-panel card-sheen flex h-full flex-col p-6 sm:p-8 ${ring}`}
              >
                <header className="mb-6 flex items-start gap-4">
                  <div className="rounded-2xl border border-soft bg-background p-3">
                    <Icon className={`h-6 w-6 ${accent}`} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-2xl font-bold tracking-tight text-foreground">
                        {copy.name}
                      </h3>
                      <span className={`text-sm font-semibold ${accent}`}>{copy.status}</span>
                    </div>
                    <p className="text-sm text-body">{copy.tagline}</p>
                  </div>
                </header>

                <p className="mb-6 text-sm leading-relaxed text-body">{copy.statusDetail}</p>

                <dl className="mb-6 flex flex-col gap-4">
                  <div>
                    <dt className="mb-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {t.projects.problemLabel}
                    </dt>
                    <dd className="text-sm leading-relaxed text-body">{copy.problem}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {t.projects.roleLabel}
                    </dt>
                    <dd className="text-sm text-body">{copy.role}</dd>
                  </div>
                  <div>
                    <dt className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {t.projects.stackLabel}
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg border border-soft bg-background px-2.5 py-1 text-xs font-medium text-body"
                        >
                          {tech}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>

                <div className="mb-6 flex-1">
                  <h4 className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    {t.projects.highlightsLabel}
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {copy.highlights.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-body">
                        <Check
                          className={`mt-0.5 h-4 w-4 flex-none ${accent}`}
                          aria-hidden="true"
                        />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <ProjectLinks
                  repo={links.repo}
                  demo={links.demo}
                  liveLabel={t.gradeo.viewLive}
                  codeLabel={t.gradeo.viewCode}
                  newTabHint={t.nav.newTab}
                  projectName={copy.name}
                  codeOnRequest={links.codeOnRequest}
                  onRequestLabel={t.projects.codeOnRequest}
                />
              </article>
            </Reveal>
          ))}
        </div>
        <AutomationDemo />
      </div>
    </section>
  )
}
