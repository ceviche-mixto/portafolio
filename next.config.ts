import type { NextConfig } from "next"

/**
 * Cabeceras de seguridad aplicadas a todas las rutas.
 *
 * No hay CSP aquí a propósito: Next inyecta estilos y scripts en línea, así que
 * una CSP correcta necesita nonces por petición y es mejor añadirla desde
 * middleware que dejarla mal puesta y en modo permisivo.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Los PDF del CV cambian rara vez y se piden desde un botón: merece la
        // pena que el navegador los conserve.
        source: "/cv/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }],
      },
    ]
  },
}

export default nextConfig
