"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useModeStore } from "@/store/useModeStore"
import { useTranslation } from "@/hooks/useTranslation"
import { useRealMetrics } from "@/hooks/useRealMetrics"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { useWebVitals } from "@/components/chrome/WebVitals"
import { Terminal as TerminalIcon, Activity, ChevronDown, Minimize2 } from "lucide-react"

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
  const [frame, setFrame] = React.useState({ text, content: "" })

  React.useEffect(() => {
    if (instant) return

    let interval: ReturnType<typeof setInterval> | undefined
    const timeout = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        setFrame({ text, content: text.slice(0, i + 1) })
        i++
        if (i >= text.length && interval) clearInterval(interval)
      }, 10)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [text, delay, instant])

  return <span className={className}>{instant ? text : frame.text === text ? frame.content : ""}</span>
}

/** Fila del HUD. `value` ya viene formateado, o es «n/d» si no se pudo medir. */
function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-8">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

export function DeveloperOverlay() {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t } = useTranslation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isTerminalOpen, setIsTerminalOpen] = React.useState(false)

  // Sólo se mide mientras el modo está activo: en reposo no hay bucle de rAF.
  const { fps, frameMs, heapMb } = useRealMetrics(isDeveloperMode && !prefersReducedMotion)

  const na = t.devConsole.unavailable
  const vitals = useWebVitals((state) => state.metrics)

  return (
    <AnimatePresence>
      {isDeveloperMode && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="pointer-events-none fixed inset-0 z-[90]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 select-none" />

          {/* HUD de rendimiento. Los tres valores son medidos; ver useRealMetrics. */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0 : 0.3 }}
            className="absolute bottom-20 left-4 max-w-[calc(100vw-2rem)] font-mono text-xs md:bottom-24 md:left-6"
          >
            <details className="group pointer-events-auto rounded-lg border border-success/30 bg-surface-deep/90 text-success">
              <summary className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg p-3">
                <Activity className="h-4 w-4" aria-hidden="true" />
                <span className="font-bold tracking-widest text-success">
                  {t.devConsole.monitor}
                </span>
                {/* Etiqueta explícita: estos números se miden, no se simulan. */}
                <span className="ml-auto rounded bg-success/10 px-1.5 text-[9px] tracking-wider text-success uppercase">
                  {t.devConsole.measured}
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="flex flex-col gap-2 border-t border-success/30 p-3">
              {prefersReducedMotion && <p className="text-body">{t.devConsole.monitorPaused}</p>}
              <MetricRow label="FPS" value={fps === null ? na : String(fps)} />
              <MetricRow
                label={t.devConsole.renderLabel}
                value={frameMs === null ? na : `${frameMs} ms`}
              />
              <MetricRow
                label={t.devConsole.memory}
                value={heapMb === null ? na : `${heapMb} MB`}
              />
              <div className="mt-2 border-t border-success/30 pt-2">
                <p className="mb-2 text-body">{t.devConsole.visitMetrics}</p>
                {(["LCP", "CLS", "INP"] as const).map((name) => (
                  <MetricRow key={name} label={name}
                    value={vitals[name] ? `${vitals[name].value.toFixed(name === "CLS" ? 3 : 0)}${name === "CLS" ? "" : " ms"}` : t.devConsole.pending} />
                ))}
                <p className="mt-2 max-w-64 text-muted-foreground">{t.devConsole.vitalsNote}</p>
              </div>
              </div>
            </details>
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
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  onClick={() => setIsTerminalOpen(true)}
                  aria-label={t.devConsole.openTerminal}
                  className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-deep/80 shadow-2xl backdrop-blur-md transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
                >
                  <TerminalIcon className="h-5 w-5 text-success" aria-hidden="true" />
                </motion.button>
              ) : (
                <motion.div
                  key="terminal"
                  initial={prefersReducedMotion ? undefined : { y: 50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? undefined : { y: 50, opacity: 0, scale: 0.9 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  className="w-[85vw] max-w-[400px] overflow-hidden rounded-lg border border-soft bg-surface-deep/85 shadow-2xl backdrop-blur-md md:w-[28rem] md:max-w-none"
                >
                  <div className="flex items-center justify-between border-b border-soft bg-card p-2">
                    <div className="flex items-center gap-2">
                      <TerminalIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span className="font-mono text-xs text-body">
                        portfolio@gian:~/gradeo
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTerminalOpen(false)}
                      aria-label={t.devConsole.closeTerminal}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
                    >
                      <Minimize2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="border-b border-soft px-4 py-3 text-xs text-body">{t.devConsole.illustration}</p>
                  <div className="flex max-h-[min(14rem,40dvh)] flex-col items-start gap-1 overflow-y-auto p-4 font-mono text-xs text-body" aria-hidden="true">
                    <TypewriterText
                      text={t.devConsole.loading}
                      className="text-success"
                      instant={!!prefersReducedMotion}
                    />
                    <TypewriterText
                      text="$ npm run dev"
                      className="text-muted-foreground"
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
                      className="mt-2 text-muted-foreground"
                      delay={1200}
                      instant={!!prefersReducedMotion}
                    />
                    <TypewriterText
                      text={t.devConsole.whoamiText1}
                      className="text-info"
                      delay={1500}
                      instant={!!prefersReducedMotion}
                    />
                    <TypewriterText
                      text={t.devConsole.whoamiText2}
                      className="text-body"
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
