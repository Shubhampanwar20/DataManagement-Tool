import type { BaseComponentProps } from '../../types'

interface LoadingProps extends BaseComponentProps {
  label?: string
}

export const Loading = ({ className, label = 'Loading application resources…' }: LoadingProps) => {
  return (
    <div className={['loading-state', className].filter(Boolean).join(' ')} role="status" aria-live="polite">
      <div className="loading-state__spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}
