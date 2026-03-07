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
        onClick={() => isDeveloperMode && toggleMode()}
        className={cn(
          "relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
          !isDeveloperMode ? "text-zinc-900" : "text-zinc-400 hover:text-white"
        )}
      >
        {!isDeveloperMode && (
          <motion.div
            layoutId="mode-switcher-bg"
            className="absolute inset-0 bg-white rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Briefcase className="w-4 h-4 z-10" />
        <span className="z-10">{t.mode.recruiter}</span>
      </button>

      <button
        onClick={() => !isDeveloperMode && toggleMode()}
        className={cn(
          "relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
          isDeveloperMode ? "text-green-400" : "text-zinc-400 hover:text-white"
        )}
      >
        {isDeveloperMode && (
          <motion.div
            layoutId="mode-switcher-bg"
            className="absolute inset-0 bg-green-950/80 rounded-full border border-green-500/50"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Terminal className="w-4 h-4 z-10" />
        <span className="z-10">{t.mode.developer}</span>
      </button>
    </div>
  )
}
