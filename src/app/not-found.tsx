import Link from "next/link"

/**
 * 404 con la identidad del sitio. Antes se mostraba la pantalla genérica de Next.
 * Sin traducciones porque es un Server Component sin acceso al proveedor de
 * idioma; el mensaje se da en los dos idiomas.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-6 text-center">
      <p className="font-mono text-6xl font-black text-zinc-700">404</p>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">Esta página no existe</h1>
        <p className="text-zinc-400" lang="en">
          This page does not exist.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        Volver al inicio · Back home
      </Link>
    </main>
  )
}
