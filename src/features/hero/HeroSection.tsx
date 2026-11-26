import { LogoRunner } from "@/components/motion/LogoRunner"
import { PixelText } from "@/components/motion/PixelText"
import { buttonVariants } from "@/components/ui/button-variants"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { CV_FILES } from "@/lib/site"
import { cn } from "@/lib/utils"

/** Telemetría decorativa del HUD: versión del sitio y coordenadas de Chiclayo. */
const HUD = { left: "SYS://PORTFOLIO v2.0", right: "06.7714°S · 79.8409°W" }
/** Miras vectoriales en las cuatro esquinas del panel. */
const CORNERS = [
  "top-3 left-3 border-t-2 border-l-2 rounded-tl-lg",
  "top-3 right-3 border-t-2 border-r-2 rounded-tr-lg",
  "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg",
  "bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg",
]

/**
 * Hero centrado: quién soy, en breve. Un panel HUD de tinta flota sobre el
 * fondo global (`GlobalProceduralBackdrop`, en la portada) con miras en las
 * esquinas, scanlines, un barrido de entrada y borde con brillo cobalto/cian.
 *
 * El titular se decodifica letra a letra (`PixelText`, sólo CSS) y espera a
 * la intro (SplashLoader) en la primera visita. Los CTA son magnéticos como
 * todos los botones (`MagneticField`). Debajo, la escena del logo
 * (`LogoRunner`), que trae la pausa compartida de todo el movimiento continuo.
 *
 * Los proyectos no se nombran aquí: GRADEO abre «Trabajo seleccionado», justo
 * debajo. Toda la decoración es `aria-hidden` y `pointer-events: none`; el
 * texto se mide contra la tinta sólida del panel.
 */
export function HeroSection({ lang }: { lang: Language }) {
  const t = translations[lang]

  return (
    <section aria-labelledby="hero-titulo" className="relative px-4 pt-36 pb-16 sm:px-6 sm:pt-28 lg:pb-24">
      <div className="theme-ink relative mx-auto max-w-[1040px] overflow-clip rounded-[28px] border border-[#00F0FF]/30 shadow-[0_0_0_1px_rgba(37,59,214,0.45),0_0_64px_-12px_rgba(37,59,214,0.7),0_32px_80px_-32px_rgba(21,23,28,0.8)]">
        <div aria-hidden="true" className="hud-glow pointer-events-none absolute inset-0" />
        <div className="relative px-5 pt-5 pb-10 text-center sm:px-12 sm:pb-12">
          <div aria-hidden="true" className="flex items-center justify-between gap-4 pl-4 font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase sm:pr-4">
            <span>{HUD.left}</span>
            <span className="hidden sm:inline">{HUD.right}</span>
          </div>
          <p className="mt-10 font-mono text-[11px] tracking-[0.14em] text-balance text-[#00F0FF] uppercase sm:text-sm sm:tracking-[0.22em]">
            <span aria-hidden="true" className="relative mr-3 inline-flex size-2.5 align-[-1px]">
              <span className="hud-ping absolute inset-0 rounded-full bg-[#00F0FF]" />
              <span className="relative size-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
            </span>
            {t.hero.eyebrow}
          </p>
          <h1
            id="hero-titulo"
            className="mx-auto mt-6 max-w-[22ch] text-[clamp(2.1rem,5.4vw,4.25rem)] leading-[1.06] font-bold tracking-[-0.035em] text-balance text-foreground"
          >
            <PixelText text={t.hero.title} />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg">{t.hero.subtitle}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="#proyectos" className={cn(buttonVariants(), "hover:shadow-[0_0_28px_-4px_rgba(0,240,255,0.6)]")}>
              <span>{t.hero.primary}</span>
            </a>
            <a
              href={CV_FILES[lang]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.hero.secondary} (${t.nav.newTab})`}
              className={cn(buttonVariants({ variant: "secondary" }), "hover:border-[#00F0FF]")}
            >
              <span>{t.hero.secondary}</span>
            </a>
          </div>
        </div>
        <div className="relative border-t border-[#00F0FF]/20 bg-[#0B0D12]">
          <LogoRunner jumpLabel={t.hero.jump} pauseLabel={t.hero.pause} hint={t.hero.jumpHint} />
        </div>
        <div aria-hidden="true" className="hud-scan pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="hud-sweep pointer-events-none absolute inset-x-0 top-0" />
        {CORNERS.map((corner) => (
          <span key={corner} aria-hidden="true" className={cn("hud-corner pointer-events-none", corner)} />
        ))}
      </div>
    </section>
  )
}
