import { SiteNav } from "./SiteNav"
import { SkipLink } from "./SkipLink"
import { LanguageSwitcher } from "@/components/mode-switcher/LanguageSwitcher"
import { MotionSwitcher } from "@/components/mode-switcher/MotionSwitcher"
import { translations } from "@/lib/i18n"
import { HOME_PATH, type Language } from "@/lib/language"
import { NAV_SECTIONS } from "@/lib/site"

/**
 * Todo lo que flota por encima de la página. Se renderiza en el servidor; sólo
 * la barra (scroll-spy), el idioma y el control de movimiento hidratan, y
 * reciben ya resueltas las cadenas que muestran.
 *
 * Las anclas apuntan a la portada del idioma, así que también funcionan desde
 * la página de un caso.
 */
export function SiteChrome({ lang }: { lang: Language }) {
  const t = translations[lang]
  const home = HOME_PATH[lang]
  return (
    <>
      <SkipLink label={t.nav.skipToContent} />
      <SiteNav
        home={home}
        menuLabel={t.nav.menu}
        sections={NAV_SECTIONS.map((section) => ({
          id: section.id,
          href: `${home}#${section.id}`,
          label: section[lang],
        }))}
        controls={
          <>
            <LanguageSwitcher lang={lang} label={t.lang.switchLabel} name={t.lang.switchName} />
            <MotionSwitcher labels={t.motion} />
          </>
        }
      />
    </>
  )
}
