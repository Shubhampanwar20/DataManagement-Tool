import type { BaseComponentProps } from '../../types'

export const Card = ({ children, className }: BaseComponentProps) => {
  return <section className={['card', className].filter(Boolean).join(' ')}>{children}</section>
}
