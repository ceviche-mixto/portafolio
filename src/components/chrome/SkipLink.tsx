"use client"

import { useTranslation } from "@/hooks/useTranslation"

/**
 * Primer elemento enfocable de la página. Invisible hasta recibir foco, momento
 * en el que salta a la vista, que es exactamente lo que pide WCAG 2.4.1.
 *
 * Sin esto, navegar con teclado obliga a tabular por la barra completa en cada
 * carga antes de llegar al contenido.
 */
export function SkipLink() {
  const { t } = useTranslation()

  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-action-foreground focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-background"
    >
      {t.nav.skipToContent}
    </a>
  )
}
