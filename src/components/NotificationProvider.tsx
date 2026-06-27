import { createContext, useMemo, useState, type ReactNode } from 'react'
import { Toast } from './common/Toast'
import type { NotificationContextValue } from '../types'

export const NotificationContext = createContext<NotificationContextValue | null>(null)

interface NotificationProviderProps {
  children: ReactNode
}

interface NotificationItem {
  id: string
  message: string
  severity: 'info' | 'success' | 'warning' | 'error'
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const notify = (message: string, severity: NotificationItem['severity'] = 'info') => {
    const id = window.crypto.randomUUID()
    const item: NotificationItem = { id, message, severity }

    setNotifications((current) => [...current, item])

    window.setTimeout(() => {
      setNotifications((current) => current.filter((entry) => entry.id !== id))
    }, 4000)
  }

  const clear = (id: string) => {
    setNotifications((current) => current.filter((entry) => entry.id !== id))
  }

  const value = useMemo<NotificationContextValue>(
    () => ({ notifications, notify, clear }),
    [notifications],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-label="Notifications">
        {notifications.map((notification) => (
          <Toast key={notification.id} severity={notification.severity} onClose={() => clear(notification.id)}>
            {notification.message}
          </Toast>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
