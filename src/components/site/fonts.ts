import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

// Etiquetas, código y el HUD del hero (texto centrado sobre el pliegue): se
// precarga para que el cambio de fuente no desplace nada. El hero ya no tiene
// imagen LCP con la que competir.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

/**
 * Clases que declaran las variables de fuente. Van en `<html>`, no en `<body>`:
 * `globals.css` aplica `font-sans` al elemento html, y una variable declarada
 * en body todavía no existe ahí.
 */
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`
