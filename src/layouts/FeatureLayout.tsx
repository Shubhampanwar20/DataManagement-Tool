import type { ReactNode } from 'react'

interface FeatureLayoutProps {
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
}

export const FeatureLayout = ({ title, description, actions, children }: FeatureLayoutProps) => {
  return (
    <section className="feature-layout">
      <header className="feature-layout__header">
        <div>
          <p className="eyebrow">AuditOS</p>
          <h1>{title}</h1>
          <p className="feature-layout__description">{description}</p>
        </div>
        {actions ? <div className="feature-layout__actions">{actions}</div> : null}
      </header>
      <div className="feature-layout__content">{children}</div>
    </section>
  )
}
