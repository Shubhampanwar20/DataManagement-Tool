import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { BaseComponentProps } from '../../types'

interface ButtonProps extends BaseComponentProps, ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  icon?: ReactNode
}

export const Button = ({
  children,
  className,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  ...props
}: ButtonProps) => {
  const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ')

  return (
    <button className={classes} disabled={disabled || loading} type={props.type ?? 'button'} {...props}>
      {loading ? <span className="button__spinner" aria-hidden="true" /> : null}
      {icon ? <span className="button__icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}
