import type { Project } from "./types"

export const farmaplus: Project = {
  slug: "farmaplus",
  name: "FARMAPLUS",
  status: "demo",
  relation: "own",
  role: { es: "Desarrollador único", en: "Sole developer" },
  url: null,
  repo: null,
  codeOnRequest: true,
  stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"],
  summary: {
    es: "Venta, inventario y caja con trazabilidad por lote.",
    en: "Sales, inventory and cash reconciliation with batch traceability.",
  },
  problem: {
    es: "Una botica no puede vender desde un POS genérico: necesita saber de qué lote sale cada unidad, emitir comprobantes por serie y cuadrar la caja.",
    en: "A pharmacy cannot sell from a generic POS: it needs to know which batch each unit comes from, issue receipts by series and reconcile the till.",
  },
  headline: {
    es: "Cada venta conserva su lote y su comprobante",
    en: "Every sale keeps its batch and its receipt",
  },
  result: {
    es: "Punto de venta con selección de lote FEFO, stock en unidades base, comprobantes por serie y arqueo de efectivo.",
    en: "A point of sale with FEFO batch selection, stock in base units, receipts by series and cash reconciliation.",
  },
  responsibility: {
    es: "Desarrollador único: modelo de datos, reglas de negocio e interfaz.",
    en: "Sole developer: data model, business rules and interface.",
  },
  constraint: {
    es: "Un lote vencido no puede llegar a caja, un comprobante aceptado no se edita ni se borra, y el arqueo sólo cuenta el efectivo.",
    en: "An expired batch cannot reach the till, an accepted receipt is never edited or deleted, and reconciliation counts cash only.",
  },
  environment: {
    es: "Entorno mostrado: demo técnica. El adaptador de SUNAT funciona por defecto en modo simulado: genera UBL 2.1, XML y CDR con las validaciones de SUNAT sin salir a la red. No se atribuye aceptación de comprobantes reales.",
    en: "Environment shown: technical demo. The SUNAT adapter runs in simulated mode by default: it produces UBL 2.1, XML and CDR with SUNAT’s validations without going online. No acceptance of real receipts is claimed.",
  },
  cover: {
    src: "/images/projects/farmaplus-pos.png",
    width: 1600,
    height: 1000,
    alt: {
      es: "Esquema del punto de venta de FARMAPLUS: carrito con lote FEFO, lote vencido excluido, traza del lote al comprobante B001, totales con IGV y arqueo de efectivo sin diferencia.",
      en: "FARMAPLUS point-of-sale schematic: cart with a FEFO batch, an expired batch excluded, a trace from batch to receipt B001, totals with IGV and a cash count with no difference.",
    },
    caption: {
      es: "Esquema de la interfaz con datos ficticios; no es una captura del sistema.",
      en: "Interface schematic with fictitious data; not a screenshot of the system.",
    },
  },
  gallery: [],
  architecture: {
    title: { es: "Flujo de una venta", en: "Flow of a sale" },
    steps: [
      {
        title: { es: "Punto de venta", en: "Point of sale" },
        body: {
          es: "El lector de código de barras se detecta por la velocidad de tecleo, sin enfocar ningún campo; F4 cobra y F8 cancela.",
          en: "The barcode scanner is detected by typing speed, without focusing a field; F4 charges and F8 cancels.",
        },
      },
      {
        title: { es: "Lote FEFO", en: "FEFO batch" },
        body: {
          es: "Al agregar un producto se asigna el lote que vence primero; los vencidos quedan fuera de la venta y salen por merma.",
          en: "Adding a product assigns the batch that expires first; expired batches stay out of the sale and leave as write-offs.",
        },
      },
      {
        title: { es: "Venta y caja", en: "Sale and till" },
        body: {
          es: "El stock se descuenta en unidades base. Sólo el efectivo entra en la gaveta; Yape, Plin y tarjeta se reportan aparte.",
          en: "Stock is deducted in base units. Only cash goes into the drawer; Yape, Plin and card are reported separately.",
        },
      },
      {
        title: { es: "Comprobante por serie", en: "Receipt by series" },
        body: {
          es: "El comprobante sale con su serie y correlativo en UBL 2.1. Anular emite una nota de crédito y devuelve el stock a su lote de origen.",
          en: "The receipt is issued with its series and number in UBL 2.1. Voiding issues a credit note and returns stock to its original batch.",
        },
      },
    ],
  },
  decisions: [
    {
      id: "lote-fefo",
      title: {
        es: "Elegí el lote por vencimiento, no por llegada",
        en: "I pick the batch by expiry, not by arrival",
      },
      need: {
        es: "Que ningún lote vencido llegue a caja y que el más próximo a vencer salga primero.",
        en: "No expired batch may reach the till, and the one closest to expiry must leave first.",
      },
      choice: {
        es: "Al agregar un producto, el sistema asigna el lote con vencimiento más cercano (FEFO) y lo muestra en la línea del carrito.",
        en: "When a product is added, the system assigns the batch with the nearest expiry (FEFO) and shows it on the cart line.",
      },
      cost: {
        es: "Cada línea consulta lotes y vencimientos, y el cajero no elige el lote libremente.",
        en: "Every line looks up batches and expiry dates, and the cashier cannot pick a batch freely.",
      },
      proof: {
        es: "Los datos de demostración incluyen un lote ya vencido para comprobar que queda fuera de la venta y probar la baja masiva.",
        en: "The demo data includes an already expired batch to check that it stays out of the sale and to test bulk write-off.",
      },
    },
    {
      id: "anular-sin-borrar",
      title: {
        es: "Anular no borra: el stock vuelve a su lote",
        en: "Voiding never deletes: stock returns to its batch",
      },
      need: {
        es: "Conservar la trazabilidad por lote que pide una inspección, también cuando una venta se anula.",
        en: "Keep the batch traceability an inspection asks for, even when a sale is voided.",
      },
      choice: {
        es: "Un comprobante aceptado se neutraliza con una nota de crédito que lo referencia, y el stock vuelve a su lote de origen, no a cualquiera.",
        en: "An accepted receipt is neutralized with a credit note that references it, and stock returns to its original batch, not to any batch.",
      },
      cost: {
        es: "Más documentos y relaciones que un borrado simple: la anulación es un flujo propio.",
        en: "More documents and relations than a plain delete: voiding is a flow of its own.",
      },
      proof: {
        es: "Es una regla de negocio documentada en el repositorio. El proyecto no tiene todavía una suite automatizada pública para este flujo.",
        en: "It is a business rule documented in the repository. The project does not yet have a public automated suite for this flow.",
      },
    },
  ],
  evidence: {
    asOf: "2026-11-18",
    source: {
      es: "Revisado en el repositorio privado.",
      en: "Checked in the private repository.",
    },
    items: [
      { label: { es: "Formato de comprobante", en: "Receipt format" }, value: { es: "UBL 2.1", en: "UBL 2.1" }, note: { es: "en modo simulado", en: "in simulated mode" } },
      { label: { es: "Selección de lote", en: "Batch selection" }, value: { es: "FEFO", en: "FEFO" } },
      { label: { es: "Unidad de stock", en: "Stock unit" }, value: { es: "Unidad base", en: "Base unit" } },
      { label: { es: "Arqueo", en: "Reconciliation" }, value: { es: "Sólo efectivo", en: "Cash only" } },
    ],
  },
}
