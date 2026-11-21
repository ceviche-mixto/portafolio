import type { Language } from "@/lib/language"
import { cn } from "@/lib/utils"

/**
 * Estado de cada paso de la importación de un catálogo de OneCtrl. Sólo flujo
 * conceptual con datos 100 % ficticios: ni código, ni rutas, ni nombres de
 * columnas, ni límites reales del sistema.
 */
const COPY = {
  es: {
    business: "Negocio activo: Bodega Ejemplo",
    scoped: "Cada consulta se acota a este negocio.",
    read: "3 filas leídas del archivo",
    accepted: "válida",
    rejected: "rechazada: ya existe en el catálogo",
    written: "2 filas escritas en el catálogo de Bodega Ejemplo · 1 rechazada con su motivo",
    caption: "Datos de ejemplo",
  },
  en: {
    business: "Active business: Sample Store",
    scoped: "Every query is scoped to this business.",
    read: "3 rows read from the file",
    accepted: "valid",
    rejected: "rejected: already in the catalog",
    written: "2 rows written to Sample Store’s catalog · 1 rejected with its reason",
    caption: "Sample data",
  },
} as const

const ROWS = ["Arroz 5 kg · 0001", "Aceite 1 L · 0002", "Arroz 5 kg · 0001"]

function Rows({ lang, step }: { lang: Language; step: number }) {
  const t = COPY[lang]
  return (
    <ul className="flex flex-col gap-1.5">
      {ROWS.map((row, i) => {
        const rejected = step >= 3 && i === 2
        const accepted = step >= 3 && i < 2
        return (
          <li
            key={i}
            className={cn(
              "flex flex-wrap items-center justify-between gap-x-3 rounded-lg border px-3 py-2",
              rejected ? "border-danger/40 bg-danger/5" : accepted ? "border-highlight/30 bg-highlight/5" : "border-soft bg-background"
            )}
          >
            <span className={cn(rejected && "line-through decoration-danger/60")}>{row}</span>
            {accepted && <span className="text-highlight">✓ {t.accepted}</span>}
            {rejected && <span className="text-danger">✕ {t.rejected}</span>}
          </li>
        )
      })}
    </ul>
  )
}

/** Panel de un paso (1–4). */
export function ImportPanel({ lang, step }: { lang: Language; step: number }) {
  const t = COPY[lang]
  return (
    <div className="rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed text-body">
      <p className="mb-3 tracking-widest text-muted-foreground uppercase">{t.caption}</p>
      <p className="inline-flex rounded-full border border-highlight/30 bg-highlight/10 px-3 py-1 font-semibold text-highlight">{t.business}</p>
      {step === 1 && <p className="mt-3">{t.scoped}</p>}
      {step >= 2 && (
        <div className="mt-3 flex flex-col gap-2">
          <p>{t.read}</p>
          <Rows lang={lang} step={step} />
        </div>
      )}
      {step === 4 && <p className="mt-3 font-semibold text-foreground">{t.written}</p>}
    </div>
  )
}

/** Los cuatro paneles, uno por paso, para la lista y para la figura fija. */
export function importPanels(lang: Language) {
  return [1, 2, 3, 4].map((step) => <ImportPanel key={step} lang={lang} step={step} />)
}
