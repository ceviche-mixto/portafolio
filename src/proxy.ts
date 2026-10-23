import { NextResponse, type NextRequest } from "next/server"
import { contentSecurityPolicy } from "@/lib/security"

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")
  const policy = contentSecurityPolicy(nonce, process.env.NODE_ENV === "development")
  const headers = new Headers(request.headers)
  headers.set("x-nonce", nonce)
  headers.set("Content-Security-Policy", policy)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set("Content-Security-Policy", policy)
  return response
}

export const config = {
  matcher: ["/((?!api/|_next/|cv/|images/|favicon.ico|robots.txt|sitemap.xml|opengraph-image).*)"],
}
