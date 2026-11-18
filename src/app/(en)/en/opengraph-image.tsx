import { homeOgImage } from "@/lib/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Giancarlo Larios — I build web systems and SaaS platforms end to end"

export default function OpenGraphImage() {
  return homeOgImage("en", size)
}
