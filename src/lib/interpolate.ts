/**
 * Sustituye marcadores `{clave}` en una cadena de traducción.
 *
 * Existe para que las cifras del sitio no se escriban a mano en el diccionario.
 * Un «919» incrustado en la copia es correcto el día que se escribe y falso un
 * mes después; con `{professors}` el número sale del recuento real y, si la base
 * no responde, cae en un texto que sigue siendo cierto («más de 900»).
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}
