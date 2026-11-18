import { Reveal } from "@/components/motion/Reveal"
import { ProjectLinks } from "@/components/project/ProjectLinks"
import { GRADEO_SNAPSHOT } from "@/lib/gradeo-stats"
import { translations } from "@/lib/i18n"
import { interpolate } from "@/lib/interpolate"
import type { Language } from "@/lib/language"
import { PROJECTS } from "@/lib/site"
import { GradeoBento } from "./GradeoBento"
import { GradeoCaseStudy } from "./GradeoCaseStudy"
import { GradeoLifecycle } from "./GradeoLifecycle"

export function GradeoSection({ lang }: { lang: Language }) {
  const t = translations[lang]
  const professors = GRADEO_SNAPSHOT.professors.toLocaleString(lang === "es" ? "es-PE" : "en-US")
  const fill = (template: string) => interpolate(template, { professors })

  const links = {
    repo: PROJECTS.gradeo.repo,
    demo: PROJECTS.gradeo.demo,
    liveLabel: t.gradeo.viewLive,
    codeLabel: t.gradeo.viewCode,
    newTabHint: t.nav.newTab,
    projectName: "GRADEO",
    codeOnRequest: PROJECTS.gradeo.codeOnRequest,
    onRequestLabel: t.projects.codeOnRequest,
    requestCopy: t.projects.codeRequest,
  }

  return (
    <section id="gradeo" className="relative z-10 bg-background pb-32">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal className="mb-12">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-highlight/20 bg-highlight/10 px-3 py-1 text-xs font-bold tracking-widest text-highlight">
            <span className="h-2 w-2 rounded-full bg-highlight motion-safe:animate-pulse" />
            {t.gradeo.eyebrow}
          </p>
          <h2 className="mb-2 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            {t.gradeo.title}
          </h2>
          <p className="text-xl text-body">{t.gradeo.subtitle}</p>
          <p className="mt-4 max-w-2xl text-balance text-muted-foreground">{fill(t.gradeo.oneLiner)}</p>

          {/* Los enlaces al proyecto van arriba: quien ya está convencido no
              tiene que abrir el caso técnico para encontrarlos. */}
          <div className="mt-6">
            <ProjectLinks {...links} />
          </div>
        </Reveal>

        <GradeoBento lang={lang} fill={fill} />

        <div className="mt-8">
          <GradeoCaseStudy
            labels={{
              button: t.gradeo.caseStudyBtn,
              loading: t.gradeo.loadingCaseStudy,
              failed: t.gradeo.failedCaseStudy,
            }}
            content={{
              title: t.caseStudy.title,
              desc: t.caseStudy.desc,
              closeLabel: t.nav.close,
              sections: [
                { title: t.caseStudy.challengeTitle, body: t.caseStudy.challengeText },
                { title: t.caseStudy.solutionTitle, body: t.caseStudy.solutionText },
                { title: t.caseStudy.searchTitle, body: t.caseStudy.searchText },
                { title: t.caseStudy.scaleTitle, body: t.caseStudy.scaleText },
                { title: t.caseStudy.resultTitle, body: fill(t.caseStudy.resultText) },
              ],
              links,
            }}
          />
        </div>
      </div>

      <GradeoLifecycle
        copy={{
          title: t.gradeo.lifecycleTitle,
          stepsLabel: t.gradeo.stepsLabel,
          instruction: t.scrolly.instruction,
          scrollIndicator: t.gradeo.scrollIndicator,
          steps: [
            { title: t.scrolly.step1Title, desc: t.scrolly.step1Desc },
            { title: t.scrolly.step2Title, desc: t.scrolly.step2Desc },
            { title: t.scrolly.step3Title, desc: t.scrolly.step3Desc },
            { title: t.scrolly.step4Title, desc: t.scrolly.step4Desc },
          ],
        }}
      />
    </section>
  )
}
