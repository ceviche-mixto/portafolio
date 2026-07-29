import { IDENTITY } from './site'

/**
 * Diccionario de traducciones.
 *
 * Dos reglas:
 * 1. Nada de HTML en las cadenas. Lo que necesite énfasis o salto de línea se
 *    parte en trozos y se compone con JSX en el componente (ver D-02).
 * 2. Cada afirmación técnica sobre GRADEO describe el esquema real en
 *    producción. Si cambias el producto, cambia esto (ver C-01, C-04).
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
  hero: {
    nameLine: `${IDENTITY.name}.`,
    titleLine: `${IDENTITY.titleEs}.`,
    subtitle:
      'Construyo sistemas donde lo difícil es el modelo de datos: reseñas anónimas, un ERP de farmacia con facturación electrónica, y la moderación que mantiene fiables a los dos.',
    availability: 'Disponible para prácticas y puestos junior — Chiclayo o remoto',
    viewWork: 'Ver el trabajo',
    contactMe: 'Hablemos',
  },
  mode: {
    recruiter: 'Reclutador',
    developer: 'Desarrollador',
    switchToDeveloper: 'Cambiar a vista de desarrollador',
    switchToRecruiter: 'Cambiar a vista de reclutador',
  },
  lang: { switchTo: 'Switch to English', current: 'Idioma: español' },
  gradeo: {
    professorsFallback: 'más de 900',
    eyebrow: 'PROYECTO DESTACADO',
    title: 'GRADEO',
    subtitle: 'Reseñas anónimas de profesores que siguen siendo fiables.',
    oneLiner:
      'Una plataforma estudiantil con {professors} profesores: reseñas anónimas con cola de moderación, y las herramientas de estudio que los alumnos abren a diario.',
    caseStudyBtn: 'Leer el case study técnico',
    viewLive: 'Ver en vivo',
    viewCode: 'Código',
    lifecycleTitle: 'El ciclo de vida de una reseña',
    scrollIndicator: 'Desplázate hacia abajo',
    stepsLabel: 'Arquitectura de una reseña, en cuatro pasos',
  },
  bento: {
    liveMetrics: 'Métricas en vivo',
    totalReviews: 'Reseñas aprobadas',
    listedProfessors: 'Profesores indexados',
    liveLabel: 'En vivo desde producción',
    campus: 'Campus USAT',
    city: 'Chiclayo, Perú',
    mapTitle: 'Mapa del campus USAT en Chiclayo, Perú',
    loadMap: 'Cargar mapa interactivo',
    topRated: 'Profesores mejor calificados',
    scale: 'sobre 5',
    impactTitle: 'Por qué existe',
    impactText:
      'Los alumnos elegían cursos de oídas. GRADEO convierte eso en {professors} profesores indexados, valorados en cuatro ejes distintos en lugar de una estrella difusa.',
    insightTitle: 'El cálculo, tal como corre',
    insightSubtitle: 'Trigger de Postgres · no es un promedio ponderado',
    insightNote:
      'Media de cuatro ejes, sólo reseñas aprobadas. Diez decimales para ordenar sin empates, uno para pintar las barras.',
    devHint: 'El modo desarrollador muestra el SQL real detrás de cada tarjeta',
  },
  scrolly: {
    instruction:
      'Cuatro pasos desde un toque hasta un puntaje recalculado. Lo interesante no es la velocidad: es seguir siendo anónimo y aun así rechazar spam.',
    step1Title: '1. Envío anónimo',
    step1Desc:
      'Sin cuenta. La reseña lleva cuatro valoraciones de 1 a 5 y un texto de al menos diez caracteres, exigido por restricciones de columna en lugar de confiar en el cliente.',
    step2Title: '2. Rate limiting sin identidad',
    step2Desc:
      'Guardamos el hash de la IP, nunca la IP. Alcanza para frenar una avalancha e imposibilita volver a una persona.',
    step3Title: '3. Cola de moderación',
    step3Desc:
      'Las reseñas entran como pendientes. Un panel con roles y un PIN que se bloquea tras varios intentos decide si se aprueban.',
    step4Title: '4. Agregación al aprobar',
    step4Desc:
      'Un trigger recalcula las cuatro medias contando sólo reseñas aprobadas, así una pendiente nunca puede mover un puntaje.',
  },
  caseStudy: {
    title: 'GRADEO: anonimato que aun así se puede moderar',
    desc: 'Cómo una plataforma de reseñas anónimas se mantiene fiable, y las herramientas de estudio en las que creció.',
    challengeTitle: 'El problema',
    challengeText:
      'Los sitios de reseñas anónimas se degradan de dos maneras: ponen muros de acceso hasta que nadie publica, o se quedan abiertos y se llenan de spam. No quería ninguna. Las reseñas tenían que ser realmente anónimas, y los datos detrás lo bastante limpios como para que un puntaje signifique algo.',
    solutionTitle: 'Cómo funciona',
    solutionText:
      'El anonimato y la responsabilidad están separados. Enviar no requiere cuenta, pero cada reseña se asocia al hash de su IP de origen para el rate limiting, entra en una cola de moderación como pendiente, y sólo cuenta para el profesor cuando se aprueba. El panel de administración detrás tiene cuatro roles, un PIN como segundo factor y bloqueo tras varios intentos.',
    searchTitle: 'La decisión que defendería en una entrevista',
    searchText:
      'La búsqueda usa similitud por trigramas. Empleé el operador % en lugar de similarity() > umbral porque sólo la forma con operador la reconoce el planner como respaldada por índice. Con ~900 filas Postgres todavía elige un seq scan —a este tamaño sale más barato igual— pero la consulta queda lista para el índice y conmuta sola cuando la tabla crezca. Optimizado para el crecimiento, no para la demo.',
    scaleTitle: 'Dónde está hoy',
    scaleText:
      '21 tablas en Postgres 17: profesores, universidades, sedes y carreras conectados de muchos a muchos; alta colaborativa de profesores con flujo de aprobación; reportes de abuso con ciclo de resolución; y una suite de estudio —notas por bloques, horarios, notas del semestre, pomodoro— con enlaces compartibles que expiran y funciones de IA medidas por usuario y mes.',
    resultTitle: 'Resultado',
    resultText:
      '{professors} profesores indexados y valorados en cuatro ejes, con la agregación resuelta enteramente en la base de datos para que el frontend nunca recalcule un puntaje.',
  },
  projects: {
    sectionTitle: 'Proyectos',
    sectionSubtitle:
      'Dos sistemas en producción. Uno es un producto de consumo que diseñé de principio a fin; el otro, un negocio con reglas que no puedo negociar.',
    problemLabel: 'Problema',
    roleLabel: 'Rol',
    stackLabel: 'Stack',
    highlightsLabel: 'Lo interesante',
    codeOnRequest: 'Código disponible a petición',
    farmaplus: {
      name: 'FARMAPLUS',
      tagline: 'ERP de farmacia con facturación electrónica peruana.',
      problem:
        'Una farmacia no puede vender desde un punto de venta genérico: tiene que emitir documentos válidos para SUNAT, saber de qué lote salió cada caja y cuándo vence, y cuadrar la caja al cierre.',
      role: 'Desarrollador único — modelo de datos, reglas de negocio e interfaz.',
      highlights: [
        'Facturación electrónica SUNAT con series de documento propias',
        'Trazabilidad por lote y vencimiento, con ajustes de stock auditados',
        'Arqueo de caja: movimientos contra los pagos registrados',
        'Datos farmacológicos: sustancias activas ligadas de muchos a muchos a productos',
        'Compras y proveedores alimentando el mismo stock',
        'Acceso por roles con registro de auditoría en operaciones sensibles',
      ],
    },
    gradeo: {
      name: 'GRADEO',
      tagline: 'Reseñas anónimas de profesores, moderadas.',
      problem:
        'Los alumnos elegían cursos de oídas, y toda alternativa anónima o exigía cuenta o se llenaba de spam.',
      role: 'Desarrollador único — producto, esquema, moderación y crecimiento.',
      highlights: [
        'Cola de moderación con aprobación por rol y PIN como segundo factor',
        'Rate limiting por hash de IP, para que frenar nunca identifique a nadie',
        'Búsqueda por trigramas escrita para estar lista para el índice antes de necesitarlo',
        'Puntaje en cuatro ejes agregado por un trigger de Postgres',
        'Suite de estudio: notas, horarios, notas del semestre y pomodoro con enlaces que expiran',
        'Funciones de IA medidas por usuario y mes en la base de datos',
      ],
    },
  },
  cv: {
    sectionTitle: 'Perfil y experiencia',
    sectionSubtitle:
      'La base detrás de esos dos sistemas, y las herramientas con las que trabajo.',
    downloadCv: 'Descargar CV (PDF)',
    profile: {
      title: 'Perfil profesional',
      content: `${IDENTITY.titleEs} en la USAT, con sólida formación técnica e interés en aportar en soporte técnico, gestión de datos y desarrollo de software. Reconocido por aprendizaje rápido, resolución de problemas y eficiencia operativa.`,
    },
    experience: {
      title: 'Experiencia',
      xpande: {
        role: 'Practicante Pre Profesional de TI',
        company: 'Corporación Xpande S.A.C.',
        date: 'Oct 2023 - Mar 2024',
        bullets: [
          'Soporte técnico y diagnóstico de incidencias de hardware y software para usuarios internos.',
          'Colaboración en administración de servidores y mantenimiento preventivo de la red.',
          'Recolección y procesamiento de datos comerciales con Excel avanzado para reportes gerenciales.',
        ],
      },
    },
    skills: { title: 'Competencias', stack: 'Stack técnico', env: 'Entorno' },
  },
  devConsole: {
    monitor: 'SIS.MONITOR.PERF',
    measured: 'medido',
    memory: 'HEAP JS',
    unavailable: 'n/d',
    renderLabel: 'TIEMPO DE FRAME',
    network: 'RED',
    loading: 'Cargando entorno de desarrollo...',
    ready: '› Listo',
    whoamiText1: `${IDENTITY.name} — ${IDENTITY.titleEs}`,
    whoamiText2:
      'Construyo sistemas donde lo difícil es el modelo de datos. Ahora mismo: GRADEO y FARMAPLUS.',
    openTerminal: 'Abrir terminal',
    closeTerminal: 'Cerrar terminal',
  },
  contact: {
    sectionTitle: 'Hablemos',
    sectionSubtitle:
      'Busco prácticas o un puesto junior, en Chiclayo o remoto. La vía más rápida es el correo.',
    emailLabel: 'Correo',
    copy: 'Copiar',
    copied: 'Copiado',
    orFind: 'O encuéntrame en',
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
  hero: {
    nameLine: `${IDENTITY.name}.`,
    titleLine: `${IDENTITY.titleEn}.`,
    subtitle:
      'I build systems where the hard part is the data model: anonymous review platforms, pharmacy ERP with tax compliance, and the moderation that keeps both trustworthy.',
    availability: 'Open to internships and junior roles — Chiclayo or remote',
    viewWork: 'See the work',
    contactMe: 'Get in touch',
  },
  mode: {
    recruiter: 'Recruiter',
    developer: 'Developer',
    switchToDeveloper: 'Switch to developer view',
    switchToRecruiter: 'Switch to recruiter view',
  },
  lang: { switchTo: 'Cambiar a español', current: 'Language: English' },
  gradeo: {
    professorsFallback: '900+',
    eyebrow: 'FEATURED PROJECT',
    title: 'GRADEO',
    subtitle: 'Anonymous professor reviews that stay trustworthy.',
    oneLiner:
      'A student platform for {professors} professors: anonymous reviews with a moderation queue, plus the study tools students actually open every day.',
    caseStudyBtn: 'Read the technical case study',
    viewLive: 'View live',
    viewCode: 'Code',
    lifecycleTitle: 'The Lifecycle of a Review',
    scrollIndicator: 'Scroll down',
    stepsLabel: 'Architecture of a review, in four steps',
  },
  bento: {
    liveMetrics: 'Live metrics',
    totalReviews: 'Approved reviews',
    listedProfessors: 'Professors indexed',
    liveLabel: 'Live from production',
    campus: 'Campus USAT',
    city: 'Chiclayo, Peru',
    mapTitle: 'Map of the USAT campus in Chiclayo, Peru',
    loadMap: 'Load interactive map',
    topRated: 'Top rated professors',
    scale: 'out of 5',
    impactTitle: 'Why it exists',
    impactText:
      'Students picked courses on hearsay. GRADEO turns that into {professors} indexed professors, rated on four separate axes instead of one blurry star.',
    insightTitle: 'Scoring, as it actually runs',
    insightSubtitle: 'Postgres trigger · not a weighted average',
    insightNote:
      'Four axes averaged, approved reviews only. Ten decimals to sort without ties, one decimal to draw the bars.',
    devHint: 'Developer mode shows the real SQL behind each card',
  },
  scrolly: {
    instruction:
      'Four steps from a tap to a recalculated score. The interesting part is not the speed — it is staying anonymous and still refusing spam.',
    step1Title: '1. Anonymous submission',
    step1Desc:
      'No account required. The review carries four ratings from 1 to 5 and a body of at least ten characters, enforced by column checks rather than trusting the client.',
    step2Title: '2. Rate limiting without identity',
    step2Desc:
      'We store a hash of the IP, never the IP. That is enough to throttle a flood and impossible to walk back to a person.',
    step3Title: '3. Moderation queue',
    step3Desc:
      'Reviews land as pending. Admins approve or reject from a panel gated by role and a PIN that locks itself after repeated failures.',
    step4Title: '4. Aggregation on approval',
    step4Desc:
      'A trigger recomputes the four averages counting approved reviews only, so a pending review can never move a score.',
  },
  caseStudy: {
    title: 'GRADEO: anonymity you can still moderate',
    desc: 'How an anonymous review platform stays trustworthy — and the study tools it grew into.',
    challengeTitle: 'The problem',
    challengeText:
      'Anonymous review sites decay in one of two ways: they add login walls until nobody posts, or they stay open and drown in spam. I wanted neither. The reviews had to be genuinely anonymous, and the data behind them had to stay clean enough that a score means something.',
    solutionTitle: 'How it works',
    solutionText:
      'Anonymity and accountability are separated. Submissions need no account, but every review is hashed against its origin IP for rate limiting, lands in a moderation queue as pending, and only counts toward a professor once approved. The admin panel behind it has four roles, a PIN second factor, and a lockout after repeated failures.',
    searchTitle: 'The decision I would defend in an interview',
    searchText:
      'Search runs on trigram similarity. I used the % operator rather than similarity() > threshold because only the operator form is recognized by the planner as index-backed. At ~900 rows Postgres still picks a sequential scan — cheaper at this size either way — but the query is index-ready, so it switches on its own once the table grows. Optimized for the growth, not for the demo.',
    scaleTitle: 'Where it is now',
    scaleText:
      '21 tables on Postgres 17: professors, universities, campuses and careers wired many-to-many; crowdsourced professor requests with an approval flow; abuse reports with a resolution cycle; and a study suite — block-based notes, timetables, semester grades, pomodoro — with expiring share links and AI features metered per user per month.',
    resultTitle: 'Result',
    resultText:
      '{professors} professors indexed and rated across four axes, with aggregation handled entirely in the database so the frontend never recomputes a score.',
  },
  projects: {
    sectionTitle: 'Projects',
    sectionSubtitle:
      'Two systems in production. One is a consumer product I designed end to end; the other is a business with rules I do not get to negotiate.',
    problemLabel: 'Problem',
    roleLabel: 'Role',
    stackLabel: 'Stack',
    highlightsLabel: 'What is interesting',
    codeOnRequest: 'Code available on request',
    farmaplus: {
      name: 'FARMAPLUS',
      tagline: 'Pharmacy ERP with Peruvian electronic invoicing.',
      problem:
        'A pharmacy cannot sell from a generic point of sale: it has to issue SUNAT-valid documents, know which batch a box came from and when it expires, and reconcile the till at closing.',
      role: 'Sole developer — data model, business rules and interface.',
      highlights: [
        'SUNAT electronic invoicing with its own document series',
        'Batch and expiry traceability, with audited stock adjustments',
        'Till reconciliation: cash movements against recorded payments',
        'Pharmacological data: active substances linked many-to-many to products',
        'Purchasing and suppliers feeding the same stock',
        'Role-based access with an audit log on sensitive operations',
      ],
    },
    gradeo: {
      name: 'GRADEO',
      tagline: 'Anonymous professor reviews, moderated.',
      problem:
        'Students chose courses on hearsay, and every anonymous alternative either demanded an account or filled up with spam.',
      role: 'Sole developer — product, schema, moderation and growth.',
      highlights: [
        'Moderation queue with role-based approval and a PIN second factor',
        'Rate limiting by IP hash, so throttling never identifies anyone',
        'Trigram search written to be index-ready before it needs the index',
        'Four-axis scoring aggregated by a Postgres trigger',
        'Study suite: notes, timetables, grades and pomodoro with expiring share links',
        'AI features metered per user per month in the database',
      ],
    },
  },
  cv: {
    sectionTitle: 'Profile & experience',
    sectionSubtitle:
      'The background behind those two systems, and the tools I reach for.',
    downloadCv: 'Download CV (PDF)',
    profile: {
      title: 'Professional profile',
      content: `${IDENTITY.titleEn} at USAT with a solid technical foundation, looking to contribute in technical support, data management and software development. Recognized for fast learning, problem-solving and operational efficiency.`,
    },
    experience: {
      title: 'Experience',
      xpande: {
        role: 'IT Intern',
        company: 'Corporación Xpande S.A.C.',
        date: 'Oct 2023 - Mar 2024',
        bullets: [
          'Technical support and operational continuity for internal users.',
          'Infrastructure administration and network preventive maintenance.',
          'Data analysis and reporting with advanced Excel for management decisions.',
        ],
      },
    },
    skills: { title: 'Core competencies', stack: 'Tech stack', env: 'Environment' },
  },
  devConsole: {
    monitor: 'SYS.PERF.MONITOR',
    measured: 'measured',
    memory: 'JS HEAP',
    unavailable: 'n/a',
    renderLabel: 'FRAME TIME',
    network: 'NETWORK',
    loading: 'Loading developer environment...',
    ready: '› Ready',
    whoamiText1: `${IDENTITY.name} — ${IDENTITY.titleEn}`,
    whoamiText2:
      'I build systems where the hard part is the data model. Currently: GRADEO and FARMAPLUS.',
    openTerminal: 'Open terminal',
    closeTerminal: 'Close terminal',
  },
  contact: {
    sectionTitle: 'Let’s talk',
    sectionSubtitle:
      'Looking for internships or junior roles, in Chiclayo or remote. The fastest way to reach me is email.',
    emailLabel: 'Email',
    copy: 'Copy',
    copied: 'Copied',
    orFind: 'Or find me on',
    rights: 'All rights reserved.',
    builtWith: 'Built with Next.js, Tailwind and Postgres.',
  },
}

export type Language = 'es' | 'en'

export const translations: Record<Language, TranslationDict> = { es, en }

export const LANGUAGES: Language[] = ['es', 'en']
export const DEFAULT_LANGUAGE: Language = 'es'

export function isLanguage(value: unknown): value is Language {
  return value === 'es' || value === 'en'
}
