import { PROJECTS, projectPath, type Project } from "@/content/projects"
import { HOME_PATH, htmlLang, type Language } from "./language"
import { IDENTITY, SITE_URL, SOCIALS } from "./site"

/**
 * Datos estructurados schema.org. El título es el mismo del sitio; en español
 * se evita «Ingeniero», un título profesional colegiado en Perú.
 */
const JOB_TITLE: Record<Language, string> = {
  es: IDENTITY.titleEs,
  en: IDENTITY.titleEn,
}

const PERSON_ID = `${SITE_URL}/#person`

function person(lang: Language) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: IDENTITY.fullName,
    alternateName: IDENTITY.name,
    jobTitle: JOB_TITLE[lang],
    url: `${SITE_URL}${HOME_PATH[lang]}`,
    sameAs: [SOCIALS.github, SOCIALS.linkedin],
    knowsAbout: ["TypeScript", "Next.js", "React", "PostgreSQL", "Python", "Flask", "MySQL"],
  }
}

/**
 * GRADEO y OneCtrl son aplicaciones públicas; FARMAPLUS, una demo técnica.
 * En un sistema de equipo la persona es `contributor`, nunca `author`/`creator`.
 */
function work(project: Project, lang: Language) {
  const page = `${SITE_URL}${projectPath(lang, project.slug)}`
  const me = { "@id": PERSON_ID }
  const common = {
    "@id": `${page}#${project.slug}`,
    name: project.name,
    description: project.summary[lang],
    inLanguage: htmlLang(lang),
    image: `${SITE_URL}${project.cover.src}`,
    ...(project.relation === "own" ? { author: me, creator: me } : { contributor: me }),
    keywords: project.stack.join(", "),
    mainEntityOfPage: page,
  }
  return project.status === "production" && project.url
    ? { "@type": "SoftwareApplication", ...common, url: project.url, applicationCategory: "WebApplication", operatingSystem: "Web" }
    : { "@type": "CreativeWork", ...common, url: page }
}

/** Portada: la persona y su trabajo seleccionado, en orden. */
export function homeStructuredData(lang: Language) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person(lang),
      {
        "@type": "ItemList",
        name: lang === "es" ? "Trabajo seleccionado" : "Selected work",
        itemListElement: PROJECTS.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: work(project, lang),
        })),
      },
    ],
  }
}

/** Página de un caso: el proyecto y la persona, con su relación (autor o contribuidor). */
export function caseStructuredData(lang: Language, project: Project) {
  return { "@context": "https://schema.org", "@graph": [person(lang), work(project, lang)] }
}

/** JSON listo para un `<script>`: `<` escapado para que ningún texto pueda cerrar la etiqueta. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
