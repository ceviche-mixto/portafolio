import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

// Sólo etiquetas y código: no compite con la imagen LCP en la ruta crítica.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
})

/**
 * Clases que declaran las variables de fuente. Van en `<html>`, no en `<body>`:
 * `globals.css` aplica `font-sans` al elemento html, y una variable declarada
 * en body todavía no existe ahí.
 */
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`
