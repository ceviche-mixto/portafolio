"use client"

import * as React from "react"
import { ArrowDown, Mail } from "lucide-react"
import { HeroBackground } from "@/components/3d/HeroBackground"
import { SocialLinks } from "@/components/chrome/SocialLinks"
import { Reveal } from "@/components/motion/Reveal"
import { useTranslation } from "@/hooks/useTranslation"

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
              diccionario de traducciones (ver D-02). */}
          <h1 className="mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-5xl md:text-7xl">
            {t.hero.nameLine}
            <br />
            {t.hero.titleLine}
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
