import { SiteNav } from "./SiteNav"
import { SkipLink } from "./SkipLink"
import { LanguageSwitcher } from "@/components/mode-switcher/LanguageSwitcher"
import { MotionSwitcher } from "@/components/mode-switcher/MotionSwitcher"
import { translations } from "@/lib/i18n"
import type { Language } from "@/lib/language"
import { NAV_SECTIONS } from "@/lib/site"

/**
 * Todo lo que flota por encima de la página. Se renderiza en el servidor; sólo
 * la barra (scroll-spy) y el control de movimiento hidratan, y reciben ya
 * resueltas las cadenas que muestran.
 */
export function SiteChrome({ lang }: { lang: Language }) {
  const t = translations[lang]
  return (
    <>
      <SkipLink label={t.nav.skipToContent} />
      <SiteNav
        menuLabel={t.nav.menu}
        sections={NAV_SECTIONS.map((section) => ({ id: section.id, label: section[lang] }))}
        controls={
          <>
            <LanguageSwitcher lang={lang} />
            <MotionSwitcher labels={t.motion} />
          </>
        }
      />
    </>
  )
}
