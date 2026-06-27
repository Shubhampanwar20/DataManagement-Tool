import { useEffect, useRef, useState } from 'react'

export const useAutoSave = <T>(value: T, delay = 500) => {
  const [savedValue, setSavedValue] = useState(value)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setSavedValue(value)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])

  return savedValue
}
