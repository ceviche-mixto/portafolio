import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { PROJECTS } from "@/content/projects"
import { translations } from "./i18n"
import type { Language } from "./language"

const FONTS = join(process.cwd(), "src/assets/fonts")
const COLOR = {
  paper: "#F5F0E8",
  ink: "#15171C",
  cobalt: "#253BD6",
  muted: "#585963",
  border: "#D8D0C2",
  evidence: "#ECA888",
}

/**
 * Tarjeta para compartir la portada, generada en build con la paleta editorial
 * y Geist real (OFL, `src/assets/fonts`). Usa el mismo titular que el hero.
 */
export async function homeOgImage(lang: Language, size: { width: number; height: number }) {
  const [regular, semibold] = await Promise.all([
    readFile(join(FONTS, "Geist-Regular.ttf")),
    readFile(join(FONTS, "Geist-SemiBold.ttf")),
  ])
  const t = translations[lang]

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: COLOR.paper,
          color: COLOR.ink,
          padding: "64px 72px",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, color: COLOR.muted }}>{t.hero.eyebrow}</div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              maxWidth: 980,
              fontSize: 70,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
            }}
          >
            {t.hero.title}
          </div>
        </div>

        {/* Línea cobalto: el gesto visual del sitio. */}
        <div style={{ display: "flex", height: 3, width: "100%", background: COLOR.cobalt }} />

        <div style={{ display: "flex", gap: 12 }}>
          {PROJECTS.map((project) => (
            <div
              key={project.slug}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                borderRadius: 999,
                border: `1px solid ${COLOR.border}`,
                background: "#FFFFFF",
                fontSize: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: project.status === "production" ? COLOR.cobalt : COLOR.evidence,
                }}
              />
              <div style={{ display: "flex", fontWeight: 600 }}>{project.name}</div>
              <div style={{ display: "flex", color: COLOR.muted }}>{t.status[project.status]}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
      ],
    }
  )
}
