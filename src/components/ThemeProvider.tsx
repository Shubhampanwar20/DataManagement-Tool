import { createContext, useEffect, useMemo, type ReactNode } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'
import type { ThemeContextValue, ThemeMode } from '../types'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = usePersistentState<ThemeMode>('auditos-theme', 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    toggleTheme: () => {
      setMode((current) => (current === 'light' ? 'dark' : 'light'))
    },
  }), [mode, setMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
