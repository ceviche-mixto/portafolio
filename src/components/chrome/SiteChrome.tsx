import { SiteNav } from "./SiteNav"
import { SkipLink } from "./SkipLink"
import { LanguageSwitcher } from "@/components/mode-switcher/LanguageSwitcher"
import { MotionPauseToggle } from "@/components/motion/MotionPauseToggle"
import { translations } from "@/lib/i18n"
import { HOME_PATH, type Language } from "@/lib/language"
import { NAV_SECTIONS } from "@/lib/site"

/**
 * Todo lo que flota por encima de la página. Se renderiza en el servidor; sólo
 * la barra (scroll-spy) y el idioma hidratan, y reciben ya resueltas las
 * cadenas que muestran. El movimiento sigue `prefers-reduced-motion` del
 * sistema; lo único que se mueve solo más de 5 s (el fondo global y la escena
 * del logo en el hero) comparte un botón de pausa, aquí en la cabecera.
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
            <MotionPauseToggle home={home} label={t.hero.pause} />
            <LanguageSwitcher lang={lang} label={t.lang.switchLabel} name={t.lang.switchName} />
          </>
        }
      />
    </>
  )
}
