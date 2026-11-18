/**
 * Primer elemento enfocable de la página. Invisible hasta recibir foco, momento
 * en el que salta a la vista, como pide WCAG 2.4.1: con teclado no hace falta
 * recorrer la barra completa en cada carga.
 */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-background"
    >
      {label}
    </a>
  )
}
