import type { SelectHTMLAttributes } from 'react'
import type { BaseComponentProps } from '../../types'

interface SelectProps extends BaseComponentProps, SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = ({ className, label, error, id, children, ...props }: SelectProps) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <label className={['field', className].filter(Boolean).join(' ')} htmlFor={selectId}>
      {label ? <span className="field__label">{label}</span> : null}
      <select id={selectId} className={['field__input', error ? 'field__input--error' : ''].filter(Boolean).join(' ')} {...props}>
        {children}
      </select>
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}
