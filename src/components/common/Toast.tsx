import type { ReactNode } from 'react'

interface ToastProps {
  children: ReactNode
  severity: 'info' | 'success' | 'warning' | 'error'
  onClose: () => void
}

const severityClasses: Record<ToastProps['severity'], string> = {
  info: 'border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100',
  success: 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
  warning: 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100',
  error: 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-100',
}

export const Toast = ({ children, severity, onClose }: ToastProps) => {
  return (
    <div className={`rounded-lg border px-4 py-3 shadow-sm ${severityClasses[severity]}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm">{children}</p>
        <button type="button" className="text-sm opacity-70 hover:opacity-100" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  )
}
