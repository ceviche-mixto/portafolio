import { HomePage } from "@/components/site/HomePage"
import { homeMetadata } from "@/lib/metadata"

export const metadata = homeMetadata("es")

export default function Home() {
  return <HomePage lang="es" />
}
