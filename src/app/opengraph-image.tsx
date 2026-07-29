import { ImageResponse } from "next/og"
import { getLanguage } from "@/lib/language-server"
import { IDENTITY } from "@/lib/site"

/**
 * Imagen de la tarjeta al compartir el enlace.
 *
 * Antes no había ninguna: `openGraph` traía título y descripción pero sin
 * `images` ni `metadataBase`, así que en LinkedIn o WhatsApp —por donde de verdad
 * circula un portafolio— el enlace salía como texto plano (ver S-01).
 *
 * Se genera con next/og en lugar de mantener un PNG a mano, así que sigue al
 * idioma y al título sin que haya que reexportar nada.
 */
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `${IDENTITY.name} — Portafolio`

export default async function OpenGraphImage() {
  const lang = await getLanguage()
  const title = lang === "es" ? IDENTITY.titleEs : IDENTITY.titleEn
  const pitch =
    lang === "es"
      ? "Reseñas anónimas moderadas · ERP de farmacia con facturación SUNAT"
      : "Moderated anonymous reviews · Pharmacy ERP with SUNAT invoicing"
  const place = lang === "es" ? IDENTITY.location.es : IDENTITY.location.en

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Filo superior: el mismo degradado emerald→cyan que usa el sitio. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            background: "linear-gradient(90deg, #10b981, #22d3ee)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#34d399",
              fontWeight: 700,
            }}
          >
            {place}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 900,
              color: "#fafafa",
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
            }}
          >
            {IDENTITY.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              color: "#a1a1aa",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#d4d4d8" }}>{pitch}</div>
          <div style={{ display: "flex", gap: "12px" }}>
            {["GRADEO", "FARMAPLUS", "Next.js", "PostgreSQL"].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: "#e4e4e7",
                  border: "1px solid #3f3f46",
                  borderRadius: "999px",
                  padding: "8px 22px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  )
}
