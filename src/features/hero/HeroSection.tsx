import { getImageProps } from "next/image"
import Link from "next/link"
import { MagneticButton } from "@/components/motion/MagneticButton"
import { SplitText } from "@/components/motion/SplitText"
import { buttonVariants } from "@/components/ui/button-variants"
import { gradeo } from "@/content/projects/gradeo"
import { projectPath } from "@/content/projects"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { CV_FILES } from "@/lib/site"

const MOBILE_CAPTURE = { src: "/images/projects/gradeo-busqueda-movil.png", width: 780, height: 1688 }

/**
 * Hero con prueba real: GRADEO en producción. Titular, acciones y captura
 * llegan en el HTML; nada empieza con opacidad cero. El titular sube carácter
 * a carácter desde su máscara en CSS (`SplitText`, modo `load`) y los CTA son
 * magnéticos con puntero fino (`MagneticButton`).
 *
 * La captura usa dirección de arte (móvil vertical, escritorio apaisada) y
 * prioridad de carga alta porque es el elemento LCP medido. Va dentro de una
 * ventana de recorte con borde cobalto; el escalado ligado al scroll es CSS
 * (`.hero-window`, `.hero-layer`) y la leyenda queda en flujo.
 */
export function HeroSection({ lang }: { lang: Language }) {
  const t = translations[lang]
  const common = {
    alt: gradeo.cover.alt[lang],
    sizes: "(min-width: 1024px) 58vw, 100vw",
    fetchPriority: "high" as const,
    loading: "eager" as const,
  }
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: gradeo.cover.src, width: gradeo.cover.width, height: gradeo.cover.height })
  // El <img> lleva la variante móvil; <source> la sustituye desde 768 px.
  const { props: image } = getImageProps({ ...common, ...MOBILE_CAPTURE })

  return (
    <section
      aria-labelledby="hero-titulo"
      className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 pt-36 pb-20 sm:pt-32 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-28"
    >
      <div className="lg:col-span-5">
        <p className="font-mono text-sm text-muted-foreground">{t.hero.eyebrow}</p>
        <h1
          id="hero-titulo"
          className="mt-4 text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.04] font-bold tracking-[-0.035em] text-balance text-foreground"
        >
          <SplitText text={t.hero.title} trigger="load" />
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-body">{t.hero.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticButton>
            <a href="#proyectos" className={buttonVariants()}>
              <span data-magnetic-text>{t.hero.primary}</span>
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href={CV_FILES[lang]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.hero.secondary} (${t.nav.newTab})`}
              className={buttonVariants({ variant: "secondary" })}
            >
              <span data-magnetic-text>{t.hero.secondary}</span>
            </a>
          </MagneticButton>
        </div>
        <p className="mt-6 font-mono text-sm text-muted-foreground">{t.hero.availability}</p>
      </div>

      <figure className="relative lg:col-span-7">
        {/* Ventana fija con borde cobalto; sólo la captura interior se escala (globals.css). */}
        <div className="hero-window overflow-clip rounded-2xl border border-b-2 border-border border-b-highlight bg-surface-raised shadow-[0_12px_32px_-16px_rgba(21,23,28,0.35)]">
          <picture className="hero-layer block">
            <source media="(min-width: 768px)" srcSet={desktop} sizes={common.sizes} />
            <img
              {...image}
              alt={image.alt}
              className="aspect-[4/5] h-auto w-full object-cover object-top md:aspect-[16/10]"
            />
          </picture>
        </div>
        <figcaption className="mt-3 text-sm text-muted-foreground">
          {t.hero.caption}{" "}
          <Link
            href={projectPath(lang, gradeo.slug)}
            className="inline-flex min-h-11 items-center font-semibold text-highlight underline underline-offset-4"
          >
            {t.hero.captionLink}
          </Link>
        </figcaption>
      </figure>
    </section>
  )
}
