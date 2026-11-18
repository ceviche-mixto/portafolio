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
  motion: {
    pause: 'Reducir animaciones',
    resume: 'Activar animaciones',
    system: 'Movimiento reducido por tu sistema',
  },
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
    title: 'Construyo sistemas web y plataformas SaaS de punta a punta.',
    subtitle: 'Diseño la interfaz, modelo los datos y despliego el producto. GRADEO y OneCtrl están en producción.',
    primary: 'Ver proyectos',
    secondary: 'Contactar',
    caption: 'GRADEO en producción: búsqueda de docentes, con nombres anonimizados.',
    captionLink: 'Leer el caso GRADEO',
  },
  status: { production: 'En producción', demo: 'Demo técnica' },
  work: {
    title: 'Trabajo seleccionado',
    subtitle: 'Tres sistemas reales. Cada caso muestra una decisión de ingeniería y su efecto en el producto.',
    problemLabel: 'Problema',
    decisionLabel: 'Decisión',
    readCase: 'Leer el caso {name}',
  },
  engineering: {
    title: 'Enfoque de ingeniería',
    subtitle: 'Tres decisiones en sistemas distintos: controlar qué se publica, separar la operación por negocio y rastrear cada lote.',
    readDecision: 'Ver la decisión en {name}',
  },
  projects: {
    open: 'Abrir',
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
    responsibility: 'Responsabilidad',
    constraint: 'Restricción del dominio',
    architecture: 'Arquitectura',
    decisions: 'Decisiones',
    results: 'Resultados y evidencia',
    need: 'Qué necesitaba garantizar',
    choice: 'Qué elegí',
    cost: 'Qué coste acepté',
    proof: 'Cómo lo comprobé',
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
    viewCv: 'Ver CV',
    documentNote: 'PDF en español · 1 página. La vista se abre en otra pestaña.',
    profile: {
      title: 'Perfil profesional',
      content: 'Construyo productos completos: interfaz, modelo de datos, reglas de negocio y despliegue. GRADEO y OneCtrl están en producción; FARMAPLUS resuelve la venta farmacéutica con trazabilidad por lote.',
    },
    experience: {
      title: 'Experiencia',
      xpande: {
        role: 'Practicante Pre Profesional de TI',
        company: 'Corporación Xpande S.A.C.',
        date: 'Oct 2023 - Mar 2024',
        bullets: [
          'Diagnóstico y resolución de incidencias de hardware y software de usuarios internos.',
          'Administración de servidores y mantenimiento preventivo de la red, junto al equipo de TI.',
          'Procesamiento de datos comerciales en Excel avanzado para los reportes de gerencia.',
        ],
      },
    },
    skills: { title: 'Competencias', stack: 'Desarrollo', env: 'Herramientas y datos', basicDocker: 'Docker (básico)', excel: 'Microsoft Excel' },
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
  motion: {
    pause: 'Reduce animations',
    resume: 'Enable animations',
    system: 'Reduced motion requested by your system',
  },
  nav: {
    skipToContent: 'Skip to content',
    menu: 'Sections',
    newTab: 'opens in a new tab',
  },
  lang: { switchLabel: 'ES', switchName: 'versión en español' },
  hero: {
    eyebrow: `${IDENTITY.name} · ${IDENTITY.titleEn}`,
    title: 'I build web systems and SaaS platforms end to end.',
    subtitle: 'I design the interface, model the data, and ship the product. GRADEO and OneCtrl run in production.',
    primary: 'Explore projects',
    secondary: 'Get in touch',
    caption: 'GRADEO in production: professor search, with names anonymized.',
    captionLink: 'Read the GRADEO case study',
  },
  status: { production: 'In production', demo: 'Technical demo' },
  work: {
    title: 'Selected work',
    subtitle: 'Three real systems. Each case shows an engineering decision and how it shapes the product.',
    problemLabel: 'Problem',
    decisionLabel: 'Decision',
    readCase: 'Read the {name} case study',
  },
  engineering: {
    title: 'Engineering approach',
    subtitle: 'Three decisions across different systems: controlling what gets published, separating operations per business and tracing every batch.',
    readDecision: 'See the decision in {name}',
  },
  projects: {
    open: 'Open',
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
    responsibility: 'Responsibility',
    constraint: 'Domain constraint',
    architecture: 'Architecture',
    decisions: 'Decisions',
    results: 'Results and evidence',
    need: 'What I needed to guarantee',
    choice: 'What I chose',
    cost: 'What cost I accepted',
    proof: 'How I verified it',
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
    viewCv: 'View CV',
    documentNote: 'English PDF · 1 page. The preview opens in a new tab.',
    profile: {
      title: 'Professional profile',
      content: 'I build complete products: interface, data model, business rules and deployment. GRADEO and OneCtrl run in production; FARMAPLUS handles pharmacy sales with batch traceability.',
    },
    experience: {
      title: 'Experience',
      xpande: {
        role: 'IT Intern',
        company: 'Corporación Xpande S.A.C.',
        date: 'Oct 2023 - Mar 2024',
        bullets: [
          'Diagnosed and resolved hardware and software incidents for internal users.',
          'Server administration and preventive network maintenance alongside the IT team.',
          'Processed commercial data in advanced Excel for management reporting.',
        ],
      },
    },
    skills: { title: 'Core competencies', stack: 'Development', env: 'Tools and data', basicDocker: 'Docker (basic)', excel: 'Microsoft Excel' },
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
