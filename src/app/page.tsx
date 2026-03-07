"use client"

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { HeroCanvas } from '@/components/3d/HeroCanvas'
import { ChevronDown, Instagram, Linkedin, Mouse } from 'lucide-react'
import { GradeoBento, GradeoScrollyTelling } from '@/features/gradeo/GradeoBento'
import { GradeoCaseStudy } from '@/features/gradeo/GradeoCaseStudy'
import { CVSection } from '@/components/cv/CVSection'
import { useTranslation } from '@/hooks/useTranslation'

export default function Home() {
  const { scrollYProgress: heroProgress } = useScroll()
  const heroOpacity = useTransform(heroProgress, [0, 0.1], [1, 0])
  const heroY = useTransform(heroProgress, [0, 0.1], [0, -100])

  const scrollyContainerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress: rawGradeoProgress } = useScroll({
    target: scrollyContainerRef,
    offset: ["start center", "end end"]
  })
  
  const scrollyTextOpacity = useTransform(rawGradeoProgress, [0, 0.1], [1, 0])
  const [gradeoProgress, setGradeoProgress] = useState(0)

  useMotionValueEvent(rawGradeoProgress, "change", (latest) => {
    setGradeoProgress(latest)
  })

  const { t, lang } = useTranslation()

  // Calculate equivalent layer
  let scrollyLayer = 0
  if (gradeoProgress > 0.15) scrollyLayer = 1
  if (gradeoProgress > 0.35) scrollyLayer = 2
  if (gradeoProgress > 0.60) scrollyLayer = 3
  if (gradeoProgress > 0.85) scrollyLayer = 4

  return (
    <main className="relative min-h-[200vh] overflow-clip">
      {/* 3D Background */}
      <HeroCanvas />

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative h-screen flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 
            className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500 mb-6"
            dangerouslySetInnerHTML={{ __html: t.hero.title }}
          />
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 font-light text-balance mb-8">
            {t.hero.subtitle}
          </p>
          <div className="flex items-center justify-center gap-6">
            <a 
              href="https://www.linkedin.com/in/giancarlo-larios-infantes/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-800 hover:bg-zinc-800 hover:-translate-y-1 hover:text-blue-400 hover:border-blue-500/50 transition-all text-zinc-400 shadow-xl"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="https://www.instagram.com/giancarlolarios_?igsh=MXBhbmJycGxpOTU5eQ%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-800 hover:bg-zinc-800 hover:-translate-y-1 hover:text-pink-400 hover:border-pink-500/50 transition-all text-zinc-400 shadow-xl"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 text-zinc-600" />
        </motion.div>
      </motion.section>

      {/* CV / About Me Section */}
      <CVSection />

      {/* GRADEO Section */}
      <section className="relative z-10 bg-zinc-950 pb-32">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {lang === 'es' ? 'PROYECTO DESTACADO' : 'FEATURED PROJECT'}
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-2 text-white">{t.gradeo.title}</h2>
            <p className="text-xl text-zinc-400">{t.gradeo.subtitle}</p>
          </motion.div>

          {/* 1. Bento Grid First */}
          <GradeoBento />
          
          <div className="mt-8">
            <GradeoCaseStudy />
          </div>
        </div>

        {/* 2. Scrollytelling Sequence */}
        <div ref={scrollyContainerRef} className="h-[200vh] relative max-w-7xl mx-auto px-6 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
            
            {/* Left side: Sticky Titles */}
            <div className="h-full hidden md:block border-l border-zinc-800/50 pl-8 relative">
              <div className="sticky top-32 flex flex-col pt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scrollyLayer}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-3xl font-bold text-white mb-6">
                      {scrollyLayer === 0 ? t.gradeo.lifecycleTitle : 
                       scrollyLayer === 1 ? t.scrolly.step1Title :
                       scrollyLayer === 2 ? t.scrolly.step2Title :
                       scrollyLayer === 3 ? t.scrolly.step3Title : t.scrolly.step4Title}
                    </h3>
                    
                    {scrollyLayer === 0 ? (
                      <p className="text-zinc-400 text-lg text-balance">{t.scrolly.instruction}</p>
                    ) : scrollyLayer === 1 ? (
                      <p className="text-zinc-400 text-lg text-balance">{t.scrolly.step1Desc}</p>
                    ) : scrollyLayer === 2 ? (
                      <p className="text-zinc-400 text-lg text-balance">{t.scrolly.step2Desc}</p>
                    ) : scrollyLayer === 3 ? (
                      <p className="text-zinc-400 text-lg text-balance">{t.scrolly.step3Desc}</p>
                    ) : (
                      <p className="text-zinc-400 text-lg text-balance">{t.scrolly.step4Desc}</p>
                    )}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  {scrollyLayer < 4 && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      className="flex items-center gap-3 text-zinc-500 animate-pulse mt-12"
                    >
                      <Mouse className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-medium uppercase tracking-widest">{t.gradeo.scrollIndicator}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right side: Sticky Interactive Widget */}
            <div className="h-full relative">
              <GradeoScrollyTelling progress={gradeoProgress} />
            </div>

          </div>
        </div>
      </section>

      {/* Footer / Social Links */}
      <footer className="w-full bg-black py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-8">
          <div className="flex gap-6">
            <a 
              href="https://www.linkedin.com/in/giancarlo-larios-infantes/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-zinc-900 rounded-full hover:bg-zinc-800 hover:-translate-y-1 hover:text-blue-400 transition-all text-zinc-400 shadow-xl"
            >
              <Linkedin className="w-7 h-7" />
            </a>
            <a 
              href="https://www.instagram.com/giancarlolarios_?igsh=MXBhbmJycGxpOTU5eQ%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-zinc-900 rounded-full hover:bg-zinc-800 hover:-translate-y-1 hover:text-pink-400 transition-all text-zinc-400 shadow-xl"
            >
              <Instagram className="w-7 h-7" />
            </a>
          </div>
          <p className="text-zinc-500 text-sm font-medium">Giancarlo Larios © {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
