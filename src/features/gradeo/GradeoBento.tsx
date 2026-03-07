"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useModeStore } from '@/store/useModeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { MapPin, Star, Users, DatabaseZap, Lock, Code2, Server, Mouse } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Sub-component: Live Stats Widget
function LiveStatsWidget() {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t, lang } = useTranslation()
  const [reviews, setReviews] = useState<number | string>("...")
  const [professors, setProfessors] = useState<number | string>("...")

  useEffect(() => {
    async function fetchStats() {
      try {
        const [profRes, revRes] = await Promise.all([
          supabase.from('professors').select('*', { count: 'exact', head: true }),
          supabase.from('reviews').select('*', { count: 'exact', head: true })
        ])
        if (profRes.count !== null) setProfessors(profRes.count)
        if (revRes.count !== null) setReviews(revRes.count)
      } catch (error) {
        console.error("Live DB Error:", error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="flex flex-col h-full justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden relative group">
      {isDeveloperMode && (
        <div className="absolute top-4 right-4 text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          postgres.realtime
        </div>
      )}
      <h3 className="text-xl font-bold tracking-tight text-white mb-8">{t.bento.liveMetrics}</h3>
      <div className="flex flex-col gap-4 relative z-10">
        <div>
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {reviews}
          </span>
          <p className="text-sm font-medium text-zinc-400 flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500"/> {t.bento.totalReviews}</p>
        </div>
        <div>
          <span className="text-2xl font-black text-white">
            {professors}
          </span>
          <p className="text-sm font-medium text-zinc-400 flex items-center gap-1"><Users className="w-4 h-4 text-blue-400"/> {t.bento.listedProfessors}</p>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
        <DatabaseZap className="w-48 h-48 text-emerald-400" />
      </div>
    </div>
  )
}

// Sub-component: Location Widget
function LocationWidget() {
  const { t } = useTranslation()
  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden flex flex-col group cursor-default">
      <div className="z-20 relative">
        <h3 className="text-lg font-bold text-white mb-1"><MapPin className="inline w-5 h-5 mr-1 text-red-500"/> {t.bento.campus}</h3>
        <p className="text-sm text-zinc-400">{t.bento.city}</p>
      </div>
      
      {/* Real Map Integration of USAT, Chiclayo with adjusted Zoom and Marker */}
      <div className="absolute inset-0 top-16 opacity-60 group-hover:opacity-100 transition-opacity duration-700 select-none overflow-hidden rounded-b-3xl">
        <iframe 
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%)' }}
          loading="lazy" 
          allowFullScreen 
          src="https://www.openstreetmap.org/export/embed.html?bbox=-79.8643%2C-6.7616%2C-79.8623%2C-6.7596&amp;layer=mapnik&amp;marker=-6.7606043%2C-79.8632655"
        />
        {/* Radar ping animation layered on top of the real map */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 border-2 border-red-500/60 rounded-full absolute animate-ping" style={{ animationDuration: '2s' }} />
          <div className="w-32 h-32 border border-red-500/30 rounded-full absolute" />
          <div className="w-48 h-48 border border-red-500/10 rounded-full absolute" />
        </div>
        
        {/* Disable pointer events on the overlay map to prevent scrolling trap, unless hovered maybe, but better to keep it aesthetic */}
        <div className="absolute inset-0 bg-transparent pointer-events-none" />
      </div>

      <div className="mt-auto z-20 relative">
        <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 mt-4 shadow-2xl">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-zinc-300 font-bold tracking-widest">LOCAL REACH</span>
        </div>
      </div>
    </div>
  )
}

// Sub-component: Top Rated Marquee
function TopRatedWidget() {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t } = useTranslation()
  
  const [profs, setProfs] = useState<{name: string, score: string}[]>([])

  useEffect(() => {
    async function loadTopProfs() {
      try {
        const { data } = await supabase
          .from('professors')
          .select('first_name, last_name, total_score')
          .order('total_score', { ascending: false })
          .order('review_count', { ascending: false })
          .limit(5)
        
        if (data && data.length > 0) {
          setProfs(data.map(p => ({
            name: `${p.first_name} ${p.last_name}`,
            score: Number(p.total_score).toFixed(1)
          })))
        }
      } catch (err) {
        console.error("Live DB Error:", err)
      }
    }
    loadTopProfs()
  }, [])

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col overflow-hidden relative">
      <h3 className="text-lg font-bold text-white mb-4">{t.bento.topRated}</h3>
      {isDeveloperMode ? (
        <div className="flex-1 font-mono text-[10px] sm:text-xs text-zinc-400 bg-black/50 p-3 rounded-xl border border-zinc-800/50 flex flex-col justify-center leading-relaxed">
          <span className="text-purple-400">SELECT</span> first_name, last_name, total_score<br/>
          <span className="text-purple-400">FROM</span> public.professors <br/>
          <span className="text-purple-400">ORDER BY</span> total_score <span className="text-orange-400">DESC</span>, <br/> review_count <span className="text-orange-400">DESC</span> <br/>
          <span className="text-purple-400">LIMIT</span> 5;
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {profs.map((prof, i) => (
            <div key={prof.name} className="flex items-center justify-between">
              <span className="text-sm text-zinc-300 font-medium">{i+1}. {prof.name}</span>
              <span className="text-sm font-bold text-yellow-400 flex items-center gap-1">{prof.score} <Star className="w-3 h-3 fill-yellow-400 text-yellow-500"/></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Sub-component: Architecture / Formula Widget (Developer Mode Exclusive)
function DeveloperInsightWidget() {
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)
  const { t } = useTranslation()
  
  if (!isDeveloperMode) return (
    <div className="h-full bg-zinc-950/50 border border-zinc-800/30 border-dashed rounded-3xl flex items-center justify-center p-6 text-center">
      <p className="text-sm text-zinc-600 font-medium" dangerouslySetInnerHTML={{ __html: t.bento.devInsight }} />
    </div>
  )
  
  return (
    <div className="h-full bg-zinc-900 border border-zinc-700/50 rounded-3xl p-6 flex flex-col gap-4 ring-1 ring-green-500/20">
      <h3 className="text-sm font-bold text-green-400 flex items-center gap-2 font-mono">
        <Code2 className="w-4 h-4"/> {t.bento.weightedLogic}
      </h3>
      <div className="bg-black/80 rounded-lg p-3 overflow-x-auto text-[10px] font-mono text-zinc-300 border border-zinc-800">
        <pre>
{`function computeScore(reviews) {
  let sum = 0, weightSum = 0;
  reviews.forEach(r => {
    const weight = r.isVerified ? 1.5 : 1;
    sum += r.score * weight;
    weightSum += weight;
  });
  return sum / weightSum;
}`}
        </pre>
      </div>
    </div>
  )
}

export function GradeoScrollyTelling({ progress }: { progress: number }) {
  const { t } = useTranslation()
  let layer = 0
  if (progress > 0.15) layer = 1
  if (progress > 0.35) layer = 2
  if (progress > 0.60) layer = 3
  if (progress > 0.85) layer = 4

  return (
    <div className="sticky top-24 md:top-32 h-[70vh] md:h-[60vh] w-full bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl p-4">
      <AnimatePresence mode="wait">
        {layer === 0 && (
          <motion.div key="layer0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center flex flex-col items-center justify-center h-full">
             <div className="w-24 h-36 bg-zinc-900 rounded-full border-2 border-zinc-700 mx-auto flex items-start justify-center p-4 relative overflow-hidden shadow-2xl">
               <motion.div 
                 animate={{ y: [0, 24, 0] }} 
                 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                 className="w-8 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
             </div>
             <h3 className="md:hidden mt-8 text-2xl font-bold text-white text-balance">{t.gradeo.lifecycleTitle}</h3>
             <p className="md:hidden mt-4 text-zinc-500 text-sm max-w-[250px] text-balance mx-auto leading-relaxed">{t.scrolly.instruction}</p>
             <p className="hidden md:flex mt-8 text-zinc-400 font-medium font-mono uppercase tracking-widest text-sm animate-pulse items-center justify-center gap-2">
                 <Mouse className="w-5 h-5 text-emerald-500" /> {t.gradeo.scrollIndicator}
             </p>
          </motion.div>
        )}
        {layer === 1 && (
          <motion.div key="layer1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
            <div className="w-64 h-80 bg-zinc-900 rounded-2xl border border-zinc-700 mx-auto shadow-2xl flex flex-col p-4">
              <div className="h-8 bg-zinc-800 rounded-lg mb-4" />
              <div className="h-20 bg-zinc-800 rounded-lg mb-2" />
              <div className="h-20 bg-zinc-800 rounded-lg mb-2" />
            </div>
            <p className="mt-6 text-zinc-400 font-medium font-mono">{t.scrolly.step1Title}</p>
            <p className="md:hidden mt-2 text-zinc-500 text-sm max-w-[280px] text-balance mx-auto leading-relaxed">{t.scrolly.step1Desc}</p>
          </motion.div>
        )}
        {layer === 2 && (
          <motion.div key="layer2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
             <div className="w-64 h-80 bg-zinc-900 rounded-2xl border border-zinc-700 mx-auto shadow-2xl flex flex-col items-center justify-center relative">
               <motion.div initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute z-20">
                 <Star className="w-20 h-20 text-yellow-500 fill-yellow-500" />
               </motion.div>
             </div>
             <p className="mt-6 text-zinc-400 font-medium">{t.scrolly.step2Title}</p>
             <p className="md:hidden mt-2 text-zinc-500 text-sm max-w-[280px] text-balance mx-auto leading-relaxed">{t.scrolly.step2Desc}</p>
          </motion.div>
        )}
        {layer === 3 && (
          <motion.div key="layer3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="text-center">
            <div className="flex items-center gap-8 justify-center">
              <Server className="w-20 h-20 text-emerald-500" />
            </div>
             <p className="mt-6 text-zinc-400 font-medium font-mono bg-emerald-500/10 text-emerald-400 py-1 px-3 rounded-full border border-emerald-500/20 inline-block">{t.scrolly.step3Title}</p>
             <p className="md:hidden mt-4 text-zinc-500 text-sm max-w-[280px] text-balance mx-auto leading-relaxed">{t.scrolly.step3Desc}</p>
          </motion.div>
        )}
        {layer === 4 && (
          <motion.div key="layer4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <Lock className="w-20 h-20 text-white inline-block mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">{t.scrolly.step4Title}</h3>
            <p className="md:hidden mt-2 text-zinc-500 text-sm max-w-[280px] text-balance mx-auto leading-relaxed">{t.scrolly.step4Desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function GradeoBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[200px]">
      <div className="md:col-span-1 md:row-span-2">
        <LiveStatsWidget />
      </div>
      <div className="md:col-span-1 md:row-span-1">
        <LocationWidget />
      </div>
      <div className="md:col-span-1 md:row-span-2">
        <TopRatedWidget />
      </div>
      <div className="md:col-span-1 md:row-span-1">
        <DeveloperInsightWidget />
      </div>
    </div>
  )
}
