"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useModeStore } from "@/store/useModeStore"
import { useTranslation } from "@/hooks/useTranslation"
import { useRealMetrics } from "@/hooks/useRealMetrics"
import { Terminal as TerminalIcon, Activity, CheckCircle2, Minimize2 } from "lucide-react"

function TypewriterText({
  text,
  delay = 0,
  className,
  instant,
}: {
  text: string
  delay?: number
  className?: string
  /** Con movimiento reducido el texto aparece completo, sin animar. */
  instant?: boolean
}) {
  const [content, setContent] = React.useState(instant ? text : "")

  React.useEffect(() => {
    if (instant) {
      setContent(text)
      return
    }

    let interval: ReturnType<typeof setInterval> | undefined
    const timeout = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        setContent(text.slice(0, i + 1))
        i++
        if (i >= text.length && interval) clearInterval(interval)
      }, 10)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [text, delay, instant])

  return <span className={className}>{content}</span>
}

/** Fila del HUD. `value` ya viene formateado, o es «n/d» si no se pudo medir. */
function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-8">
      <span className="text-zinc-400">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

export function DeveloperOverlay() {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()
  const [isTerminalOpen, setIsTerminalOpen] = React.useState(false)

  // Sólo se mide mientras el modo está activo: en reposo no hay bucle de rAF.
  const { fps, frameMs, heapMb } = useRealMetrics(isDeveloperMode)

  const na = t.devConsole.unavailable

  return (
    <AnimatePresence>
      {isDeveloperMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[90]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 select-none" />

          {/* HUD de rendimiento. Los tres valores son medidos; ver useRealMetrics. */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-20 left-4 font-mono text-xs md:left-6"
          >
            <div className="pointer-events-auto flex flex-col gap-2 rounded-lg border border-green-500/30 bg-black/80 p-3 text-green-400 shadow-2xl backdrop-blur-md">
              <div className="mb-1 flex items-center gap-2 border-b border-green-500/30 pb-2">
                <Activity className="h-4 w-4" aria-hidden="true" />
                <span className="font-bold tracking-widest text-green-300">
                  {t.devConsole.monitor}
                </span>
                {/* Etiqueta explícita: estos números se miden, no se simulan. */}
                <span className="ml-auto rounded bg-green-500/10 px-1.5 text-[9px] tracking-wider text-green-300 uppercase">
                  {t.devConsole.measured}
                </span>
              </div>
              <MetricRow label="FPS" value={fps === null ? na : String(fps)} />
              <MetricRow
                label={t.devConsole.renderLabel}
                value={frameMs === null ? na : `${frameMs} ms`}
              />
              <MetricRow
                label={t.devConsole.memory}
                value={heapMb === null ? na : `${heapMb} MB`}
              />
              <div className="flex justify-between gap-8">
                <span className="text-zinc-400">{t.devConsole.network}</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" aria-hidden="true" />
                  IDLE
                </span>
              </div>
            </div>
          </motion.div>

          <div className="pointer-events-auto absolute bottom-4 left-4 md:bottom-6 md:left-6">
            <AnimatePresence mode="wait">
              {!isTerminalOpen ? (
                <motion.button
                  key="btn"
                  type="button"
                  initial={prefersReducedMotion ? undefined : { scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={prefersReducedMotion ? undefined : { scale: 0 }}
                  onClick={() => setIsTerminalOpen(true)}
                  aria-label={t.devConsole.openTerminal}
                  className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-black/80 shadow-2xl backdrop-blur-md transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                >
                  <TerminalIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </motion.button>
              ) : (
                <motion.div
                  key="terminal"
                  initial={prefersReducedMotion ? undefined : { y: 50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? undefined : { y: 50, opacity: 0, scale: 0.9 }}
                  className="w-[85vw] max-w-[400px] overflow-hidden rounded-lg border border-zinc-800 bg-black/85 shadow-2xl backdrop-blur-md md:w-[28rem] md:max-w-none"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 p-2">
                    <div className="flex items-center gap-2">
                      <TerminalIcon className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                      <span className="font-mono text-xs text-zinc-300">
                        portfolio@gian:~/gradeo
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTerminalOpen(false)}
                      aria-label={t.devConsole.closeTerminal}
                      className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                    >
                      <Minimize2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex h-56 flex-col items-start gap-1 overflow-y-auto p-4 font-mono text-xs text-zinc-300">
                    <TypewriterText
                      text={t.devConsole.loading}
                      className="text-green-400"
                      instant={!!prefersReducedMotion}
                    />
                    <TypewriterText
                      text="$ npm run dev"
                      className="text-zinc-400"
                      delay={500}
                      instant={!!prefersReducedMotion}
                    />
                    <TypewriterText
                      text={t.devConsole.ready}
                      delay={800}
                      instant={!!prefersReducedMotion}
                    />
                    <TypewriterText
                      text="$ whoami"
                      className="mt-2 text-zinc-400"
                      delay={1200}
                      instant={!!prefersReducedMotion}
                    />
                    <TypewriterText
                      text={t.devConsole.whoamiText1}
                      className="text-blue-300"
                      delay={1500}
                      instant={!!prefersReducedMotion}
                    />
                    <TypewriterText
                      text={t.devConsole.whoamiText2}
                      className="text-zinc-300"
                      delay={2000}
                      instant={!!prefersReducedMotion}
                    />
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
