import type { Project } from "./types"

/** Recuento de pruebas obtenido con `pytest --collect-only` el 18 de noviembre de 2026. */
export const onectrl: Project = {
  slug: "onectrl",
  name: "OneCtrl",
  status: "production",
  url: "https://thingshopp.pythonanywhere.com/",
  repo: null,
  codeOnRequest: true,
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
    es: "SaaS multi-negocio en producción: ventas, inventario, facturación, clínica, gimnasio y suscripciones sobre una aplicación Flask con MySQL, con portal móvil para los clientes.",
    en: "A multi-business SaaS in production: sales, inventory, invoicing, clinic, gym and subscriptions on one Flask application with MySQL, plus a mobile portal for customers.",
  },
  responsibility: {
    es: "Responsable del desarrollo: modelo de datos, migraciones versionadas, importación de catálogos, portal de clientes y suite de pruebas.",
    en: "Responsible for development: data model, versioned migrations, catalog import, customer portal and test suite.",
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
    title: { es: "Importación de un catálogo", en: "Importing a catalog" },
    steps: [
      {
        title: { es: "Sesión y negocio activo", en: "Session and active business" },
        body: {
          es: "Al iniciar sesión, negocio_id queda en la sesión del servidor y acota cada consulta posterior.",
          en: "On sign-in, negocio_id is stored in the server session and scopes every later query.",
        },
      },
      {
        title: { es: "Vista previa de la hoja", en: "Sheet preview" },
        body: {
          es: "El archivo se normaliza y valida antes de escribir: hasta 1 MB y 200 filas por carga, con los errores reportados por fila.",
          en: "The file is normalized and validated before writing: up to 1 MB and 200 rows per upload, with errors reported per row.",
        },
      },
      {
        title: { es: "Validación contra el catálogo", en: "Validation against the catalog" },
        body: {
          es: "Se leen los productos del negocio con FOR UPDATE y se comprueban duplicados y límites de catálogo y de cuota diaria.",
          en: "The business’s products are read with FOR UPDATE and checked for duplicates, catalog limits and daily quota.",
        },
      },
      {
        title: { es: "Escritura en el catálogo", en: "Write to the catalog" },
        body: {
          es: "Las filas válidas se insertan en el catálogo de ese negocio dentro de la misma transacción que lo bloqueó.",
          en: "Valid rows are inserted into that business’s catalog inside the same transaction that locked it.",
        },
      },
    ],
  },
  decisions: [
    {
      id: "aislamiento-por-negocio",
      title: {
        es: "Acoté cada operación al negocio de la sesión",
        en: "I scoped every operation to the session’s business",
      },
      need: {
        es: "Que un usuario no pudiera leer ni escribir datos de otro negocio en una base compartida.",
        en: "A user must not read or write another business’s data on a shared database.",
      },
      choice: {
        es: "negocio_id vive en la sesión del servidor y entra como parámetro en cada consulta; el importador también filtra y bloquea por negocio_id.",
        en: "negocio_id lives in the server session and is passed as a parameter to every query; the importer also filters and locks by negocio_id.",
      },
      cost: {
        es: "El aislamiento depende de que cada consulta nueva incluya el filtro: es disciplina en el código, no una base por cliente.",
        en: "Isolation depends on every new query including the filter: it is discipline in the code, not one database per customer.",
      },
      proof: {
        es: "La suite automatizada recoge 278 pruebas con pytest (recuento del 18 de noviembre de 2026).",
        en: "The automated suite collects 278 tests with pytest (count from November 18, 2026).",
      },
      code: {
        label: "servicios/inventario/importacion.py",
        source: `SELECT id, nombre, codigo_barra
FROM   producto
WHERE  negocio_id = %s
ORDER  BY id
LIMIT  10001
FOR UPDATE`,
      },
    },
    {
      id: "importacion-con-limites",
      title: {
        es: "Puse límites explícitos a la importación de catálogos",
        en: "I put explicit limits on catalog imports",
      },
      need: {
        es: "Permitir cargas masivas desde hojas de cálculo sin que un archivo grande o repetido degrade el servicio que comparten todos los negocios.",
        en: "Allow bulk uploads from spreadsheets without a large or repeated file degrading the service every business shares.",
      },
      choice: {
        es: "1 MB y 200 filas por carga, 10 000 productos por catálogo, 1 000 importados por negocio al día y 5 intentos por minuto por usuario.",
        en: "1 MB and 200 rows per upload, 10,000 products per catalog, 1,000 imported per business per day and 5 attempts per minute per user.",
      },
      cost: {
        es: "Un catálogo grande se carga en varias tandas, a veces en varios días.",
        en: "A large catalog is loaded in several batches, sometimes over several days.",
      },
      proof: {
        es: "Los límites se aplican antes de escribir y cada rechazo le dice al usuario cómo continuar.",
        en: "The limits apply before anything is written, and each rejection tells the user how to continue.",
      },
    },
  ],
  evidence: {
    asOf: "2026-11-18",
    source: {
      es: "Revisado en el repositorio privado y en la versión pública.",
      en: "Checked in the private repository and on the public version.",
    },
    items: [
      { label: { es: "Pruebas automatizadas", en: "Automated tests" }, value: { es: "278", en: "278" }, note: { es: "recogidas por pytest", en: "collected by pytest" } },
      { label: { es: "PIN del portal de clientes", en: "Customer portal PIN" }, value: { es: "4 dígitos", en: "4 digits" } },
      { label: { es: "Cuota diaria de importación", en: "Daily import quota" }, value: { es: "1 000 productos por negocio", en: "1,000 products per business" } },
      { label: { es: "Esquema", en: "Schema" }, value: { es: "Migraciones SQL numeradas", en: "Numbered SQL migrations" } },
    ],
  },
}
