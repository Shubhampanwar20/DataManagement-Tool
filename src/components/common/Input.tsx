import type { InputHTMLAttributes } from 'react'
import type { BaseComponentProps } from '../../types'

interface InputProps extends BaseComponentProps, InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ className, label, error, id, ...props }: InputProps) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <label className={['field', className].filter(Boolean).join(' ')} htmlFor={inputId}>
      {label ? <span className="field__label">{label}</span> : null}
      <input id={inputId} className={['field__input', error ? 'field__input--error' : ''].filter(Boolean).join(' ')} {...props} />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}
