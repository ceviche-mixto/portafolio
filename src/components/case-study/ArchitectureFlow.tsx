import type { ArchitectureStep } from "@/content/projects/types"
import type { Language } from "@/lib/language"
import { EmphasisLayer } from "./ArchitectureEmphasis"

/**
 * Pasos de una arquitectura como lista ordenada. La línea cobalto que une los
 * nodos es decorativa: el texto de cada paso se entiende sin la figura. Es la
 * única fuente de los pasos de cada caso. En escritorio, el scroll realza el
 * nodo que corresponde: cada nodo lleva su `EmphasisLayer` y el progreso lo
 * aporta el `EmphasisTrack` que envuelve la sección. Los pasos no se desmontan.
 */
export function ArchitectureFlow({
  steps,
  lang,
  labelledBy,
}: {
  steps: ArchitectureStep[]
  lang: Language
  labelledBy: string
}) {
  return (
    <ol aria-labelledby={labelledBy} className="relative grid gap-8 md:grid-cols-4 md:gap-6">
      <span
        aria-hidden="true"
        className="absolute top-5 bottom-5 left-5 w-px bg-highlight md:top-5 md:right-5 md:bottom-auto md:left-5 md:h-px md:w-auto"
      />
      {steps.map((step, index) => (
        <li key={step.title.es} className="relative flex gap-4 md:flex-col">
          <span
            aria-hidden="true"
            className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-highlight bg-card font-mono text-sm font-bold text-highlight"
          >
            <EmphasisLayer index={index} />
            <span className="relative">{index + 1}</span>
          </span>
          <div>
            <h3 className="font-semibold text-foreground">{step.title[lang]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">{step.body[lang]}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
