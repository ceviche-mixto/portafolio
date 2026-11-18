import { serializeJsonLd } from "@/lib/structured-data"

/** Datos estructurados en la página. No es código: el navegador no lo ejecuta. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
