"use client"

import * as React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { NAV_SECTIONS } from "@/lib/site"
import { activeSection } from "@/lib/navigation"
import { ModeSwitcher } from "@/components/mode-switcher/ModeSwitcher"
import { LanguageSwitcher } from "@/components/mode-switcher/LanguageSwitcher"
import { MotionSwitcher } from "@/components/mode-switcher/MotionSwitcher"

/** Fixed navigation; layout reads are batched once per scroll frame. */
export function SiteNav() {
  const { t, lang } = useTranslation()
  const [active, setActive] = React.useState<string | null>(null)
  const headerRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const sections = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (sections.length === 0) return

    let frame = 0
    let headerHeight = 112
    const update = () => {
      frame = 0
      const positions = sections.map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }))
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3
      setActive(activeSection(positions, headerHeight + 24, atBottom))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const resize = new ResizeObserver(([entry]) => {
      headerHeight = entry.target.getBoundingClientRect().height
      document.documentElement.style.setProperty("--header-height", `${headerHeight}px`)
      schedule()
    })
    if (headerRef.current) resize.observe(headerRef.current)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    update()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-[100] border-b border-soft/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 px-4 py-2 sm:flex sm:gap-3 sm:py-3 md:px-6">
        <a
          href="#contenido"
          className="flex min-h-11 min-w-11 flex-none items-center justify-center rounded-lg px-2 py-1 font-mono text-sm font-bold tracking-tight text-foreground transition-colors hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
        >
          GL<span className="text-highlight">.</span>
        </a>

        {/* En móvil las cuatro anclas tienen una fila propia y son visibles. */}
        <nav
          aria-label={t.nav.menu}
          className="col-span-2 row-start-2 min-w-0 flex-1"
        >
          <ul className="grid grid-cols-4 items-center gap-1 sm:flex">
            {NAV_SECTIONS.map((section) => {
              const isActive = active === section.id
              return (
                <li key={section.id} className="flex-none">
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={
                      "flex min-h-11 items-center justify-center rounded-lg px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight md:px-2.5 md:text-sm " +
                      (isActive
                        ? "bg-surface-raised/80 text-foreground"
                        : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    {lang === "es" ? section.es : section.en}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="col-start-2 row-start-1 flex flex-none items-center justify-self-end gap-2">
          <LanguageSwitcher />
          <MotionSwitcher />
          <ModeSwitcher />
        </div>
      </div>

      {/* Progreso de lectura. Ligado al scroll del documento desde CSS, así que
          no hay listener ni estado de React: el navegador lo interpola en el
          compositor. Donde no exista `animation-timeline`, no se muestra. */}
      <div
        className="scroll-progress h-0.5 w-full origin-left bg-gradient-to-r from-highlight to-accent-secondary"
        aria-hidden="true"
      />
    </header>
  )
}
