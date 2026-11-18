"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import type { LifecycleCopy } from "./GradeoScrolly"

const AnimatedLifecycle = dynamic(
  () => import("./GradeoScrolly").then((module) => module.GradeoScrolly),
  { ssr: false },
)

/** El contenido útil llega en el HTML; la animación es una mejora opcional de escritorio. */
export function GradeoLifecycle({ copy }: { copy: LifecycleCopy }) {
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
  return (
    <div className="lifecycle relative mx-auto mt-16 max-w-7xl px-6" data-enhanced={enhanced || undefined}>
      <section aria-label={copy.stepsLabel} className="lifecycle-content">
        <h3 className="mb-8 text-2xl font-bold text-foreground">{copy.title}</h3>
        <ol className="grid gap-8 md:grid-cols-2">
          {copy.steps.map((step) => (
            <li key={step.title}>
              <h4 className="text-lg font-semibold text-foreground">{step.title}</h4>
              <p className="mt-3 leading-relaxed text-body">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>
      {enhanced && <div className="lifecycle-animation absolute inset-0"><AnimatedLifecycle copy={copy} /></div>}
    </div>
  )
}
