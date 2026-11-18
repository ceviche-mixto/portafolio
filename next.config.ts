import type { NextConfig } from "next"
import { contentSecurityPolicy } from "./src/lib/security"

/** Cabeceras de seguridad aplicadas a todas las rutas. */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy(process.env.NODE_ENV === "development"),
  },
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

  experimental: {
    // Hay un root layout por idioma; la 404 global no puede heredar ninguno.
    globalNotFound: true,
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      ...(["es", "en"] as const).map((language) => ({
        source: `/cv/giancarlo-larios-cv-${language}.pdf`,
        headers: [
          // Las URLs son estables: revalidar evita conservar un CV anticuado.
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Content-Disposition", value: `inline; filename="Giancarlo-Larios-CV-${language.toUpperCase()}.pdf"` },
        ],
      })),
    ]
  },
}

export default nextConfig
