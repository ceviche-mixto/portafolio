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
        onClick={toggleLanguage}
        className="relative flex items-center justify-center min-w-[60px] gap-2 px-4 py-2 rounded-full text-sm font-bold transition-transform active:scale-95 bg-white text-zinc-900 shadow-md cursor-pointer"
      >
        <span className="z-10">{language === 'es' ? 'ES' : 'EN'}</span>
      </button>
      
      <div className="px-3 border-l border-zinc-700/50">
        <Globe className="w-4 h-4 text-zinc-500" />
      </div>
    </div>
  )
}
