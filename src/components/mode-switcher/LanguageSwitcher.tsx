"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { useLanguageStore } from "@/store/useLanguageStore"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguageStore()

  return (
    <div className="fixed top-6 left-6 z-[100] flex items-center bg-zinc-900/80 backdrop-blur-md rounded-full p-1 border border-zinc-700/50 shadow-2xl">
      <button
        onClick={() => language !== 'es' && toggleLanguage()}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer",
          language === 'es' ? "text-zinc-900" : "text-zinc-400 hover:text-white"
        )}
      >
        {language === 'es' && (
          <motion.div
            layoutId="lang-switcher-bg"
            className="absolute inset-0 bg-white rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="z-10">ES</span>
      </button>

      <button
        onClick={() => language !== 'en' && toggleLanguage()}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer",
          language === 'en' ? "text-zinc-900" : "text-zinc-400 hover:text-white"
        )}
      >
        {language === 'en' && (
          <motion.div
            layoutId="lang-switcher-bg"
            className="absolute inset-0 bg-white rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="z-10">EN</span>
      </button>
      
      <div className="px-3 border-l border-zinc-700/50">
        <Globe className="w-4 h-4 text-zinc-500" />
      </div>
    </div>
  )
}
