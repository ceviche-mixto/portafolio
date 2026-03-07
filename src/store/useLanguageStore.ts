import { create } from 'zustand'

interface LanguageState {
  language: 'es' | 'en'
  toggleLanguage: () => void
  setLanguage: (lang: 'es' | 'en') => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'es', // Default to Spanish as requested
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'es' : 'en' })),
  setLanguage: (lang) => set({ language: lang }),
}))
