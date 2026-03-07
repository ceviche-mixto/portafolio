"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { ShieldAlert, Fingerprint, TrendingUp, X } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function GradeoCaseStudy() {
  const { t } = useTranslation()
  return (
    <Dialog>
      <DialogTrigger className="mt-8 px-6 py-3 bg-zinc-100 text-zinc-900 rounded-full font-bold hover:bg-zinc-200 transition-colors shadow-xl text-sm md:text-base">
        {t.gradeo.caseStudyBtn}
      </DialogTrigger>
      <DialogContent className="w-[95vw] md:max-w-2xl max-h-[85vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-zinc-100 p-6 md:p-8 rounded-[2rem]">
        <DialogHeader className="pr-12">
          <DialogTitle className="text-xl md:text-2xl font-black mb-2">{t.caseStudy.title}</DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm md:text-base">
            {t.caseStudy.desc}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="mt-1"><ShieldAlert className="w-6 h-6 text-red-400" /></div>
            <div>
              <h4 className="font-bold text-lg mb-1 text-white">{t.caseStudy.challengeTitle}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{t.caseStudy.challengeText}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1"><Fingerprint className="w-6 h-6 text-emerald-400" /></div>
            <div>
              <h4 className="font-bold text-lg mb-1 text-white">{t.caseStudy.solutionTitle}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{t.caseStudy.solutionText}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1"><TrendingUp className="w-6 h-6 text-blue-400" /></div>
            <div>
              <h4 className="font-bold text-lg mb-1 text-white">{t.caseStudy.resultTitle}</h4>
              <p 
                className="text-zinc-400 text-sm leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: t.caseStudy.resultText }} 
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
