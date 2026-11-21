import {
  FileText,
  Cpu,
  Wrench,
  Code2,
  Briefcase as BriefcaseIcon,
  Download,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { CV_FILES } from "@/lib/site"

const CARD =
  "portfolio-panel relative h-full overflow-clip p-6 sm:p-8"

/** Sólo lo que respaldan los proyectos del portafolio. */
const STACK = ["TypeScript", "JavaScript", "Python", "SQL", "React", "Next.js", "Flask", "Tailwind CSS"]
const ENV = ["PostgreSQL", "MySQL", "Supabase", "pytest", "Git", "GitHub", "VS Code", "Vercel"]

/**
 * Trayectoria: perfil, experiencia y competencias, con el CV del idioma de la
 * página. Conserva el ancla heredada `#perfil`.
 */
export function TrajectorySection({ lang }: { lang: Language }) {
  const t = translations[lang]

  return (
    <section id="perfil" aria-labelledby="perfil-title" className="relative z-10 bg-background py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-14">
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-xl bg-card p-3">
              <FileText className="h-6 w-6 text-highlight" aria-hidden="true" />
            </div>
            <h2 id="perfil-title" className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight text-foreground">
              {t.cv.sectionTitle}
            </h2>
          </div>
          <p className="max-w-2xl text-lg text-body">{t.cv.sectionSubtitle}</p>

          {/* El PDF del idioma de la página; el hero ofrece la vista en otra pestaña. */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={CV_FILES[lang]}
              download={`Giancarlo-Larios-CV-${lang.toUpperCase()}.pdf`}
              className={buttonVariants()}
            >
              <Download aria-hidden="true" />
              {t.cv.downloadCv}
            </a>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t.cv.documentNote}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-[minmax(260px,auto)] lg:grid-cols-3">
          <div className="md:col-span-2">
            <article className={CARD}>
              <div className="absolute top-0 left-0 h-1 w-full bg-highlight" />
              <div className="relative z-10 flex h-full flex-col justify-center">
                <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-foreground">
                  <span className="rounded-lg bg-highlight/10 p-2">
                    <Code2 className="h-5 w-5 text-highlight" aria-hidden="true" />
                  </span>
                  {t.cv.profile.title}
                </h3>
                <p className="pr-4 text-balance text-sm leading-relaxed font-light text-body md:text-base">
                  {t.cv.profile.content}
                </p>
              </div>
            </article>
          </div>

          <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <article className={`${CARD} flex flex-col`}>
              <h3 className="relative z-10 mb-8 flex items-center gap-3 text-xl font-bold text-foreground">
                <span className="rounded-lg bg-info/10 p-2">
                  <BriefcaseIcon className="h-5 w-5 text-info" aria-hidden="true" />
                </span>
                {t.cv.experience.title}
              </h3>

              <ol className="relative z-10 flex flex-1 flex-col gap-10">
                {t.cv.experience.items.map((job) => (
                  <li key={job.company} className="relative border-l border-soft pl-6">
                    <span
                      className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-info bg-card"
                      aria-hidden="true"
                    />
                    <h4 className="mb-2 text-lg leading-tight font-bold text-foreground">{job.role}</h4>
                    <p className="mb-6 text-sm font-medium text-info">
                      {job.company} · {job.date}
                    </p>
                    <ul className="space-y-4 text-sm text-body">
                      {job.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 leading-snug">
                          <span className="mt-1 text-xs text-info" aria-hidden="true">▹</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </article>
          </div>

          <div>
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
                    className="rounded-lg border border-soft bg-background px-3 py-1.5 text-xs font-medium text-body"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div>
            <article className={`${CARD} flex flex-col justify-center`}>
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-foreground">
                <span className="rounded-lg bg-utility/10 p-2">
                  <Wrench className="h-5 w-5 text-utility" aria-hidden="true" />
                </span>
                {t.cv.skills.env}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {[...ENV, t.cv.skills.excel].map((tool) => (
                  <li
                    key={tool}
                    className="rounded-lg border border-soft bg-background px-3 py-1.5 font-mono text-xs text-body"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
