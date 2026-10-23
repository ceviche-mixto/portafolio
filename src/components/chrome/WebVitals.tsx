"use client"

import { useReportWebVitals } from "next/web-vitals"
import { create } from "zustand"

type VitalName = "LCP" | "CLS" | "INP" | "TTFB" | "FCP"
type Vital = { value: number; rating: string }
export const useWebVitals = create<{ metrics: Partial<Record<VitalName, Vital>> }>(() => ({ metrics: {} }))

function report(metric: { name: string; value: number; rating: string }) {
  if (!["LCP", "CLS", "INP", "TTFB", "FCP"].includes(metric.name)) return
  const name = metric.name as VitalName
  useWebVitals.setState((state) => ({ metrics: { ...state.metrics, [name]: { value: metric.value, rating: metric.rating } } }))
}

/** This visit only. No analytics endpoint, cookies or telemetry transmission. */
export function WebVitals() {
  useReportWebVitals(report)
  return null
}
