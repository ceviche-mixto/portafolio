import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ModeState {
  isDeveloperMode: boolean
  toggleMode: () => void
  setDeveloperMode: (value: boolean) => void
}

/**
 * El modo persiste en localStorage: quien activa la vista de desarrollador y
 * recarga espera seguir en ella (ver U-07).
 *
 * `persist` rehidrata en un efecto posterior al montaje, así que el primer
 * render del cliente coincide con el del servidor y no hay error de
 * hidratación, sólo una actualización inmediatamente después.
 */
export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      isDeveloperMode: false,
      toggleMode: () => set((state) => ({ isDeveloperMode: !state.isDeveloperMode })),
      setDeveloperMode: (value) => set({ isDeveloperMode: value }),
    }),
    { name: 'portfolio-mode' }
  )
)
