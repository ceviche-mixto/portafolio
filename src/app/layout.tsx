import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/i18n/LanguageProvider"
import { SiteChrome } from "@/components/chrome/SiteChrome"
import { getLanguage } from "@/lib/language-server"
import { htmlLang } from "@/lib/language"
import { translations } from "@/lib/i18n"
import { IDENTITY, SITE_URL } from "@/lib/site"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

/**
 * Los metadatos se generan por idioma. Antes estaban fijos en inglés en un sitio
 * que abre en español, así que buscadores y previsualizaciones mostraban un
 * idioma distinto del que veía quien hacía clic (ver S-02).
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage()
  const title = `${IDENTITY.name} — ${lang === "es" ? IDENTITY.titleEs : IDENTITY.titleEn}`
  const description = translations[lang].hero.subtitle

  return {
    // Sin metadataBase las URLs de OG quedan relativas y ninguna red social las
    // resuelve, así que el enlace se comparte sin tarjeta (ver S-01).
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: `${IDENTITY.name} — Portafolio`,
    authors: [{ name: IDENTITY.fullName, url: SITE_URL }],
    creator: IDENTITY.fullName,
    keywords: [
      "Giancarlo Larios",
      "ingeniería de sistemas",
      "Next.js",
      "Postgres",
      "Supabase",
      "GRADEO",
      "FARMAPLUS",
      "Chiclayo",
      "Perú",
    ],
    alternates: {
      canonical: "/",
      languages: { "es-PE": "/", en: "/" },
    },
    openGraph: {
      type: "profile",
      title,
      description,
      url: SITE_URL,
      siteName: `${IDENTITY.name} — Portafolio`,
      locale: lang === "es" ? "es_PE" : "en_US",
      alternateLocale: lang === "es" ? "en_US" : "es_PE",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLanguage()

  // Las variables de fuente van en <html>, no en <body>: `globals.css` aplica
  // `font-sans` al elemento html, y ahí una variable declarada en body todavía no
  // existe. Con las clases en body, `var(--font-geist-sans)` resolvía a vacío y
  // todo el sitio caía en Times New Roman.
  return (
    <html
      lang={htmlLang(lang)}
      className={`dark scroll-smooth ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased bg-zinc-950 text-zinc-50 selection:bg-white/20">
        <LanguageProvider initialLanguage={lang}>
          <SiteChrome />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
