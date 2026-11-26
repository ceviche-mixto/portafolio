import type { CSSProperties } from "react"
import { LogoRunner } from "@/components/motion/LogoRunner"
import { PixelText } from "@/components/motion/PixelText"
import { buttonVariants } from "@/components/ui/button-variants"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { CV_FILES } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Pistas de circuito que bajan de la pista del logo hacia «Trabajo
 * seleccionado» (viewBox 1440 × 220). Las del centro son las que quedan a la
 * vista en móvil (`slice` recorta los lados); todas acaban antes del 70 % del
 * alto, que es lo que se ve en 4K cuando el alto llega a su tope.
 */
const CABLES: [number, number][][] = [
  [[120, 0], [120, 36], [176, 92], [176, 150]],
  [[372, 0], [372, 58], [318, 112], [318, 150]],
  [[560, 0], [560, 24], [616, 80], [616, 150]],
  [[682, 0], [682, 44], [720, 82], [720, 150]],
  [[758, 0], [758, 44], [720, 82]],
  [[880, 0], [880, 24], [824, 80], [824, 150]],
  [[1068, 0], [1068, 58], [1122, 112], [1122, 150]],
  [[1320, 0], [1320, 36], [1264, 92], [1264, 150]],
]
const PATHS = CABLES.map((points) => `M${points.join("L")}`)
/** Terminales: donde nace cada pista (bajo el suelo) y donde se conecta abajo. */
const PADS = CABLES.flatMap((points) => [points[0], points.at(-1)!])

/**
 * Hero a sangre, de borde a borde: sólo el bloque humano (eyebrow, titular,
 * subtítulo y los dos CTA magnéticos) centrado sobre tinta, la pista del logo
 * (`LogoRunner`) a todo el ancho y, debajo, un difuminado que funde la tinta
 * con el papel mientras unas pistas de circuito SVG bajan hacia «Trabajo
 * seleccionado» con pulsos ligados al scroll (globals.css, `.hero-cables`).
 *
 * El titular se decodifica letra a letra (`PixelText`, sólo CSS) y espera a
 * la intro (SplashLoader) en la primera visita. La pausa del movimiento
 * continuo vive en la cabecera (`MotionPauseToggle`). Los proyectos no se
 * nombran aquí: GRADEO abre la sección siguiente. Toda la decoración es
 * `aria-hidden` y `pointer-events: none`; el texto se mide contra la tinta sólida.
 */
export function HeroSection({ lang }: { lang: Language }) {
  const t = translations[lang]

  return (
    <section aria-labelledby="hero-titulo" className="relative w-full">
      <div className="theme-ink hero-ink relative overflow-clip">
        <div aria-hidden="true" className="hud-glow pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="hud-scan pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="hud-sweep pointer-events-none absolute inset-x-0 top-0" />
        <div className="relative mx-auto max-w-[1180px] px-[clamp(1.25rem,5vw,3rem)] pt-[clamp(10.5rem,30vw,12rem)] pb-[clamp(2.5rem,6vw,5.5rem)] text-center sm:pt-[clamp(8rem,6rem+6vw,14rem)]">
          <p className="font-mono text-[clamp(0.6875rem,0.6rem+0.3vw,0.9375rem)] tracking-[0.14em] text-balance text-[#00F0FF] uppercase sm:tracking-[0.22em]">
            <span aria-hidden="true" className="relative mr-3 inline-flex size-2.5 align-[-1px]">
              <span className="hud-ping absolute inset-0 rounded-full bg-[#00F0FF]" />
              <span className="relative size-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
            </span>
            {t.hero.eyebrow}
          </p>
          <h1
            id="hero-titulo"
            className="mx-auto mt-[clamp(1.25rem,2vw,2rem)] max-w-[22ch] text-[clamp(2.1rem,1.2rem+4vw,5.75rem)] leading-[1.06] font-bold tracking-[-0.035em] text-balance text-foreground"
          >
            <PixelText text={t.hero.title} />
          </h1>
          <p className="mx-auto mt-[clamp(1.25rem,2vw,2rem)] max-w-[clamp(36rem,45vw,48rem)] text-[clamp(1rem,0.9rem+0.45vw,1.375rem)] leading-relaxed text-body">
            {t.hero.subtitle}
          </p>
          <div className="mt-[clamp(2rem,3vw,3rem)] flex flex-wrap justify-center gap-3">
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
        <LogoRunner />
      </div>
      <div aria-hidden="true" className="hero-fade pointer-events-none relative">
        <svg className="hero-cables absolute inset-0 size-full" viewBox="0 0 1440 220" preserveAspectRatio="xMidYMin slice" fill="none" focusable="false">
          <defs>
            <linearGradient id="hero-cable" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="150">
              <stop offset="0" stopColor="#00F0FF" stopOpacity="0.55" />
              <stop offset="1" stopColor="#253BD6" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          {PATHS.map((d) => (
            <path key={d} d={d} stroke="url(#hero-cable)" strokeWidth="1.25" strokeLinejoin="round" />
          ))}
          {/* Pulsos: un trazo corto que avanza con el scroll; cada pista arranca desfasada. */}
          {PATHS.map((d, i) => (
            <path
              key={`pulse${d}`}
              d={d}
              pathLength={1}
              className="hero-pulse"
              style={{ "--o": `${(i % 4) * 0.08}` } as CSSProperties}
              stroke={i % 2 ? "#253BD6" : "#00F0FF"}
              strokeWidth="2.25"
              strokeLinecap="round"
            />
          ))}
          {PADS.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" fill={y ? "#253BD6" : "#00F0FF"} fillOpacity={y ? 0.7 : 0.9} />
          ))}
        </svg>
      </div>
    </section>
  )
}
