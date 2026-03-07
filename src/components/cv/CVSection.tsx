"use client"

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { FileText, Cpu, Wrench, GraduationCap, Briefcase as BriefcaseIcon, Sparkles } from 'lucide-react'

export function CVSection() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll position within this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // 1. Profile Widget (Slides in from top-left)
  const profileX = useTransform(scrollYProgress, [0.1, 0.4], [-200, 0])
  const profileOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1])

  // 2. Experience Widget (Slides in from top-right)
  const expX = useTransform(scrollYProgress, [0.2, 0.5], [200, 0])
  const expOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1])

  // 3. Tech Stack Widget (Slides up from bottom)
  const techY = useTransform(scrollYProgress, [0.3, 0.6], [150, 0])
  const techOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1])

  // 4. Environment Widget (Slides up from bottom, slightly delayed)
  const envY = useTransform(scrollYProgress, [0.4, 0.7], [150, 0])
  const envOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1])

  return (
    <section ref={containerRef} className="relative z-10 bg-zinc-950 pb-48 pt-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: false, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              {t.cv.sectionTitle}
            </h2>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl">
            {t.cv.sectionSubtitle}
          </p>
        </motion.div>

        {/* Bento Grid Layout aligned with Scroll */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[240px]">
          
          {/* Profile Widget - Span 2 cols */}
          <motion.div
            style={{ x: profileX, opacity: profileOpacity }}
            className="md:col-span-2 md:row-span-1 bg-zinc-900 border border-zinc-700/50 rounded-[2rem] p-8 relative overflow-hidden group hover:border-zinc-600 transition-colors shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50" />
            <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
              <Sparkles className="w-64 h-64 text-emerald-400" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                </div>
                {t.cv.profile.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base text-balance pr-4 font-light">
                {t.cv.profile.content}
              </p>
            </div>
          </motion.div>

          {/* Experience Widget - Span 1 col, 2 rows */}
          <motion.div
            style={{ x: expX, opacity: expOpacity }}
            className="md:col-span-1 md:row-span-2 bg-zinc-900 border border-zinc-700/50 rounded-[2rem] p-8 relative overflow-hidden group hover:border-zinc-600 transition-colors flex flex-col shadow-2xl"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
            
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BriefcaseIcon className="w-5 h-5 text-blue-400" />
              </div>
              {t.cv.experience.title}
            </h3>
            
            <div className="relative pl-6 border-l-2 border-zinc-800 flex-1 z-10">
              <div className="absolute w-4 h-4 bg-zinc-900 border-2 border-blue-500 rounded-full -left-[9px] top-1" />
              <div className="absolute w-2 h-2 bg-blue-400 rounded-full -left-[5px] top-2 animate-ping" />
              
              <h4 className="text-lg font-bold text-zinc-100 leading-none mb-2">{t.cv.experience.xpande.role}</h4>
              <p className="text-blue-400/80 text-sm font-medium mb-6">
                {t.cv.experience.xpande.company} • {t.cv.experience.xpande.date}
              </p>
              <ul className="space-y-4 text-zinc-400 text-sm">
                {t.cv.experience.xpande.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3 leading-snug items-start">
                    <span className="text-blue-500/50 text-xs mt-1">▹</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Tech Skills Widget - Span 1 col */}
          <motion.div
            style={{ y: techY, opacity: techOpacity }}
            className="md:col-span-1 md:row-span-1 bg-zinc-900 border border-zinc-700/50 rounded-[2rem] p-8 relative overflow-hidden group hover:border-zinc-600 transition-colors flex flex-col justify-center shadow-2xl"
          >
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Java', 'JavaScript', 'TypeScript', 'HTML5', 'Tailwind CSS', 'SQL', 'Next.js'].map((tech, i) => (
                <span 
                  key={tech} 
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 hover:border-purple-500/50 hover:text-white transition-colors cursor-default shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Tools & Environment Widget - Span 1 col */}
          <motion.div
            style={{ y: envY, opacity: envOpacity }}
            className="md:col-span-1 md:row-span-1 bg-zinc-900 border border-zinc-700/50 rounded-[2rem] p-8 relative overflow-hidden group hover:border-zinc-600 transition-colors flex flex-col justify-center shadow-2xl"
          >
             <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
               <div className="p-2 bg-orange-500/10 rounded-lg">
                 <Wrench className="w-5 h-5 text-orange-400" />
               </div>
               Environment
             </h4>
             <div className="flex flex-wrap gap-2">
              {['VS Code', 'Git', 'PostgreSQL', 'MySQL', 'Excel (Adv)', 'Linux'].map((tool) => (
                <span 
                  key={tool} 
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 hover:border-orange-500/50 hover:text-white transition-colors cursor-default shadow-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
