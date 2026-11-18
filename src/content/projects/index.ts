import type { Language } from "@/lib/language"
import { farmaplus } from "./farmaplus"
import { gradeo } from "./gradeo"
import { onectrl } from "./onectrl"
import type { Project } from "./types"

export type { Project } from "./types"

/** Orden de aparición: GRADEO es el caso principal. */
export const PROJECTS: readonly Project[] = [gradeo, onectrl, farmaplus]

export const PROJECT_SLUGS = PROJECTS.map((project) => project.slug)

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug)
}

/** Siguiente caso, en círculo: después del último vuelve al primero. */
export function nextProject(slug: string): Project {
  const index = PROJECTS.findIndex((project) => project.slug === slug)
  return PROJECTS[(index + 1) % PROJECTS.length]
}

/** URL del caso en cada idioma; el slug es el mismo. */
export function projectPath(lang: Language, slug: string): string {
  return lang === "es" ? `/proyectos/${slug}` : `/en/projects/${slug}`
}
