"use client"

import * as React from "react"
import { ArrowDown, Mail } from "lucide-react"
import { HeroBackground } from "@/components/3d/HeroBackground"
import { SocialLinks } from "@/components/chrome/SocialLinks"
import { Reveal } from "@/components/motion/Reveal"
import { useTranslation } from "@/hooks/useTranslation"

function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

/**
 * Parte un texto en palabras envueltas en `<span>`, cada una con su índice en
 * `--i` para que CSS calcule el retardo.
 *
 * El degradado va en cada palabra, no en el `h1`. Tiene que ser así: la
 * animación pone cada palabra en su propia capa de composición, y entonces el
 * fondo del padre recortado con `background-clip: text` ya no las alcanza —
 * quedaban con `color: transparent` y ningún fondo detrás, es decir invisibles.
 *
 * Los espacios se emiten fuera de los `span` para que el texto siga
 * seleccionable y se copie como una frase normal.
 */
function StaggeredWords({
  text,
  startIndex = 0,
  className,
}: {
  text: string
  startIndex?: number
  className: string
}) {
  const words = text.trim().split(/\s+/)
  return (
    <>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span
            className={className}
            style={{ "--i": startIndex + i } as React.CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  )
}

/**
 * Dos tramos del degradado, uno por línea, para conservar la caída de brillo
 * que daba el degradado diagonal único del `h1`: la primera línea entra en
 * blanco y la segunda se apaga hacia zinc.
 */
const LINE_1_GRADIENT =
  "bg-gradient-to-b from-white to-zinc-200 bg-clip-text text-transparent"
const LINE_2_GRADIENT =
  "bg-gradient-to-b from-zinc-200 to-zinc-500 bg-clip-text text-transparent"

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      <HeroBackground />

      {/* El desvanecido al salir de pantalla lo hace CSS con animation-timeline,
          no JavaScript (ver .hero-parallax en globals.css). */}
      <div className="hero-parallax flex flex-col items-center">
        <Reveal>
          {/* El título se compone con JSX en lugar de inyectar HTML desde el
              diccionario de traducciones (ver D-02).

              Las palabras entran escalonadas: cada `<span>` lleva su índice en
              `--i` y el retardo se calcula en CSS, así que el efecto no cuesta
              ni un byte de JavaScript. */}
          <h1 className="word-in mb-6 text-4xl leading-[1.08] font-black tracking-tighter sm:text-5xl md:text-7xl">
            <StaggeredWords text={t.hero.nameLine} className={LINE_1_GRADIENT} />
            <br />
            <StaggeredWords
              text={t.hero.titleLine}
              startIndex={countWords(t.hero.nameLine)}
              className={LINE_2_GRADIENT}
            />
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-balance text-base font-light text-zinc-300 md:text-xl">
            {t.hero.subtitle}
          </p>

          {/* Decir qué buscas es la diferencia entre un escaparate y una
              candidatura (ver U-10). */}
          <p className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 md:text-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t.hero.availability}
          </p>

          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#gradeo"
                className="rounded-full bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-900 shadow-xl transition-colors hover:bg-white"
              >
                {t.hero.viewWork}
              </a>
              <a
                href="#contacto"
                className="flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-bold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {t.hero.contactMe}
              </a>
            </div>

            <SocialLinks newTabHint={t.nav.newTab} />
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-8 text-zinc-400 motion-safe:animate-bounce">
        <ArrowDown className="h-6 w-6" aria-hidden="true" />
      </div>
    </section>
  )
}
