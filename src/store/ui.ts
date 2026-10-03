import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface UIState {
  theme: Theme
  /** 大字号课堂演示模式 */
  largeFont: boolean
  toggleTheme: () => void
  toggleLargeFont: () => void
}

export const useUI = create<UIState>((set) => ({
  theme: 'light',
  largeFont: false,
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  toggleLargeFont: () => set((s) => ({ largeFont: !s.largeFont })),
}))
