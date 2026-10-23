"use client"

import * as React from "react"
import { Reveal } from "@/components/motion/Reveal"
import { Mail, Copy, Check } from "lucide-react"
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
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "failed">("idle")

  React.useEffect(() => {
    if (copyState === "idle") return
    const timer = setTimeout(() => setCopyState("idle"), 4000)
    return () => clearTimeout(timer)
  }, [copyState])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(IDENTITY.email)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
  }

  return (
    <section
      id="contacto"
      className="relative z-10 overflow-hidden border-t border-soft bg-background pt-24 pb-24"
    >
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-highlight/5 blur-[120px]" />

      <Reveal className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {t.contact.sectionTitle}
        </h2>
        <p className="mb-8 max-w-xl text-balance text-lg text-body">
          {t.contact.sectionSubtitle}
        </p>

        <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <a
            href={`mailto:${IDENTITY.email}`}
            className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2.5 rounded-full bg-action px-5 py-3.5 text-sm font-bold text-action-foreground transition-colors hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 [overflow-wrap:anywhere]">{IDENTITY.email}</span>
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border px-5 py-3.5 text-sm font-bold text-subtle transition-colors hover:border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {copyState === "copied" ? (
              <Check className="h-4 w-4 text-highlight" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copyState === "copied" ? t.contact.copied : t.contact.copy}
          </button>
          {/* Región activa: quien usa lector de pantalla también recibe la
              confirmación de que se copió. */}
        </div>
        <p aria-live="polite" className="mt-3 mb-8 min-h-5 text-sm text-body">
          {copyState === "failed" ? t.contact.copyFailed : copyState === "copied" ? t.contact.copied : ""}
        </p>

        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {t.contact.orFind}
          </p>
          <SocialLinks size="lg" newTabHint={t.nav.newTab} />
        </div>
      </Reveal>
    </section>
  )
}
