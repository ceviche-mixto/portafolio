import type { Project } from "./types"

/**
 * OneCtrl es el sistema de un equipo en el que contribuyo desde noviembre de
 * 2026. El caso describe sus mecanismos en alto nivel y como del sistema: sin
 * código, rutas internas, nombres de columnas, límites ni datos de clientes.
 *
 * Recuento de pruebas obtenido con `pytest --collect-only` el 18 de noviembre de 2026.
 */
export const onectrl: Project = {
  slug: "onectrl",
  name: "OneCtrl",
  status: "production",
  relation: "contribution",
  role: {
    es: "Desarrollador e investigador de software · desde nov. 2026",
    en: "Software developer and researcher · since Nov 2026",
  },
  url: "https://www.onectrl.es/",
  repo: null,
  codeOnRequest: false,
  stack: ["Python", "Flask", "MySQL", "pytest", "PythonAnywhere"],
  summary: {
    es: "Operaciones de distintos negocios en una sola plataforma, con los datos de cada uno aislados.",
    en: "Operations for different businesses on one platform, with each business’s data kept apart.",
  },
  problem: {
    es: "Cada negocio necesita su catálogo, ventas y clientes sin ver los de otro, aunque compartan la misma base.",
    en: "Each business needs its own catalog, sales and customers without seeing anyone else’s, even on a shared database.",
  },
  headline: {
    es: "Operaciones de distintos negocios en una plataforma",
    en: "Operations for different businesses on one platform",
  },
  result: {
    es: "SaaS multi-negocio en producción, desarrollado por un equipo: módulos operativos como ventas, inventario y facturación sobre una aplicación Flask con MySQL.",
    en: "A multi-business SaaS in production, built by a team: operational modules such as sales, inventory and invoicing on one Flask application with MySQL.",
  },
  responsibility: {
    es: "Desarrollador e investigador de software desde noviembre de 2026. Desarrollo y mejoro módulos operativos, investigo soluciones antes de implementarlas, corrijo errores, escribo pruebas y mantengo el sistema en producción.",
    en: "Software developer and researcher since November 2026. I build and improve operational modules, research solutions before implementing them, fix bugs, write tests and maintain the system in production.",
  },
  constraint: {
    es: "Un solo despliegue atiende a varios negocios: toda consulta tiene que quedar acotada al negocio de la sesión, también en las cargas masivas.",
    en: "One deployment serves several businesses: every query has to stay scoped to the session’s business, bulk imports included.",
  },
  cover: {
    src: "/images/projects/onectrl-portada.png",
    width: 1600,
    height: 1000,
    alt: {
      es: "Portada pública de OneCtrl con un centro operativo de ejemplo: ingresos, servicios, stock crítico y actividad semanal.",
      en: "OneCtrl public landing page with a sample operations center: revenue, services, critical stock and weekly activity.",
    },
    caption: {
      es: "Portada pública en producción. El panel que muestra es ilustrativo; la operación real requiere cuenta.",
      en: "Public landing page in production. The panel it shows is illustrative; real operations require an account.",
    },
  },
  gallery: [],
  architecture: {
    title: { es: "Importación de un catálogo, en alto nivel", en: "Importing a catalog, at a high level" },
    steps: [
      {
        title: { es: "Sesión y negocio activo", en: "Session and active business" },
        body: {
          es: "Al iniciar sesión, el servidor fija el negocio activo y acota a él cada consulta posterior.",
          en: "On sign-in, the server pins the active business and scopes every later query to it.",
        },
      },
      {
        title: { es: "Vista previa de la hoja", en: "Sheet preview" },
        body: {
          es: "El archivo se normaliza y valida antes de escribir, con los errores reportados por fila.",
          en: "The file is normalized and validated before anything is written, with errors reported per row.",
        },
      },
      {
        title: { es: "Validación contra el catálogo", en: "Validation against the catalog" },
        body: {
          es: "Dentro de una transacción se comprueban duplicados y los límites del catálogo de ese negocio.",
          en: "Inside a transaction, duplicates and that business’s catalog limits are checked.",
        },
      },
      {
        title: { es: "Escritura en el catálogo", en: "Write to the catalog" },
        body: {
          es: "Las filas válidas se escriben en el catálogo del negocio en la misma transacción.",
          en: "Valid rows are written to the business’s catalog in the same transaction.",
        },
      },
    ],
  },
  decisions: [
    {
      id: "aislamiento-por-negocio",
      title: {
        es: "Aislamiento por negocio en una base compartida",
        en: "Per-business isolation on a shared database",
      },
      need: {
        es: "Que un usuario no pueda leer ni escribir datos de otro negocio en una base compartida.",
        en: "A user must not read or write another business’s data on a shared database.",
      },
      choice: {
        es: "El negocio activo vive en la sesión del servidor y acota cada consulta, también las cargas masivas. Todo cambio que hago conserva ese acotamiento.",
        en: "The active business lives in the server session and scopes every query, bulk imports included. Every change I make keeps that scoping.",
      },
      cost: {
        es: "El aislamiento depende de que cada consulta nueva incluya el filtro: es disciplina en el código, no una base por cliente.",
        en: "Isolation depends on every new query including the filter: it is discipline in the code, not one database per customer.",
      },
      proof: {
        es: "La suite del sistema recoge 278 pruebas con pytest (recuento del 18 de noviembre de 2026).",
        en: "The system’s suite collects 278 tests with pytest (count from November 18, 2026).",
      },
    },
    {
      id: "importacion-con-limites",
      title: {
        es: "Límites del sistema en la importación de catálogos",
        en: "System limits on catalog imports",
      },
      need: {
        es: "Permitir cargas masivas desde hojas de cálculo sin que un archivo grande o repetido degrade el servicio que comparten todos los negocios.",
        en: "Allow bulk uploads from spreadsheets without a large or repeated file degrading the service every business shares.",
      },
      choice: {
        es: "Límites de tamaño, de filas y de frecuencia que se validan antes de escribir.",
        en: "Size, row and frequency limits that are validated before anything is written.",
      },
      cost: {
        es: "Un catálogo grande se carga en varias tandas.",
        en: "A large catalog is loaded in several batches.",
      },
      proof: {
        es: "Cada rechazo le dice al usuario cómo continuar.",
        en: "Each rejection tells the user how to continue.",
      },
    },
  ],
  evidence: {
    asOf: "2026-11-18",
    source: {
      es: "Revisado con acceso al repositorio privado del equipo y en la versión pública.",
      en: "Checked with access to the team’s private repository and on the public version.",
    },
    items: [
      { label: { es: "Mi participación", en: "My involvement" }, value: { es: "Desde nov. 2026", en: "Since Nov 2026" }, note: { es: "en curso", en: "ongoing" } },
      { label: { es: "Pruebas en la suite del sistema", en: "Tests in the system’s suite" }, value: { es: "278", en: "278" }, note: { es: "recogidas por pytest", en: "collected by pytest" } },
      { label: { es: "Del sistema: esquema", en: "System: schema" }, value: { es: "Migraciones versionadas", en: "Versioned migrations" } },
    ],
  },
}
