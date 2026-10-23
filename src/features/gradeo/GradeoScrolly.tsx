"use client"

import * as React from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
} from "framer-motion"
import { Fingerprint, ShieldCheck, BarChart3, MousePointer2 } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { useScrollLayer, GRADEO_LAYER_THRESHOLDS } from "@/hooks/useScrollLayer"

/**
 * Secuencia que explica el ciclo de vida de una reseña.
 *
 * Tres cosas cambiaron respecto a la versión anterior:
 *
 * 1. Los iconos ilustran su paso. Antes el paso «Edge Payload Routing» mostraba
 *    una estrella y «Data Aggregation» un candado (ver U-09).
 * 2. Los cuatro pasos existen también como lista para lectores de pantalla, así
 *    que el contenido no depende de poder hacer scroll (ver A-07).
 * 3. La capa se calcula por umbral, no guardando el progreso crudo en estado
 *    (ver P-03, en `useScrollLayer`).
 */
export function GradeoScrolly() {
  const { t } = useTranslation()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"],
  })
  const layer = useScrollLayer(scrollYProgress, GRADEO_LAYER_THRESHOLDS)

  const steps = [
    { title: t.scrolly.step1Title, desc: t.scrolly.step1Desc },
    { title: t.scrolly.step2Title, desc: t.scrolly.step2Desc },
    { title: t.scrolly.step3Title, desc: t.scrolly.step3Desc },
    { title: t.scrolly.step4Title, desc: t.scrolly.step4Desc },
  ]

  const heading = layer === 0 ? t.gradeo.lifecycleTitle : steps[layer - 1].title
  const body = layer === 0 ? t.scrolly.instruction : steps[layer - 1].desc

  return (
    <>
      <div
        ref={containerRef}
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <div className="grid h-full grid-cols-1 gap-12 md:grid-cols-2">
          <div className="relative hidden h-full border-l border-soft/50 pl-8 md:block">
            <div className="sticky top-32 flex flex-col pt-8">
              {/* La lista estática equivalente permanece accesible en GradeoLifecycle. */}
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={layer}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="mb-6 text-3xl font-bold text-foreground">{heading}</h3>
                    <p className="text-balance text-lg text-body">{body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {layer < 4 && (
                <p className="mt-12 flex items-center gap-3 text-muted-foreground">
                  <MousePointer2 className="h-5 w-5 text-highlight" />
                  <span className="text-sm font-medium tracking-widest uppercase">
                    {t.gradeo.scrollIndicator}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="relative h-full">
            <ScrollyStage layer={layer} prefersReducedMotion={!!prefersReducedMotion} />
          </div>
        </div>
      </div>
    </>
  )
}

function ScrollyStage({
  layer,
  prefersReducedMotion,
}: {
  layer: number
  prefersReducedMotion: boolean
}) {
  const { t } = useTranslation()

  const enter = prefersReducedMotion
    ? { initial: undefined, animate: { opacity: 1 }, exit: undefined }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      }

  const captions = [
    t.gradeo.lifecycleTitle,
    t.scrolly.step1Title,
    t.scrolly.step2Title,
    t.scrolly.step3Title,
    t.scrolly.step4Title,
  ]

  return (
    <div className="sticky top-24 flex h-[70vh] w-full items-center justify-center overflow-hidden rounded-2xl border border-soft bg-background p-4 shadow-2xl md:top-32 md:h-[60vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={layer}
          {...enter}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center"
        >
          {layer === 0 && <StageIntro prefersReducedMotion={prefersReducedMotion} />}
          {layer === 1 && <StageForm />}
          {layer === 2 && <StageHash />}
          {layer === 3 && <StageQueue />}
          {layer === 4 && <StageAggregate />}

          <p className="mt-6 font-mono text-sm font-medium text-body">
            {captions[layer]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ── Escenas ─────────────────────────────────────────────────────────────── */

function StageIntro({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <div className="flex h-36 w-24 items-start justify-center overflow-hidden rounded-full border-2 border-border bg-card p-4 shadow-2xl">
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, 24, 0] }}
        transition={{ repeat: 2, duration: 1.5, ease: "easeInOut" }}
        className="h-12 w-8 rounded-full bg-highlight shadow-[0_0_15px_rgba(16,185,129,0.5)]"
      />
    </div>
  )
}

/** Paso 1: el formulario con cuatro ejes de 1 a 5. */
function StageForm() {
  return (
    <div className="flex w-60 flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 shadow-2xl">
      {[4, 5, 3, 5].map((filled, row) => (
        <div key={row} className="flex items-center gap-2">
          <div className="h-2 w-12 rounded bg-border" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={
                  "h-2.5 w-2.5 rounded-sm " +
                  (n <= filled ? "bg-warning" : "bg-border")
                }
              />
            ))}
          </div>
        </div>
      ))}
      <div className="mt-1 h-10 rounded bg-surface-raised" />
    </div>
  )
}

/** Paso 2: la IP se convierte en hash. Reemplaza la estrella incoherente. */
function StageHash() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Fingerprint className="h-16 w-16 text-highlight" />
      <div className="flex items-center gap-2 font-mono text-[11px]">
        <span className="rounded border border-border bg-card px-2 py-1 text-muted-foreground line-through">
          190.43.xx.xx
        </span>
        <span className="text-highlight">→</span>
        <span className="rounded border border-highlight/30 bg-highlight/10 px-2 py-1 text-highlight">
          a3f9c1…
        </span>
      </div>
    </div>
  )
}

/** Paso 3: la cola de moderación. */
function StageQueue() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ShieldCheck className="h-14 w-14 text-highlight" />
      <ul className="flex w-56 flex-col gap-2">
        {[
          { label: "approved", tone: "border-highlight/40 text-highlight" },
          { label: "pending", tone: "border-warning/40 text-warning" },
          { label: "pending", tone: "border-warning/40 text-warning" },
          { label: "rejected", tone: "border-danger/40 text-danger" },
        ].map((row, i) => (
          <li
            key={i}
            className={`flex items-center justify-between rounded border bg-card/80 px-2.5 py-1.5 font-mono text-[10px] ${row.tone}`}
          >
            <span className="h-1.5 w-16 rounded bg-border" />
            {row.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Paso 4: las cuatro medias recalculándose. Reemplaza el candado incoherente. */
function StageAggregate() {
  const axes = [
    { label: "personality", value: 82 },
    { label: "methodology", value: 64 },
    { label: "clarity", value: 91 },
    { label: "fairness", value: 73 },
  ]
  return (
    <div className="flex flex-col items-center gap-4">
      <BarChart3 className="h-12 w-12 text-highlight" />
      <div className="flex w-56 flex-col gap-2">
        {axes.map((axis, i) => (
          <div key={axis.label} className="flex items-center gap-2">
            <span className="w-20 text-left font-mono text-[9px] text-muted-foreground">
              {axis.label}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-highlight to-accent-secondary"
                style={{ transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: axis.value / 100 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
