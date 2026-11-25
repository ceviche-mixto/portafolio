"use client"

import * as React from "react"
import { celebrate, pulse } from "@/components/motion/TactileFeedback"
import { buttonVariants } from "@/components/ui/button-variants"
import { search, sharedMask, SIMILARITY_THRESHOLD } from "@/lib/trigram"

/** Nombres de ejemplo. Ninguno corresponde a un docente real. */
const NAMES = [
  "Lucía Morales", "Luis Morán", "Lucas Moreno", "Ana Lucía Torres", "Rosa Quispe", "María José Ñahui",
  "Andrés Peña Ruiz", "José Ramírez", "Carmen Rojas", "Julia Mendoza", "Jorge Salazar", "Martín Huamán",
] as const

const ROWS = 3
const EXAMPLES = { accent: "Lucia Morales", typo: "Lucia Morlaes" } as const

export type SearchDemoCopy = {
  label: string
  withAccent: string
  withTypo: string
  disclaimer: string
  flow: string
  score: string
  none: string
  /** «Resultados: {count}. Primero: {name}, similitud {score}.» */
  announce: string
}

/** Nombre con los caracteres de trigramas compartidos en `<mark>`. */
function Highlighted({ name, query }: { name: string; query: string }) {
  const mask = sharedMask(name, query)
  const parts: { text: string; on: boolean }[] = []
  for (let i = 0; i < name.length; i++) {
    const last = parts.at(-1)
    if (last && last.on === mask[i]) last.text += name[i]
    else parts.push({ text: name[i], on: mask[i] })
  }
  return (
    <>
      {parts.map((part, i) =>
        part.on ? <mark key={i} className="rounded-sm bg-highlight/15 text-highlight">{part.text}</mark> : <span key={i}>{part.text}</span>
      )}
    </>
  )
}

/**
 * Demo de la búsqueda por trigramas de GRADEO, sin red: la misma regla que
 * `search_professors_similarity()` sobre nombres de ejemplo. Al cambiar el
 * orden, cada fila se desliza desde donde estaba (FLIP con WAAPI, 180 ms);
 * una consulta nueva interrumpe la animación anterior. El resumen para lector
 * de pantalla se anuncia cuando la escritura se detiene, no en cada tecla.
 *
 * Una búsqueda con coincidencia celebra el acierto: el puntaje del primero
 * late con rebote y estalla `celebrate`. Con los botones de ejemplo es
 * inmediato; al escribir, cuando la escritura se detiene (como el anuncio).
 */
export function SearchDemo({ lang, copy }: { lang: "es" | "en"; copy: SearchDemoCopy }) {
  const [query, setQuery] = React.useState<string>(EXAMPLES.typo)
  const [announcement, setAnnouncement] = React.useState("")
  const rows = React.useRef(new Map<string, HTMLLIElement>())
  const first = React.useRef(new Map<string, number>())
  const topScore = React.useRef<HTMLElement>(null)
  // La próxima consulta viene de un botón de ejemplo: se celebra sin esperar.
  const instant = React.useRef(false)
  const results = search(NAMES, query, ROWS)
  const format = new Intl.NumberFormat(lang === "es" ? "es" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // First: posiciones visibles (con la animación en curso) justo antes del cambio.
  function update(next: string) {
    first.current = new Map([...rows.current].map(([name, el]) => [name, el.getBoundingClientRect().top]))
    setQuery(next)
  }

  function cheer() {
    pulse(topScore.current)
    celebrate(topScore.current)
  }

  function pick(next: string) {
    if (next === query) return cheer()
    instant.current = true
    update(next)
  }

  // Last, Invert, Play. Al hidratar no se anima: el HTML del servidor ya está en su sitio.
  const hydrated = React.useRef(false)
  React.useLayoutEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true
      return
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    for (const [name, el] of rows.current) {
      if (!el.animate) continue
      el.getAnimations().forEach((animation) => animation.cancel())
      if (reduce) continue
      const before = first.current.get(name)
      const after = el.getBoundingClientRect().top
      const keyframes = before === undefined ? [{ opacity: 0 }, { opacity: 1 }] : before !== after ? [{ transform: `translateY(${before - after}px)` }, { transform: "none" }] : null
      if (keyframes) el.animate(keyframes, { duration: 180, easing: "cubic-bezier(0.2, 0.75, 0.25, 1)" })
    }
    first.current = new Map()
    if (instant.current && results.length > 0) cheer()
    // Sólo cambia con la consulta; `results` se deriva de ella.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Nada que anunciar al cargar: sólo cuando el visitante cambia la consulta.
  const announced = React.useRef(false)
  React.useEffect(() => {
    if (!announced.current) {
      announced.current = true
      return
    }
    const typed = !instant.current
    instant.current = false
    const timer = setTimeout(() => {
      const top = results[0]
      if (typed && top) cheer()
      setAnnouncement(top ? copy.announce.replace("{count}", String(results.length)).replace("{name}", top.name).replace("{score}", format.format(top.score)) : copy.none)
    }, 450)
    return () => clearTimeout(timer)
    // Sólo la consulta estable dispara el anuncio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-8">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{copy.disclaimer}</p>
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <label htmlFor="demo-busqueda" className="text-sm font-semibold text-foreground">{copy.label}</label>
          <input
            id="demo-busqueda"
            type="search"
            value={query}
            onChange={(event) => update(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground focus-visible:border-highlight"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => pick(EXAMPLES.accent)} className={buttonVariants({ variant: "secondary" })}>
              {copy.withAccent}
            </button>
            <button type="button" onClick={() => pick(EXAMPLES.typo)} className={buttonVariants({ variant: "secondary" })}>
              {copy.withTypo}
            </button>
          </div>
          {/* Altura reservada para tres filas: cambiar de consulta no mueve la página. */}
          <ol className="mt-5 flex min-h-[10.5rem] flex-col gap-2">
            {results.map((match, index) => (
              <li
                key={match.name}
                ref={(el) => { if (el) rows.current.set(match.name, el); else rows.current.delete(match.name) }}
                className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-soft bg-background px-4"
              >
                <span className="min-w-0 truncate text-foreground"><Highlighted name={match.name} query={query} /></span>
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  {copy.score}{" "}
                  <strong ref={index === 0 ? topScore : undefined} className="inline-block text-foreground">
                    {format.format(match.score)}
                  </strong>
                </span>
              </li>
            ))}
            {results.length === 0 && <li className="flex min-h-12 items-center px-4 text-sm text-muted-foreground">{copy.none}</li>}
          </ol>
        </div>
        <p className="self-start rounded-xl border border-soft bg-background p-4 font-mono text-xs leading-relaxed text-body">
          {copy.flow.replace("{threshold}", format.format(SIMILARITY_THRESHOLD))}
        </p>
      </div>
      <p role="status" aria-live="polite" className="sr-only">{announcement}</p>
    </div>
  )
}
