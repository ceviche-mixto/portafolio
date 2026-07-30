"use client"

import * as React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { NAV_SECTIONS } from "@/lib/site"
import { ModeSwitcher } from "@/components/mode-switcher/ModeSwitcher"
import { LanguageSwitcher } from "@/components/mode-switcher/LanguageSwitcher"

/**
 * Barra fija con anclas a las secciones.
 *
 * La sección activa se resalta con un IntersectionObserver en lugar de escuchar
 * `scroll`: el observador sólo dispara al cruzar un umbral, así que no hay
 * trabajo por frame (el mismo error que P-03 corrige en la página).
 */
export function SiteNav() {
  const { t, lang } = useTranslation()
  const [active, setActive] = React.useState<string | null>(null)

  React.useEffect(() => {
    const sections = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // La sección "activa" es la más cercana al inicio del viewport entre las
        // visibles, no simplemente la última que entró.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
        <a
          href="#contenido"
          className="flex-none rounded-lg px-2 py-1 font-mono text-sm font-bold tracking-tight text-white transition-colors hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          GL<span className="text-emerald-400">.</span>
        </a>

        {/* En móvil la lista se desplaza en horizontal en lugar de esconderse
            detrás de un menú: menos JS y todas las anclas siguen alcanzables. La
            máscara difumina el borde derecho para que se vea que hay más. */}
        <nav
          aria-label={t.nav.menu}
          className="min-w-0 flex-1 [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)] sm:[mask-image:none]"
        >
          <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {NAV_SECTIONS.map((section) => {
              const isActive = active === section.id
              return (
                <li key={section.id} className="flex-none">
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={
                      "block rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 md:text-sm " +
                      (isActive
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-400 hover:text-white")
                    }
                  >
                    {lang === "es" ? section.es : section.en}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex flex-none items-center gap-2">
          <LanguageSwitcher />
          <ModeSwitcher />
        </div>
      </div>

      {/* Progreso de lectura. Ligado al scroll del documento desde CSS, así que
          no hay listener ni estado de React: el navegador lo interpola en el
          compositor. Donde no exista `animation-timeline`, no se muestra. */}
      <div
        className="scroll-progress h-0.5 w-full origin-left bg-gradient-to-r from-emerald-500 to-cyan-400"
        aria-hidden="true"
      />
    </header>
  )
}
