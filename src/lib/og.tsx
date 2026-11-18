import { ImageResponse } from "next/og"
import { IDENTITY } from "./site"
import type { Language } from "./language"

/**
 * Tarjeta para compartir la portada. Se genera con next/og en build, así que
 * sigue al idioma y al título sin mantener un PNG a mano.
 */
export function homeOgImage(lang: Language, size: { width: number; height: number }) {
  const title = lang === "es" ? IDENTITY.titleEs : IDENTITY.titleEn
  const pitch =
    lang === "es"
      ? "GRADEO y OneCtrl en producción · FARMAPLUS"
      : "GRADEO and OneCtrl in production · FARMAPLUS"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F5F0E8",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "8px", background: "#253BD6" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: "#253BD6", fontWeight: 700 }}>
            {lang === "es" ? "Portafolio de software" : "Software portfolio"}
          </div>
          <div style={{ display: "flex", fontSize: 82, fontWeight: 900, color: "#15171C", letterSpacing: "-0.03em", lineHeight: 1.02 }}>
            {IDENTITY.name}
          </div>
          <div style={{ display: "flex", fontSize: 38, color: "#585963", letterSpacing: "-0.01em" }}>{title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#15171C" }}>{pitch}</div>
          <div style={{ display: "flex", gap: "12px" }}>
            {["GRADEO", "OneCtrl", "FARMAPLUS", "PostgreSQL"].map((tag) => (
              <div key={tag} style={{ display: "flex", fontSize: 22, color: "#15171C", border: "1px solid #D8D0C2", borderRadius: "999px", padding: "8px 22px", background: "#FFFFFF" }}>
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
