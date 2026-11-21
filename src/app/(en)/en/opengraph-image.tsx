import { homeOgImage } from "@/lib/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Giancarlo Larios — I build software that ships to production"

export default function OpenGraphImage() {
  return homeOgImage("en", size)
}
