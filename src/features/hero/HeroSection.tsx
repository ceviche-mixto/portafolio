import { getImageProps } from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { gradeo } from "@/content/projects/gradeo"
import { projectPath } from "@/content/projects"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"

const MOBILE_CAPTURE = { src: "/images/projects/gradeo-busqueda-movil.png", width: 780, height: 1688 }

/**
 * Hero con prueba real: GRADEO en producción. Titular, acciones y captura
 * llegan visibles en el HTML; nada empieza con opacidad cero.
 *
 * La captura usa dirección de arte (móvil vertical, escritorio apaisada) y
 * prioridad de carga alta porque es el candidato a LCP.
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
          {t.hero.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-body">{t.hero.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#proyectos" className={buttonVariants()}>{t.hero.primary}</a>
          <a href="#contacto" className={buttonVariants({ variant: "secondary" })}>{t.hero.secondary}</a>
        </div>
      </div>

      <figure className="relative lg:col-span-7">
        {/* Línea cobalto: une la nota con el fragmento de interfaz que explica. */}
        <span aria-hidden="true" className="absolute top-1/2 -right-6 -left-6 h-px bg-highlight" />
        <picture className="relative block overflow-clip rounded-2xl border border-border bg-card shadow-[0_12px_32px_-16px_rgba(21,23,28,0.35)]">
          <source media="(min-width: 768px)" srcSet={desktop} sizes={common.sizes} />
          <img
            {...image}
            alt={image.alt}
            className="aspect-[4/5] h-auto w-full object-cover object-top md:aspect-[16/10]"
          />
        </picture>
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
