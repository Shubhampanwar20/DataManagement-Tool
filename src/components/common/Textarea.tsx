import type { TextareaHTMLAttributes } from 'react'
import type { BaseComponentProps } from '../../types'

interface TextareaProps extends BaseComponentProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = ({ className, label, error, id, ...props }: TextareaProps) => {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <label className={['field', className].filter(Boolean).join(' ')} htmlFor={textareaId}>
      {label ? <span className="field__label">{label}</span> : null}
      <textarea id={textareaId} className={['field__input', error ? 'field__input--error' : ''].filter(Boolean).join(' ')} {...props} />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}
