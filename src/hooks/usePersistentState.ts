import { useEffect, useState } from 'react'

export const usePersistentState = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    const storedValue = window.localStorage.getItem(key)

    if (!storedValue) {
      return initialValue
    }

    try {
      return JSON.parse(storedValue) as T
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState] as const
}
