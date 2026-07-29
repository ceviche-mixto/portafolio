"use client"

import * as React from "react"
import {
  FileText,
  Cpu,
  Wrench,
  GraduationCap,
  Briefcase as BriefcaseIcon,
  Sparkles,
  Download,
} from "lucide-react"
import { Reveal } from "@/components/motion/Reveal"
import { useTranslation } from "@/hooks/useTranslation"
import { CV_FILES, IDENTITY } from "@/lib/site"

const CARD =
  "relative h-full overflow-hidden rounded-[2rem] border border-zinc-700/50 bg-zinc-900 p-8 shadow-2xl transition-colors hover:border-zinc-600"

const STACK = ["TypeScript", "JavaScript", "Java", "SQL", "Next.js", "React", "Tailwind CSS"]
const ENV = ["PostgreSQL", "Supabase", "Git", "VS Code", "Vercel", "Linux", "Excel (Adv)"]

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
      className="relative z-10 scroll-mt-20 overflow-hidden bg-zinc-950 pt-24 pb-40"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Reveal className="mb-14">
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-2xl">
              <FileText className="h-6 w-6 text-emerald-400" aria-hidden="true" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {t.cv.sectionTitle}
            </h2>
          </div>
          <p className="max-w-2xl text-lg text-zinc-300">{t.cv.sectionSubtitle}</p>

          {/* Un CV en pantalla no sirve para adjuntarlo a un proceso interno
              (ver U-05). */}
          <a
            href={CV_FILES[lang]}
            download
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-bold text-zinc-200 transition-colors hover:border-emerald-500/50 hover:text-white"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.cv.downloadCv}
          </a>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:auto-rows-[240px]">
          <Reveal from="left" className="md:col-span-2">
            <article className={`${CARD} group`}>
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50" />
              <div className="pointer-events-none absolute -top-10 -right-10 opacity-5 transition-opacity duration-700 group-hover:opacity-10">
                <Sparkles className="h-64 w-64 text-emerald-400" aria-hidden="true" />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-center">
                <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-white">
                  <span className="rounded-lg bg-emerald-500/10 p-2">
                    <GraduationCap
                      className="h-5 w-5 text-emerald-400"
                      aria-hidden="true"
                    />
                  </span>
                  {t.cv.profile.title}
                </h3>
                <p className="pr-4 text-balance text-sm leading-relaxed font-light text-zinc-300 md:text-base">
                  {t.cv.profile.content}
                </p>
                <p className="mt-3 text-xs text-zinc-400">{IDENTITY.university}</p>
              </div>
            </article>
          </Reveal>

          <Reveal from="right" delay={80} className="md:row-span-2">
            <article className={`${CARD} flex flex-col`}>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />

              <h3 className="relative z-10 mb-8 flex items-center gap-3 text-xl font-bold text-white">
                <span className="rounded-lg bg-blue-500/10 p-2">
                  <BriefcaseIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </span>
                {t.cv.experience.title}
              </h3>

              <div className="relative z-10 flex-1 border-l-2 border-zinc-800 pl-6">
                <span
                  className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-blue-500 bg-zinc-900"
                  aria-hidden="true"
                />
                <h4 className="mb-2 text-lg leading-none font-bold text-zinc-100">
                  {t.cv.experience.xpande.role}
                </h4>
                <p className="mb-6 text-sm font-medium text-blue-300">
                  {t.cv.experience.xpande.company} · {t.cv.experience.xpande.date}
                </p>
                <ul className="space-y-4 text-sm text-zinc-300">
                  {t.cv.experience.xpande.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 leading-snug">
                      <span className="mt-1 text-xs text-blue-400" aria-hidden="true">
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
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
                <span className="rounded-lg bg-purple-500/10 p-2">
                  <Cpu className="h-5 w-5 text-purple-400" aria-hidden="true" />
                </span>
                {t.cv.skills.stack}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {STACK.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 shadow-sm transition-colors hover:border-purple-500/50 hover:text-white"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={240}>
            <article className={`${CARD} flex flex-col justify-center`}>
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
                <span className="rounded-lg bg-orange-500/10 p-2">
                  <Wrench className="h-5 w-5 text-orange-400" aria-hidden="true" />
                </span>
                {t.cv.skills.env}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {ENV.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-300 shadow-sm transition-colors hover:border-orange-500/50 hover:text-white"
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
