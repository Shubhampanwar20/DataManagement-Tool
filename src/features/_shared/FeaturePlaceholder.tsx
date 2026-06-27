import type { ReactNode } from 'react'
import { FeatureLayout } from '../../layouts/FeatureLayout'

interface FeaturePlaceholderProps {
  title: string
  description: string
  children?: ReactNode
}

export const FeaturePlaceholder = ({ title, description, children }: FeaturePlaceholderProps) => {
  return (
    <FeatureLayout title={title} description={description}>
      <section className="card card--placeholder">
        <h2>{title}</h2>
        <p>{description}</p>
        {children}
      </section>
    </FeatureLayout>
  )
}
