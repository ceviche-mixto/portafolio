import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { IDENTITY } from "@/lib/site"

export function SiteFooter({ lang }: { lang: Language }) {
  const t = translations[lang]

  return (
    <footer className="theme-ink w-full py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          {IDENTITY.name} © {new Date().getFullYear()}. {t.contact.rights}
        </p>
        <p className="font-mono text-xs text-muted-foreground">{t.contact.builtWith}</p>
      </div>
    </footer>
  )
}
