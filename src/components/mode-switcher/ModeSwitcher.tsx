"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Terminal, Briefcase } from "lucide-react"
import { useModeStore } from "@/store/useModeStore"
import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/lib/utils"

export function ModeSwitcher() {
  const { isDeveloperMode, toggleMode } = useModeStore()
  const { t } = useTranslation()

  return (
    <div className="fixed top-6 right-6 z-[100] flex items-center bg-zinc-900/80 backdrop-blur-md rounded-full p-1 border border-zinc-700/50 shadow-2xl">
      <button
        onClick={toggleMode}
        className={cn(
          "relative flex items-center gap-2 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-transform active:scale-95 shadow-md cursor-pointer",
          isDeveloperMode 
            ? "bg-green-950/80 border border-green-500/50 text-green-400" 
            : "bg-white text-zinc-900 border border-transparent"
        )}
      >
        {isDeveloperMode ? <Terminal className="w-4 h-4 z-10" /> : <Briefcase className="w-4 h-4 z-10" />}
        <span className="z-10">{isDeveloperMode ? t.mode.developer : t.mode.recruiter}</span>
      </button>
    </div>
  )
}
