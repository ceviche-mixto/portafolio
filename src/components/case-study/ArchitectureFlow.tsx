import type { ArchitectureStep } from "@/content/projects/types"
import type { Language } from "@/lib/language"

/**
 * Pasos de una arquitectura como lista ordenada, en vertical en todos los
 * anchos. Es la única fuente de los pasos de cada caso; el texto se entiende
 * sin la figura.
 *
 * Al leer, cada nodo se rellena cuando cruza el 55 % de la pantalla y el tramo
 * cobalto hasta el siguiente crece con `scaleY` mientras se lee el paso; al
 * volver hacia arriba se deshace (globals.css, `.arch-step`). Sin soporte o
 * con movimiento reducido, todo queda relleno.
 *
 * `panels` añade a cada paso un mini-panel de estado: en móvil se ve bajo el
 * paso; con la figura fija de escritorio queda sólo para lectores de pantalla.
 */
export function ArchitectureFlow({
  steps,
  lang,
  labelledBy,
  panels,
}: {
  steps: ArchitectureStep[]
  lang: Language
  labelledBy: string
  panels?: React.ReactNode[]
}) {
  return (
    <ol aria-labelledby={labelledBy} className="flex flex-col">
      {steps.map((step, index) => (
        <li key={step.title.es} data-step-index={index + 1} className="arch-step relative flex gap-4 pb-10 last:pb-0">
          {index < steps.length - 1 && (
            <span aria-hidden="true" className="absolute top-10 bottom-0 left-5 w-px bg-border">
              <span className="arch-segment absolute inset-0 bg-highlight" />
            </span>
          )}
          <span
            aria-hidden="true"
            className="relative flex h-10 w-10 flex-none items-center justify-center overflow-clip rounded-full border-2 border-highlight bg-card font-mono text-sm font-bold text-highlight"
          >
            {index + 1}
            <span className="arch-fill absolute inset-0 flex items-center justify-center bg-highlight text-card">{index + 1}</span>
          </span>
          <div className="min-w-0 flex-1 pt-2">
            <h3 className="font-semibold text-foreground">{step.title[lang]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">{step.body[lang]}</p>
            {panels?.[index] && <div className="step-panel-inline mt-4">{panels[index]}</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}
