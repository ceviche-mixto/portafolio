"use client"

import * as React from "react"

/**
 * Marca en `data-step` de la sección el paso que cruza el 55 % de la
 * pantalla, para que la figura fija muestre su panel. Un cambio discreto por
 * paso, sin estado de React ni trabajo por frame. No renderiza nada.
 */
export function StepObserver({ sectionId }: { sectionId: string }) {
  React.useEffect(() => {
    const section = document.getElementById(sectionId)
    if (!section) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const step = (entry.target as HTMLElement).dataset.stepIndex
          if (entry.isIntersecting && step) section.dataset.step = step
        }
      },
      { rootMargin: "-54% 0px -45% 0px" }
    )
    section.querySelectorAll("[data-step-index]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionId])
  return null
}
