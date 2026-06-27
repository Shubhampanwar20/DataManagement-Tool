import type { ReactNode } from 'react'

export interface BaseComponentProps {
  children?: ReactNode
  className?: string
}

export interface ThemeContextValue {
  mode: 'light' | 'dark'
  toggleTheme: () => void
}

export interface NotificationContextValue {
  notify: (message: string, severity?: 'info' | 'success' | 'warning' | 'error') => void
  clear: (id: string) => void
  notifications: Array<{ id: string; message: string; severity: 'info' | 'success' | 'warning' | 'error' }>
}

export interface DatabaseContextValue {
  dbReady: boolean
  dbError: string | null
}
