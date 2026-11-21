import type { Project } from "./types"

/**
 * Recuento verificado en la base de producción (PostgreSQL 17.6) el 18 de
 * noviembre de 2026, 09:18 UTC. Es la evidencia del caso y el respaldo de la
 * lectura viva cuando la base no responde.
 */
export const GRADEO_VERIFIED = {
  asOf: "2026-11-18",
  professors: 919,
  approvedReviews: 84,
  tables: 24,
  rlsPolicies: 67,
  triggers: 7,
  trigramIndexes: 2,
} as const

const both = (value: number | string) => ({ es: String(value), en: String(value) })

export const gradeo: Project = {
  slug: "gradeo",
  name: "GRADEO",
  status: "production",
  relation: "own",
  role: { es: "Creador y único desarrollador", en: "Creator and sole developer" },
  url: "https://gradeo.vercel.app",
  repo: null,
  codeOnRequest: true,
  stack: ["Next.js", "TypeScript", "PostgreSQL 17", "Supabase", "Vercel"],
  summary: {
    es: "Reseñas anónimas de profesores que se publican sólo después de moderación.",
    en: "Anonymous professor reviews that are published only after moderation.",
  },
  problem: {
    es: "Un sitio de reseñas anónimas se llena de spam si queda abierto, y nadie publica si exige cuenta.",
    en: "An anonymous review site fills with spam when it stays open, and nobody posts when it requires an account.",
  },
  headline: {
    es: "Reseñas anónimas que se publican tras moderación",
    en: "Anonymous reviews published after moderation",
  },
  result: {
    es: "Plataforma pública en producción con 919 docentes indexados y 84 reseñas aprobadas al 18 de noviembre de 2026. El puntaje de cada docente sólo incorpora reseñas aprobadas.",
    en: "A public platform in production with 919 indexed professors and 84 approved reviews as of November 18, 2026. Each professor’s score counts approved reviews only.",
  },
  responsibility: {
    es: "Desarrollador único: producto, esquema de datos, políticas de acceso, moderación e interfaz.",
    en: "Sole developer: product, data schema, access policies, moderation and interface.",
  },
  constraint: {
    es: "Enviar tenía que ser anónimo y sin cuenta, pero la base debía frenar el spam y ningún registro pendiente podía mover un puntaje.",
    en: "Submitting had to stay anonymous and account-free, yet the database had to hold back spam and no pending record could move a score.",
  },
  cover: {
    src: "/images/projects/gradeo-busqueda.png",
    width: 1600,
    height: 1000,
    alt: {
      es: "Búsqueda de GRADEO en producción con sugerencias de docentes y tarjetas de resultados con su puntaje.",
      en: "GRADEO search in production with professor suggestions and result cards showing their scores.",
    },
    caption: {
      es: "Búsqueda en producción. Nombres de docentes anonimizados para esta captura.",
      en: "Search in production. Professor names anonymized for this screenshot.",
    },
  },
  gallery: [
    {
      src: "/images/projects/gradeo-resultado.png",
      width: 1600,
      height: 1000,
      alt: {
        es: "Ficha de un docente en GRADEO: puntaje general 5.00 basado en 4 reseñas aprobadas y métricas por eje.",
        en: "A professor page on GRADEO: overall score 5.00 from 4 approved reviews and per-axis metrics.",
      },
      caption: {
        es: "Ficha con las cuatro medias por eje. Nombre y texto de las reseñas omitidos en la captura.",
        en: "Professor page with the four per-axis averages. Name and review text omitted from the screenshot.",
      },
    },
  ],
  architecture: {
    title: { es: "Ciclo de una reseña", en: "Lifecycle of a review" },
    steps: [
      {
        title: { es: "Envío anónimo", en: "Anonymous submission" },
        body: {
          es: "Sin cuenta. Cuatro valoraciones de 1 a 5 y un texto mínimo, exigidos por restricciones de columna en lugar de confiar en el cliente.",
          en: "No account. Four ratings from 1 to 5 and a minimum body, enforced by column checks instead of trusting the client.",
        },
      },
      {
        title: { es: "Límite sin identidad", en: "Rate limit without identity" },
        body: {
          es: "Un hash de la IP detecta envíos repetidos sin guardar la dirección en texto claro.",
          en: "An IP hash detects repeated submissions without storing the address in plain text.",
        },
      },
      {
        title: { es: "Cola de moderación", en: "Moderation queue" },
        body: {
          es: "La reseña entra como pendiente. Un panel con roles y un PIN como segundo factor decide si se aprueba.",
          en: "The review lands as pending. A role-gated panel with a PIN second factor decides whether it is approved.",
        },
      },
      {
        title: { es: "Agregación al aprobar", en: "Aggregation on approval" },
        body: {
          es: "El trigger update_professor_metrics() recalcula las cuatro medias contando sólo reseñas aprobadas.",
          en: "The update_professor_metrics() trigger recomputes the four averages counting approved reviews only.",
        },
      },
    ],
    note: {
      es: "Las políticas RLS cubren las 24 tablas del esquema público; los registros pendientes nunca entran en el agregado.",
      en: "RLS policies cover all 24 tables in the public schema; pending records never reach the aggregate.",
    },
  },
  decisions: [
    {
      id: "publicacion-moderada",
      title: {
        es: "Separé el envío de reseñas de su publicación",
        en: "I separated review submission from publication",
      },
      need: {
        es: "Que una reseña anónima no pudiera alterar el puntaje de un docente antes de que alguien la revisara.",
        en: "An anonymous review must not change a professor’s score before someone has reviewed it.",
      },
      choice: {
        es: "Toda reseña entra como pendiente. Dos triggers sobre reviews ejecutan update_professor_metrics(), que agrega sólo las filas con status = 'approved'.",
        en: "Every review lands as pending. Two triggers on reviews run update_professor_metrics(), which aggregates only rows with status = 'approved'.",
      },
      cost: {
        es: "Una reseña legítima tarda en aparecer hasta que se modera, y la cola exige mantener un panel con roles.",
        en: "A legitimate review waits until it is moderated, and the queue requires maintaining a role-gated panel.",
      },
      proof: {
        es: "En producción, el recuento de reseñas con status = 'approved' devolvió 84 el 18 de noviembre de 2026: es la cifra que publica el sitio.",
        en: "In production, counting reviews with status = 'approved' returned 84 on November 18, 2026: the figure the site publishes.",
      },
      code: {
        label: "update_professor_metrics()",
        source: `select avg(rating_personality), avg(rating_methodology),
       avg(rating_clarity), avg(rating_fairness), count(*)
into   _p, _m, _c, _f, _count
from   public.reviews
where  professor_id = _prof_id
  and  status = 'approved';

_total := (_p + _m + _c + _f) / 4.0;`,
      },
    },
    {
      id: "busqueda-trigramas",
      title: {
        es: "Escribí la búsqueda para el índice antes de necesitarlo",
        en: "I wrote search for the index before it needed one",
      },
      need: {
        es: "Encontrar docentes con nombres incompletos o mal escritos sin reescribir la consulta cuando la tabla crezca.",
        en: "Find professors from partial or misspelled names without rewriting the query as the table grows.",
      },
      choice: {
        es: "Similitud por trigramas con el operador % y orden por similarity(). professors tiene el índice GIN idx_professors_name_trgm.",
        en: "Trigram similarity with the % operator, ordered by similarity(). professors has the GIN index idx_professors_name_trgm.",
      },
      cost: {
        es: "Con unas 900 filas Postgres todavía elige un recorrido secuencial, y el índice se mantiene en cada escritura.",
        en: "At about 900 rows Postgres still picks a sequential scan, and the index is maintained on every write.",
      },
      proof: {
        es: "Sólo la forma con operador es la que el planner asocia al índice. Lo comprobé con EXPLAIN ANALYZE el 1 de julio de 2026; no publico cifras de latencia sin un plan reproducible.",
        en: "Only the operator form is the one the planner ties to the index. I checked it with EXPLAIN ANALYZE on July 1, 2026; I do not publish latency figures without a reproducible plan.",
      },
      code: {
        label: "search_professors_similarity()",
        source: `set local pg_trgm.similarity_threshold = 0.1;

select p.id, p.name,
       similarity(p.name, search_query)::real as similarity
from   public.professors p
where  p.name % search_query
   or  p.name ilike '%' || search_query || '%'
order  by similarity desc
limit  20;`,
      },
    },
  ],
  evidence: {
    asOf: GRADEO_VERIFIED.asOf,
    source: {
      es: "Consultado en la base de producción (PostgreSQL 17.6).",
      en: "Queried on the production database (PostgreSQL 17.6).",
    },
    items: [
      { label: { es: "Docentes indexados", en: "Indexed professors" }, value: both(GRADEO_VERIFIED.professors) },
      { label: { es: "Reseñas aprobadas", en: "Approved reviews" }, value: both(GRADEO_VERIFIED.approvedReviews) },
      { label: { es: "Tablas en el esquema public", en: "Tables in the public schema" }, value: both(GRADEO_VERIFIED.tables) },
      {
        label: { es: "Tablas con RLS activa", en: "Tables with RLS enabled" },
        value: { es: `${GRADEO_VERIFIED.tables} de ${GRADEO_VERIFIED.tables}`, en: `${GRADEO_VERIFIED.tables} of ${GRADEO_VERIFIED.tables}` },
        note: { es: `${GRADEO_VERIFIED.rlsPolicies} políticas en total`, en: `${GRADEO_VERIFIED.rlsPolicies} policies in total` },
      },
      { label: { es: "Triggers propios", en: "Custom triggers" }, value: both(GRADEO_VERIFIED.triggers) },
      { label: { es: "Índices GIN de trigramas", en: "Trigram GIN indexes" }, value: both(GRADEO_VERIFIED.trigramIndexes) },
    ],
  },
}
