"use client"

import * as React from "react"
import { activeSection } from "@/lib/navigation"

/**
 * Barra fija con scroll-spy. No escucha el scroll: un IntersectionObserver
 * avisa cuando una sección cruza la línea de activación (justo bajo la
 * cabecera) o cuando se llega al final, y sólo entonces se mide. Los
 * controles llegan ya renderizados desde el servidor.
 */
export function SiteNav({
  home,
  menuLabel,
  sections: links,
  controls,
}: {
  home: string
  menuLabel: string
  sections: { id: string; href: string; label: string }[]
  controls: React.ReactNode
}) {
  const [active, setActive] = React.useState<string | null>(null)
  const headerRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const sections = links.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (sections.length === 0) return

    let headerHeight = 112
    let band: IntersectionObserver | null = null
    const update = () => {
      const positions = sections.map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }))
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3
      setActive(activeSection(positions, headerHeight + 24, atBottom))
    }
    // Franja de 1 px a la altura de activación; se rehace si cambia la cabecera o la ventana.
    const observe = () => {
      band?.disconnect()
      const line = Math.round(headerHeight + 24)
      band = new IntersectionObserver(update, {
        rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px`,
      })
      sections.forEach((el) => band?.observe(el))
    }
    // La última sección puede ser más corta que la pantalla: el pie visible marca el final.
    const end = new IntersectionObserver(update, { threshold: 1 })
    const footer = document.querySelector("footer")
    if (footer) end.observe(footer)
    const resize = new ResizeObserver(([entry]) => {
      headerHeight = entry.target.getBoundingClientRect().height
      document.documentElement.style.setProperty("--header-height", `${headerHeight}px`)
      observe()
      update()
    })
    if (headerRef.current) resize.observe(headerRef.current)
    window.addEventListener("resize", observe, { passive: true })
    observe()
    update()
    return () => {
      band?.disconnect()
      end.disconnect()
      resize.disconnect()
      window.removeEventListener("resize", observe)
    }
  }, [links])

  // Papel al 95 %: sobre la tinta del hero, a 80 % el texto gris de la barra bajaba de 4,5:1.
  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-[100] border-b border-soft/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 px-4 py-2 sm:flex sm:gap-3 sm:py-3 md:px-6">
        <a
          href={home}
          className="tactile flex min-h-11 min-w-11 flex-none items-center justify-center rounded-lg px-2 py-1 font-mono text-sm font-bold tracking-tight text-foreground transition-colors hover:text-highlight"
        >
          <span>GL<span className="text-highlight">.</span></span>
          <span className="sr-only"> Giancarlo Larios</span>
        </a>

        {/* En móvil las anclas tienen una fila propia y son visibles. */}
        <nav
          aria-label={menuLabel}
          className="col-span-2 row-start-2 min-w-0 flex-1"
        >
          <ul className="grid grid-cols-4 items-center gap-1 sm:flex">
            {links.map((section) => {
              const isActive = active === section.id
              return (
                <li key={section.id} className="flex-none">
                  <a
                    href={section.href}
                    aria-current={isActive ? "true" : undefined}
                    className={
                      "tactile flex min-h-11 items-center justify-center rounded-lg px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight md:px-2.5 md:text-sm " +
                      (isActive
                        ? "bg-surface-raised/80 text-foreground"
                        : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    <span>{section.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="col-start-2 row-start-1 flex flex-none items-center justify-self-end gap-2">
          {controls}
        </div>
      </div>

      {/* Progreso de lectura. Ligado al scroll del documento desde CSS, así que
          no hay listener ni estado de React: el navegador lo interpola en el
          compositor. Donde no exista `animation-timeline`, no se muestra. */}
      <div
        className="scroll-progress h-0.5 w-full origin-left bg-highlight"
        aria-hidden="true"
      />
    </header>
  )
}
