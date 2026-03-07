"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useModeStore } from '@/store/useModeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { Terminal as TerminalIcon, Activity, CheckCircle2, Minimize2, Maximize2 } from 'lucide-react'

function TypewriterText({ text, delay = 0, className }: { text: string, delay?: number, className?: string }) {
  const [content, setContent] = useState('')
  useEffect(() => {
    let timeout: NodeJS.Timeout
    let interval: NodeJS.Timeout
    
    timeout = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        setContent(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, 10)
    }, delay)
    
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, delay])
  
  return <span className={className}>{content}</span>
}

export function DeveloperOverlay() {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t } = useTranslation()
  const [fps, setFps] = useState(60)
  const [memory, setMemory] = useState(45)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)

  useEffect(() => {
    if (!isDeveloperMode) return
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 4)) // fluctuates between 58 and 61
      setMemory(Math.floor(40 + Math.random() * 15))
    }, 1000)
    return () => clearInterval(interval)
  }, [isDeveloperMode])

  return (
    <AnimatePresence>
      {isDeveloperMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[90]"
        >
          {/* Scanlines Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 select-none" />

          {/* Performance HUD (Top Left, shifted down) */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-20 left-6 flex flex-col gap-2 font-mono text-xs"
          >
            <div className="bg-black/80 text-green-400 border border-green-500/30 p-3 rounded-lg backdrop-blur-md shadow-2xl flex flex-col gap-2 pointer-events-auto">
              <div className="flex items-center gap-2 border-b border-green-500/30 pb-2 mb-1">
                <Activity className="w-4 h-4" />
                <span className="font-bold tracking-widest text-green-300">{t.devConsole.monitor}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-zinc-500">FPS</span>
                <span className={fps >= 60 ? "text-green-400" : "text-yellow-400"}>{fps}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-zinc-500">{t.devConsole.memory}</span>
                <span>{memory} MB</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-zinc-500">REACT RENDER</span>
                <span>{Math.floor(Math.random() * 3) + 1}ms</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-zinc-500">{t.devConsole.network}</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500"/> IDLE</span>
              </div>
            </div>
          </motion.div>

          {/* Mini Terminal (Bottom Left) */}
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 pointer-events-auto">
            <AnimatePresence mode="wait">
              {!isTerminalOpen ? (
                <motion.button
                  key="btn"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => setIsTerminalOpen(true)}
                  className="w-12 h-12 bg-black/80 backdrop-blur-md border border-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-2xl relative group"
                >
                  <div className="absolute -inset-1 bg-green-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <TerminalIcon className="w-5 h-5 text-green-400 relative z-10" />
                </motion.button>
              ) : (
                <motion.div 
                  key="terminal"
                  initial={{ y: 50, opacity: 0, scale: 0.9, originY: 1, originX: 0 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 50, opacity: 0, scale: 0.9 }}
                  className="w-[85vw] md:w-[28rem] max-w-[400px] md:max-w-none bg-black/80 backdrop-blur-md border border-zinc-800 rounded-lg overflow-hidden shadow-2xl"
                >
                  <div className="bg-zinc-900 border-b border-zinc-800 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TerminalIcon className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs text-zinc-400 font-mono">portfolio@gian:~/gradeo</span>
                    </div>
                    <button onClick={() => setIsTerminalOpen(false)} className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-800 rounded transition-colors">
                      <Minimize2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 font-mono text-xs text-zinc-300 h-56 overflow-y-auto flex flex-col gap-1 items-start">
                    <TypewriterText text={t.devConsole.loading} className="text-green-400" delay={0} />
                    <TypewriterText text="$ pnpm run dev" className="text-zinc-500" delay={500} />
                    <TypewriterText text={t.devConsole.ready} delay={800} />
                    <TypewriterText text="$ whoami" className="text-zinc-500 mt-2" delay={1200} />
                    <TypewriterText text={t.devConsole.whoamiText1} className="text-blue-400" delay={1500} />
                    <TypewriterText text={t.devConsole.whoamiText2} className="text-zinc-400" delay={2000} />
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="flex items-center gap-2 mt-4">
                      <span className="text-green-500">portfolio@gian:~/gradeo$ </span>
                      <span className="animate-pulse w-2 h-4 bg-zinc-400" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
