import * as React from "react"
import { ArrowDown, Mail, FileText } from "lucide-react"
import { SocialLinks } from "@/components/chrome/SocialLinks"
import { Reveal } from "@/components/motion/Reveal"
import { buttonVariants } from "@/components/ui/button-variants"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { CV_FILES } from "@/lib/site"

function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

/**
 * Parte un texto en palabras envueltas en `<span>`, cada una con su índice en
 * `--i` para que CSS calcule el retardo.
 *
 * El degradado va en cada palabra, no en el `h1`: la animación pone cada
 * palabra en su propia capa de composición, y el fondo del padre recortado con
 * `background-clip: text` ya no las alcanzaría.
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

/** Un tramo del degradado por línea: la segunda baja hacia el tono secundario. */
const LINE_1_GRADIENT =
  "bg-gradient-to-b from-foreground to-subtle bg-clip-text text-transparent"
const LINE_2_GRADIENT =
  "bg-gradient-to-b from-subtle to-muted-foreground bg-clip-text text-transparent"

export function HeroSection({ lang }: { lang: Language }) {
  const t = translations[lang]

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-6 pt-36 pb-20 text-center sm:pt-24">
      {/* El desvanecido al salir de pantalla lo hace CSS con animation-timeline
          (`.hero-parallax` en globals.css). */}
      <div className="hero-parallax flex flex-col items-center">
        <Reveal>
          {/* Las palabras entran escalonadas: cada `<span>` lleva su índice en
              `--i` y el retardo se calcula en CSS, sin JavaScript. */}
          <h1 className="word-in mb-6 text-4xl leading-[1.08] font-black tracking-[-0.035em] sm:text-5xl md:text-7xl">
            <StaggeredWords text={t.hero.nameLine} className={LINE_1_GRADIENT} />
            <br />
            <StaggeredWords
              text={t.hero.titleLine}
              startIndex={countWords(t.hero.nameLine)}
              className={LINE_2_GRADIENT}
            />
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-balance text-base font-light text-body md:text-xl">
            {t.hero.subtitle}
          </p>

          <p className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-highlight/25 bg-highlight/10 px-4 py-1.5 text-xs font-medium text-highlight md:text-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-highlight opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-highlight" />
            </span>
            {t.hero.availability}
          </p>

          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#gradeo" className={buttonVariants()}>
                {t.hero.viewWork}
              </a>
              <a href="#contacto" className={buttonVariants({ variant: "secondary" })}>
                <Mail aria-hidden="true" />
                {t.hero.contactMe}
              </a>
            </div>

            <a
              href={CV_FILES[lang]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.cv.viewCv} (${t.nav.newTab})`}
              className={buttonVariants({ variant: "link" })}
            >
              <FileText aria-hidden="true" />
              {t.cv.viewCv}
            </a>
            <SocialLinks newTabHint={t.nav.newTab} />
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-8 text-muted-foreground">
        <ArrowDown className="h-6 w-6" aria-hidden="true" />
      </div>
    </section>
  )
}
