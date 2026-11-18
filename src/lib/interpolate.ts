/**
 * Sustituye marcadores `{clave}` en una cadena de traducción.
 *
 * Las cifras no se escriben a mano en el diccionario: `{professors}` se rellena
 * con el recuento fechado o vivo que corresponda a cada página.
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}
