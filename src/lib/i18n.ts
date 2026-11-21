import 'server-only'

import { IDENTITY } from './site'
import type { Language } from './language'

/**
 * Diccionario de la interfaz.
 *
 * Sólo se importa desde Server Components: cada página renderiza su idioma y
 * las islas de cliente reciben por props únicamente las cadenas que usan, así
 * que ningún diccionario completo viaja al navegador. El contenido de cada caso
 * vive en `src/content/projects`.
 *
 * Nada de HTML en las cadenas: lo que necesite énfasis se compone con JSX.
 * Las cadenas con `{clave}` se rellenan con `fill()`.
 */

/**
 * El español es la fuente de la forma: `TranslationDict` se deriva de `es`, y
 * `en` se declara con ese tipo. Si añades una clave en uno y la olvidas en el
 * otro, el build falla en lugar de renderizar `undefined`.
 */
const es = {
  nav: {
    skipToContent: 'Saltar al contenido',
    menu: 'Secciones',
    newTab: 'abre en una pestaña nueva',
  },
  // El enlace muestra el código del idioma de destino; el resto del nombre
  // accesible lo completa sin dejar de contener el texto visible (WCAG 2.5.3).
  lang: { switchLabel: 'EN', switchName: 'English version' },
  hero: {
    eyebrow: `${IDENTITY.name} · ${IDENTITY.titleEs}`,
    title: 'Construyo software que llega a producción.',
    subtitle: 'Creé GRADEO, mi producto de reseñas docentes, y soy su único desarrollador. En OneCtrl, un SaaS multi-negocio en producción, desarrollo módulos, corrijo errores e investigo mejoras.',
    primary: 'Ver proyectos',
    secondary: 'Ver CV (PDF)',
    availability: 'Chiclayo, Perú · Remoto / Híbrido',
    caption: 'GRADEO en producción: búsqueda de docentes, con nombres anonimizados.',
    captionLink: 'Leer el caso GRADEO',
  },
  status: { production: 'En producción', demo: 'Demo técnica' },
  relation: { own: 'Proyecto propio', contribution: 'Contribución técnica' },
  work: {
    title: 'Trabajo seleccionado',
    subtitle: 'Tres sistemas reales. Cada caso muestra una decisión de ingeniería y su efecto en el producto.',
    problemLabel: 'Problema',
    decisionLabel: 'Decisión',
    systemLabel: 'Principio del sistema',
    demoQuery: '«Lucia Morlaes» → Lucía Morales · similitud 0,33',
    demoLink: 'Probar la búsqueda',
    readCase: 'Leer el caso {name}',
  },
  engineering: {
    title: 'Enfoque de ingeniería',
    subtitle: 'Tres sistemas distintos: controlar qué se publica, separar la operación por negocio y rastrear cada lote.',
    readDecision: 'Ver la decisión en {name}',
  },
  projects: {
    try: 'Probar {name}',
    publicSite: 'Ver sitio público',
    accountNote: 'El panel requiere cuenta.',
    viewCode: 'Código',
    codeOnRequest: 'Solicitar código',
    codeRequest: {
      description: 'El código de {project} no es público. Escríbeme para coordinar una revisión técnica.',
      copyEmail: 'Copiar correo', copied: 'Correo copiado',
      copyFailed: 'No se pudo copiar. Selecciona y copia la dirección que aparece arriba.',
      compose: 'Redactar correo',
      mailHint: 'Abre tu aplicación de correo. Si no tienes una configurada, copia la dirección y escribe desde tu correo habitual.',
      subject: 'Solicitud de revisión de código',
      message: 'Hola Giancarlo, me interesa revisar el código de {project}. ¿Podemos coordinar una revisión técnica?',
    },
  },
  caseStudy: {
    breadcrumb: 'Ruta de navegación',
    home: 'Inicio',
    projects: 'Proyectos',
    onThisPage: 'En esta página',
    result: 'Resultado',
    responsibility: 'Mi rol',
    constraint: 'Restricción del dominio',
    architecture: 'Arquitectura',
    decisions: 'Decisiones',
    results: 'Resultados y evidencia',
    need: 'Qué necesitaba garantizar',
    choice: 'Qué elegí',
    cost: 'Qué coste acepté',
    proof: 'Cómo lo comprobé',
    system: {
      decisions: 'Principios del sistema',
      need: 'Qué tiene que garantizar',
      choice: 'Cómo lo resuelve',
      cost: 'Qué coste asume',
      proof: 'Cómo se comprueba',
    },
    asOf: 'Datos al {date}',
    stack: 'Stack',
    back: 'Volver a proyectos',
    next: 'Siguiente caso',
    live: {
      title: 'Lectura en vivo',
      note: 'Datos de producción · la página se regenera cada 5 minutos',
      snapshotTitle: 'Recuento verificado',
      snapshotNote: 'Consultado en producción el {date}. La lectura en vivo no respondió en la última regeneración.',
      professors: 'Docentes indexados',
      reviews: 'Reseñas aprobadas',
      rlsTables: 'Tablas con RLS',
    },
  },
  cv: {
    sectionTitle: 'Trayectoria',
    sectionSubtitle: 'Experiencia en TI y la base técnica detrás de estos sistemas.',
    downloadCv: 'Descargar CV (PDF)',
    documentNote: 'PDF en español · 1 página.',
    profile: {
      title: 'Perfil profesional',
      content: 'Construyo y mantengo software en producción. GRADEO es mi producto: lo creé y soy su único desarrollador. En OneCtrl trabajo como desarrollador e investigador de software en módulos operativos, corrección de errores, pruebas y mantenimiento. FARMAPLUS resuelve la venta farmacéutica con trazabilidad por lote.',
    },
    experience: {
      title: 'Experiencia',
      items: [
        {
          role: 'Desarrollador e investigador de software',
          company: 'OneCtrl · SaaS multi-negocio',
          date: 'Nov 2026 - Actualidad',
          bullets: [
            'Desarrollo e innovación de módulos operativos en un sistema en producción.',
            'Diagnóstico y corrección de errores, y mantenimiento del sistema en producción.',
            'Pruebas automatizadas e investigación de soluciones antes de implementarlas.',
          ],
        },
        {
          role: 'Practicante Pre Profesional de TI',
          company: 'Corporación Xpande S.A.C.',
          date: 'Oct 2023 - Mar 2024',
          bullets: [
            'Diagnóstico y resolución de incidencias de hardware y software de usuarios internos.',
            'Administración de servidores y mantenimiento preventivo de la red, junto al equipo de TI.',
            'Procesamiento de datos comerciales en Excel avanzado para los reportes de gerencia.',
          ],
        },
      ],
    },
    skills: { title: 'Competencias', stack: 'Desarrollo', env: 'Herramientas y datos', excel: 'Microsoft Excel' },
  },
  contact: {
    sectionTitle: '¿Qué sistema necesitas construir o mejorar?',
    sectionSubtitle: 'Escríbeme con el contexto del sistema o del proyecto y lo conversamos.',
    copy: 'Copiar',
    copied: 'Copiado',
    copyFailed: 'No se pudo copiar. Selecciona el correo o abre el enlace para escribir.',
    orFind: 'También en',
    rights: 'Todos los derechos reservados.',
    builtWith: 'Hecho con Next.js, Tailwind y Postgres.',
  },
}

export type TranslationDict = typeof es

const en: TranslationDict = {
  nav: {
    skipToContent: 'Skip to content',
    menu: 'Sections',
    newTab: 'opens in a new tab',
  },
  lang: { switchLabel: 'ES', switchName: 'versión en español' },
  hero: {
    eyebrow: `${IDENTITY.name} · ${IDENTITY.titleEn}`,
    title: 'I build software that ships to production.',
    subtitle: 'I created GRADEO, my teacher-review product, and I am its sole developer. At OneCtrl, a multi-business SaaS in production, I build modules, fix bugs and research improvements.',
    primary: 'Explore projects',
    secondary: 'View CV (PDF)',
    availability: 'Peru (UTC-5) · Remote / Hybrid',
    caption: 'GRADEO in production: professor search, with names anonymized.',
    captionLink: 'Read the GRADEO case study',
  },
  status: { production: 'In production', demo: 'Technical demo' },
  relation: { own: 'My project', contribution: 'Engineering contribution' },
  work: {
    title: 'Selected work',
    subtitle: 'Three real systems. Each case shows an engineering decision and how it shapes the product.',
    problemLabel: 'Problem',
    decisionLabel: 'Decision',
    systemLabel: 'System principle',
    demoQuery: '“Lucia Morlaes” → Lucía Morales · similarity 0.33',
    demoLink: 'Try the search',
    readCase: 'Read the {name} case study',
  },
  engineering: {
    title: 'Engineering approach',
    subtitle: 'Three different systems: controlling what gets published, separating operations per business and tracing every batch.',
    readDecision: 'See the decision in {name}',
  },
  projects: {
    try: 'Try {name}',
    publicSite: 'View public site',
    accountNote: 'The dashboard requires an account.',
    viewCode: 'Code',
    codeOnRequest: 'Request code',
    codeRequest: {
      description: 'The code for {project} is not public. Email me to arrange a technical review.',
      copyEmail: 'Copy email', copied: 'Email copied',
      copyFailed: 'Could not copy. Select and copy the address shown above.',
      compose: 'Compose email',
      mailHint: 'Opens your email app. If none is configured, copy the address and write from your usual email service.',
      subject: 'Code review request',
      message: 'Hi Giancarlo, I would like to review the code for {project}. Can we arrange a technical review?',
    },
  },
  caseStudy: {
    breadcrumb: 'Breadcrumb',
    home: 'Home',
    projects: 'Projects',
    onThisPage: 'On this page',
    result: 'Result',
    responsibility: 'My role',
    constraint: 'Domain constraint',
    architecture: 'Architecture',
    decisions: 'Decisions',
    results: 'Results and evidence',
    need: 'What I needed to guarantee',
    choice: 'What I chose',
    cost: 'What cost I accepted',
    proof: 'How I verified it',
    system: {
      decisions: 'System principles',
      need: 'What it must guarantee',
      choice: 'How it is solved',
      cost: 'What cost it accepts',
      proof: 'How it is checked',
    },
    asOf: 'Data as of {date}',
    stack: 'Stack',
    back: 'Back to projects',
    next: 'Next case study',
    live: {
      title: 'Live reading',
      note: 'Production data · the page regenerates every 5 minutes',
      snapshotTitle: 'Verified count',
      snapshotNote: 'Queried in production on {date}. The live reading did not respond in the latest regeneration.',
      professors: 'Indexed professors',
      reviews: 'Approved reviews',
      rlsTables: 'Tables with RLS',
    },
  },
  cv: {
    sectionTitle: 'Track record',
    sectionSubtitle: 'IT experience and the technical base behind these systems.',
    downloadCv: 'Download CV (PDF)',
    documentNote: 'English PDF · 1 page.',
    profile: {
      title: 'Professional profile',
      content: 'I build and maintain software in production. GRADEO is my product: I created it and I am its sole developer. At OneCtrl I work as a software developer and researcher on operational modules, bug fixing, testing and maintenance. FARMAPLUS handles pharmacy sales with batch traceability.',
    },
    experience: {
      title: 'Experience',
      items: [
        {
          role: 'Software developer and researcher',
          company: 'OneCtrl · multi-business SaaS',
          date: 'Nov 2026 - Present',
          bullets: [
            'Building and improving operational modules in a production system.',
            'Diagnosing and fixing bugs, and maintaining the system in production.',
            'Automated testing and researching solutions before implementing them.',
          ],
        },
        {
          role: 'IT Intern',
          company: 'Corporación Xpande S.A.C.',
          date: 'Oct 2023 - Mar 2024',
          bullets: [
            'Diagnosed and resolved hardware and software incidents for internal users.',
            'Server administration and preventive network maintenance alongside the IT team.',
            'Processed commercial data in advanced Excel for management reporting.',
          ],
        },
      ],
    },
    skills: { title: 'Core competencies', stack: 'Development', env: 'Tools and data', excel: 'Microsoft Excel' },
  },
  contact: {
    sectionTitle: 'What system do you need to build or improve?',
    sectionSubtitle: 'Email me with the context of the system or project and we can talk it through.',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Could not copy. Select the email address or open the link to write.',
    orFind: 'Also on',
    rights: 'All rights reserved.',
    builtWith: 'Built with Next.js, Tailwind and Postgres.',
  },
}

export type { Language }

export const translations: Record<Language, TranslationDict> = { es, en }

/** Rellena marcadores `{clave}` de una cadena del diccionario. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}

/** Fecha ISO (AAAA-MM-DD) en formato largo del idioma, sin desfase horario. */
export function formatDate(iso: string, lang: Language): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang === 'es' ? 'es-PE' : 'en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  })
}
