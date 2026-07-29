"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Direction = "up" | "left" | "right"

const HIDDEN: Record<Direction, string> = {
  up: "translate-y-8",
  left: "-translate-x-12",
  right: "translate-x-12",
}

/**
 * Aparición al entrar en el viewport, con IntersectionObserver y transiciones CSS.
 *
 * Sustituye al patrón `motion.div` + `whileInView` que había en cada sección.
 * Framer Motion es excelente, pero pesa ~100 KB comprimidos y aquí sólo se usaba
 * para «desvanecer y desplazar una vez»: eso lo hace el navegador solo. Framer
 * queda reservado para lo que de verdad lo necesita —la secuencia de scroll y el
 * overlay— y ambos se cargan de forma diferida (ver P-01).
 *
 * Con `prefers-reduced-motion` el contenido se muestra ya visible, sin transición.
 */
export function Reveal({
  children,
  className,
  from = "up",
  delay = 0,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  from?: Direction
  /** Retardo en milisegundos, para escalonar hermanos. */
  delay?: number
  once?: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setShown(false)
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out",
        shown
          ? "opacity-100 translate-x-0 translate-y-0"
          : cn("opacity-0", HIDDEN[from]),
        className
      )}
    >
      {children}
    </div>
  )
}
