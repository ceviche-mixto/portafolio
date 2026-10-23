"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useTranslation } from "@/hooks/useTranslation"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

const AnimatedLifecycle = dynamic(
  () => import("./GradeoScrolly").then((module) => module.GradeoScrolly),
  { ssr: false },
)

/** The useful content is SSR; animation is an optional desktop enhancement. */
export function GradeoLifecycle() {
  const { t } = useTranslation()
  const [enhance, setEnhance] = useState(false)
  const reduced = usePrefersReducedMotion()
  const enhanced = enhance && !reduced
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)")
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    const update = () => setEnhance(desktop.matches && !saveData)
    update()
    desktop.addEventListener("change", update)
    return () => {
      desktop.removeEventListener("change", update)
    }
  }, [])
  const steps = [
    { title: t.scrolly.step1Title, desc: t.scrolly.step1Desc },
    { title: t.scrolly.step2Title, desc: t.scrolly.step2Desc },
    { title: t.scrolly.step3Title, desc: t.scrolly.step3Desc },
    { title: t.scrolly.step4Title, desc: t.scrolly.step4Desc },
  ]
  return (
    <div className="lifecycle relative mx-auto mt-16 max-w-7xl px-6" data-enhanced={enhanced || undefined}>
      <section aria-label={t.gradeo.stepsLabel} className="lifecycle-content">
        <h3 className="mb-8 text-2xl font-bold text-foreground">{t.gradeo.lifecycleTitle}</h3>
        <ol className="grid gap-8 md:grid-cols-2">
          {steps.map((step) => (
            <li key={step.title}>
              <h4 className="text-lg font-semibold text-foreground">{step.title}</h4>
              <p className="mt-3 leading-relaxed text-body">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>
      {enhanced && <div className="lifecycle-animation absolute inset-0"><AnimatedLifecycle /></div>}
    </div>
  )
}
