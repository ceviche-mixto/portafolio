"use client"

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react"
import { Check, Inbox, Rows3, Bell } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

const subscribe = () => () => {}
const clientReady = () => true
const serverReady = () => false

/** Local demonstration only: no backend, persistence or real notifications. */
export function AutomationDemo() {
  const { t } = useTranslation()
  const copy = t.automation
  const interactive = useSyncExternalStore(subscribe, clientReady, serverReady)
  const [message, setMessage] = useState("")
  const [record, setRecord] = useState("")
  const [step, setStep] = useState(0)
  const running = step > 0 && step < 3
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setStep((current) => current + 1), 500)
    return () => clearTimeout(timer)
  }, [step, running])
  function run(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (running) return
    setRecord(message.trim().slice(0, 280) || copy.example)
    setStep(1)
  }
  function reset() { setStep(0); setRecord(""); setMessage("") }
  const stages = [
    { Icon: Inbox, title: copy.receive, description: copy.receiveDesc },
    { Icon: Rows3, title: copy.register, description: copy.registerDesc },
    { Icon: Bell, title: copy.notify, description: copy.notifyDesc },
  ]
  return (
    <section aria-labelledby="automation-title" className="mt-20 border-t border-border pt-12">
      <div className="mb-8 max-w-2xl">
        <p className="mb-3 text-sm font-semibold text-highlight">{copy.label}</p>
        <h3 id="automation-title" className="mb-4 text-2xl font-bold text-foreground md:text-3xl">{copy.title}</h3>
        <p className="leading-relaxed text-body">{copy.description}</p>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={run}>
          <label htmlFor="demo-message" className="mb-3 block text-sm font-medium text-foreground">{copy.inputLabel}</label>
          <textarea id="demo-message" value={message} maxLength={280} rows={4} disabled={!interactive || running}
            placeholder={copy.example} aria-describedby="demo-privacy"
            onChange={(event) => { setMessage(event.target.value); setStep(0) }}
            className="w-full resize-y rounded-xl border border-strong bg-card p-4 text-base text-foreground placeholder:text-muted-foreground disabled:opacity-70" />
          <p id="demo-privacy" className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.privacy}</p>
          <noscript><p className="mt-3 text-sm text-body">{copy.requiresJs}</p></noscript>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={!interactive || running} className="min-h-11 rounded-full bg-action px-5 py-3 text-sm font-bold text-action-foreground transition-colors hover:bg-foreground disabled:cursor-wait disabled:opacity-70">{running ? copy.running : copy.run}</button>
            <button type="button" disabled={!interactive} onClick={reset} className="min-h-11 rounded-full border border-border px-5 py-3 text-sm font-medium text-subtle transition-colors hover:border-strong hover:text-foreground">{copy.reset}</button>
          </div>
        </form>
        <div>
          <ol className="space-y-5">
            {stages.map(({ Icon, title, description }, index) => (
              <li key={title} className="flex gap-4">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step > index ? "bg-highlight/15 text-highlight" : "bg-surface-raised text-muted-foreground"}`} aria-hidden="true">
                  {step > index ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </span>
                <div><p className="font-semibold text-foreground">{title}</p><p className="mt-1 text-sm leading-relaxed text-body">{description}</p></div>
              </li>
            ))}
          </ol>
          <div className="mt-6 min-h-28 rounded-xl bg-card p-4 text-sm">
            <p role="status" className="font-medium text-highlight">{step === 3 ? copy.done : step > 0 ? copy.running : copy.waiting}</p>
            {record && <p className="mt-3 break-words leading-relaxed text-body">{step >= 2 ? "DEMO-001 · " : ""}{record}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
