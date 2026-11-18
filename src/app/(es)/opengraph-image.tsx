import { homeOgImage } from "@/lib/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Giancarlo Larios — Construyo sistemas web y plataformas SaaS de punta a punta"

export default function OpenGraphImage() {
  return homeOgImage("es", size)
}
