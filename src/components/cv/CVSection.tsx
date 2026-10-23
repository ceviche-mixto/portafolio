"use client"

import * as React from "react"
import {
  FileText,
  Cpu,
  Wrench,
  Code2,
  Briefcase as BriefcaseIcon,
  Sparkles,
  Download,
  Eye,
} from "lucide-react"
import { Reveal } from "@/components/motion/Reveal"
import { useTranslation } from "@/hooks/useTranslation"
import { CV_FILES } from "@/lib/site"

const CARD =
  "portfolio-panel relative h-full overflow-hidden p-6 sm:p-8"

const STACK = ["TypeScript", "JavaScript", "Python", "Java", "SQL", "React", "Next.js", "Node.js", "Tailwind CSS"]
const ENV = ["PostgreSQL", "MySQL", "Supabase", "Git", "GitHub", "Postman", "VS Code", "Vercel"]

/**
 * Las tarjetas entran desde direcciones distintas al aparecer en pantalla.
 *
 * Antes cada una iba ligada al progreso de scroll con `useTransform`, lo que
 * obligaba a cargar Framer Motion en el render inicial. `Reveal` consigue la
 * misma intención con IntersectionObserver y transiciones CSS.
 */
export function CVSection() {
  const { t, lang } = useTranslation()

  return (
    <section
      id="perfil"
      className="relative z-10 overflow-hidden bg-background pt-24 pb-40"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Reveal className="mb-14">
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-xl bg-card p-3">
              <FileText className="h-6 w-6 text-highlight" aria-hidden="true" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {t.cv.sectionTitle}
            </h2>
          </div>
          <p className="max-w-2xl text-lg text-body">{t.cv.sectionSubtitle}</p>

          {/* El PDF del idioma seleccionado: lectura nativa o descarga. */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={CV_FILES[lang]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.cv.viewCv} (${t.nav.newTab})`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-action px-5 py-2.5 text-sm font-bold text-action-foreground transition-colors hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              {t.cv.viewCv}
            </a>
            <a
              href={CV_FILES[lang]}
              download={`Giancarlo-Larios-CV-${lang.toUpperCase()}.pdf`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-subtle transition-colors hover:border-highlight/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t.cv.downloadCv}
            </a>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t.cv.documentNote}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-[minmax(260px,auto)] lg:grid-cols-3">
          <Reveal from="left" className="md:col-span-2">
            <article className={`${CARD} group`}>
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-highlight to-accent-secondary opacity-50" />
              <div className="pointer-events-none absolute -top-10 -right-10 opacity-5 transition-opacity duration-700 group-hover:opacity-10">
                <Sparkles className="h-64 w-64 text-highlight" aria-hidden="true" />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-center">
                <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-foreground">
                  <span className="rounded-lg bg-highlight/10 p-2">
                    <Code2
                      className="h-5 w-5 text-highlight"
                      aria-hidden="true"
                    />
                  </span>
                  {t.cv.profile.title}
                </h3>
                <p className="pr-4 text-balance text-sm leading-relaxed font-light text-body md:text-base">
                  {t.cv.profile.content}
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal from="right" delay={80} className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <article className={`${CARD} flex flex-col`}>

              <h3 className="relative z-10 mb-8 flex items-center gap-3 text-xl font-bold text-foreground">
                <span className="rounded-lg bg-info/10 p-2">
                  <BriefcaseIcon className="h-5 w-5 text-info" aria-hidden="true" />
                </span>
                {t.cv.experience.title}
              </h3>

              <div className="relative z-10 flex-1 border-l border-soft pl-6">
                <span
                  className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-info bg-card"
                  aria-hidden="true"
                />
                <h4 className="mb-2 text-lg leading-none font-bold text-foreground">
                  {t.cv.experience.xpande.role}
                </h4>
                <p className="mb-6 text-sm font-medium text-info">
                  {t.cv.experience.xpande.company} · {t.cv.experience.xpande.date}
                </p>
                <ul className="space-y-4 text-sm text-body">
                  {t.cv.experience.xpande.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 leading-snug">
                      <span className="mt-1 text-xs text-info" aria-hidden="true">
                        ▹
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>

          <Reveal delay={160}>
            <article className={`${CARD} flex flex-col justify-center`}>
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-foreground">
                <span className="rounded-lg bg-discovery/10 p-2">
                  <Cpu className="h-5 w-5 text-discovery" aria-hidden="true" />
                </span>
                {t.cv.skills.stack}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {STACK.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-lg border border-soft bg-background px-3 py-1.5 text-xs font-medium text-body shadow-sm transition-colors hover:border-discovery/50 hover:text-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={240}>
            <article className={`${CARD} flex flex-col justify-center`}>
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-foreground">
                <span className="rounded-lg bg-utility/10 p-2">
                  <Wrench className="h-5 w-5 text-utility" aria-hidden="true" />
                </span>
                {t.cv.skills.env}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {[...ENV, t.cv.skills.basicDocker, t.cv.skills.excel].map((tool) => (
                  <li
                    key={tool}
                    className="rounded-lg border border-soft bg-background px-3 py-1.5 font-mono text-xs text-body shadow-sm transition-colors hover:border-utility/50 hover:text-foreground"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
