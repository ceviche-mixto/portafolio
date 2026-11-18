import type { Language } from "@/lib/language"

/** Texto en los dos idiomas del sitio. El tipo obliga a escribir ambos. */
export type Localized = Record<Language, string>

/** `production`: en uso público. `demo`: demo técnica con datos y servicios simulados. */
export type ProjectStatus = "production" | "demo"

export type ProjectMedia = {
  src: string
  width: number
  height: number
  alt: Localized
  caption: Localized
}

/** Paso de un diagrama de arquitectura; el texto lo hace legible sin la figura. */
export type ArchitectureStep = { title: Localized; body: Localized }

/**
 * Una decisión técnica escrita como la defendería en una revisión: qué tenía
 * que garantizar, qué elegí, qué coste acepté y cómo lo comprobé.
 */
export type Decision = {
  /** Ancla estable dentro de la página del caso. */
  id: string
  title: Localized
  need: Localized
  choice: Localized
  cost: Localized
  proof: Localized
  code?: { label: string; source: string }
}

export type Evidence = { label: Localized; value: Localized; note?: Localized }

export type Project = {
  slug: string
  name: string
  status: ProjectStatus
  /** Producto público, si existe. */
  url: string | null
  /** Repositorio público, si existe. */
  repo: string | null
  /** El código existe y se puede revisar a petición. */
  codeOnRequest: boolean
  stack: string[]
  /** Una frase: qué es. */
  summary: Localized
  /** Una frase: qué problema resuelve. */
  problem: Localized
  headline: Localized
  result: Localized
  responsibility: Localized
  constraint: Localized
  /** Contexto del entorno mostrado; se declara una sola vez en el caso. */
  environment?: Localized
  cover: ProjectMedia
  gallery: ProjectMedia[]
  architecture: { title: Localized; steps: ArchitectureStep[]; note?: Localized }
  decisions: Decision[]
  evidence: { asOf: string; source: Localized; items: Evidence[] }
}
