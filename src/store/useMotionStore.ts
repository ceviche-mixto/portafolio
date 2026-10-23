import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useMotionStore = create<{
  paused: boolean
  togglePaused: () => void
}>()(
  persist(
    (set) => ({ paused: false, togglePaused: () => set((state) => ({ paused: !state.paused })) }),
    { name: 'portfolio-motion', skipHydration: true },
  ),
)
