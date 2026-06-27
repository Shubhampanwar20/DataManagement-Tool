import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { db } from '../database/db'
import type { DatabaseContextValue } from '../types'

export const DatabaseContext = createContext<DatabaseContextValue | null>(null)

interface DatabaseProviderProps {
  children: ReactNode
}

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  const [dbReady, setDbReady] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    db.open()
      .then(() => {
        if (active) {
          setDbReady(true)
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setDbError(error instanceof Error ? error.message : 'Database could not be opened.')
        }
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo<DatabaseContextValue>(() => ({ dbReady, dbError }), [dbReady, dbError])

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>
}
