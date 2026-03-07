import { create } from 'zustand'

interface ModeState {
  isDeveloperMode: boolean
  toggleMode: () => void
  setDeveloperMode: (value: boolean) => void
}

export const useModeStore = create<ModeState>((set) => ({
  isDeveloperMode: false,
  toggleMode: () => set((state) => ({ isDeveloperMode: !state.isDeveloperMode })),
  setDeveloperMode: (value) => set({ isDeveloperMode: value }),
}))
