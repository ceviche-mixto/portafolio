/**
 * Política CSP estática, válida para páginas prerenderizadas.
 *
 * Un nonce por petición obligaría a renderizar cada página por petición. Los
 * hashes SRI de Next sólo cubren los scripts externos, no los inline con los
 * datos de RSC, así que `script-src` admite inline pero sólo desde el propio
 * origen: ningún host externo puede servir scripts y `eval` sigue prohibido.
 */
export function contentSecurityPolicy(development = false): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${development ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
  ].join("; ")
}
