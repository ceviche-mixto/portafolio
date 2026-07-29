"use client"

import * as React from "react"
import { Reveal } from "@/components/motion/Reveal"
import { Mail, Copy, Check, MapPin } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { SocialLinks } from "@/components/chrome/SocialLinks"
import { IDENTITY } from "@/lib/site"

/**
 * Sección de contacto.
 *
 * El sitio no tenía ninguna: terminaba en un pie con dos iconos sociales, así que
 * quien se convencía no tenía qué hacer con esa convicción (ver U-02).
 *
 * El correo se muestra en claro además de enlazarse: mucha gente prefiere
 * copiarlo a que se le abra un cliente de correo.
 */
export function ContactSection() {
  const { t } = useTranslation()
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(IDENTITY.email)
      setCopied(true)
    } catch {
      // Si el portapapeles está bloqueado, el correo sigue visible y enlazado.
    }
  }

  return (
    <section
      id="contacto"
      className="relative z-10 scroll-mt-20 overflow-hidden border-t border-zinc-900 bg-zinc-950 pt-24 pb-24"
    >
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />

      <Reveal className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          {t.contact.sectionTitle}
        </h2>
        <p className="mb-8 max-w-xl text-balance text-lg text-zinc-300">
          {t.contact.sectionSubtitle}
        </p>

        <div className="mb-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <a
            href={`mailto:${IDENTITY.email}`}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-zinc-100 px-6 py-3.5 text-sm font-bold text-zinc-900 shadow-xl transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span className="truncate">{IDENTITY.email}</span>
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-5 py-3.5 text-sm font-bold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copied ? t.contact.copied : t.contact.copy}
          </button>
          {/* Región activa: quien usa lector de pantalla también recibe la
              confirmación de que se copió. */}
          <span aria-live="polite" className="sr-only">
            {copied ? t.contact.copied : ""}
          </span>
        </div>

        <p className="mb-8 flex items-center gap-2 text-sm text-zinc-400">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {t.bento.city}
        </p>

        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
            {t.contact.orFind}
          </p>
          <SocialLinks size="lg" newTabHint={t.nav.newTab} />
        </div>
      </Reveal>
    </section>
  )
}
