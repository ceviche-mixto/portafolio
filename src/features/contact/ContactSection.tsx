import { Mail } from "lucide-react"
import { SocialLinks } from "@/components/chrome/SocialLinks"
import { SplitText } from "@/components/motion/SplitText"
import { CopyEmailButton } from "@/components/ui/CopyEmailButton"
import { buttonVariants } from "@/components/ui/button-variants"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { IDENTITY } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Sección de contacto.
 *
 * El correo se muestra en claro además de enlazarse: mucha gente prefiere
 * copiarlo a que se le abra un cliente de correo.
 */
export function ContactSection({ lang }: { lang: Language }) {
  const t = translations[lang]

  return (
    <section id="contacto" className="relative z-10 border-t border-soft bg-background pt-24 pb-24">
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          <SplitText text={t.contact.sectionTitle} />
        </h2>
        <p className="mb-3 max-w-xl text-balance text-lg text-body">{t.contact.sectionSubtitle}</p>
        <p className="mb-8 font-mono text-sm text-muted-foreground">{t.hero.availability}</p>

        <div className="mb-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <a
            href={`mailto:${IDENTITY.email}`}
            className={cn(buttonVariants(), "min-w-0 flex-1 whitespace-normal")}
          >
            <Mail aria-hidden="true" />
            <span className="min-w-0 [overflow-wrap:anywhere]">{IDENTITY.email}</span>
          </a>
          <CopyEmailButton email={IDENTITY.email} labels={{ idle: t.contact.copy, copied: t.contact.copied, failed: t.contact.copyFailed, pill: t.contact.copiedPill }} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{t.contact.orFind}</p>
          <SocialLinks size="lg" newTabHint={t.nav.newTab} />
        </div>
      </div>
    </section>
  )
}
