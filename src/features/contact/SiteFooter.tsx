"use client"

import * as React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { IDENTITY } from "@/lib/site"

export function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className="w-full border-t border-zinc-900 bg-black py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6 text-center">
        <p className="text-sm font-medium text-zinc-400">
          {IDENTITY.name} © {new Date().getFullYear()}. {t.contact.rights}
        </p>
        <p className="font-mono text-xs text-zinc-400">{t.contact.builtWith}</p>
      </div>
    </footer>
  )
}
