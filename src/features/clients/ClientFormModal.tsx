import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { ClientEntity } from '../../types'

export interface ClientDraft {
  name: string
  industry: string
  sector: string
  auditType: string
  partnerName: string
  managerName: string
  teamMembers: string
  plantLocations: string
  status: ClientEntity['status']
  remarks: string
}

interface ClientFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  initialValue?: ClientDraft
  onClose: () => void
  onSubmit: (payload: ClientDraft) => void | Promise<void>
}

const defaultDraft = (): ClientDraft => ({
  name: '',
  industry: '',
  sector: '',
  auditType: '',
  partnerName: '',
  managerName: '',
  teamMembers: '',
  plantLocations: '',
  status: 'Active',
  remarks: '',
})

export const ClientFormModal = ({ isOpen, mode, initialValue, onClose, onSubmit }: ClientFormModalProps) => {
  const [form, setForm] = useState<ClientDraft>(defaultDraft)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setForm(initialValue ?? defaultDraft())
  }, [initialValue, isOpen])

  const title = useMemo(() => (mode === 'edit' ? 'Edit client' : 'Add client'), [mode])

  if (!isOpen) {
    return null
  }

  const updateField = <K extends keyof ClientDraft>(field: K, value: ClientDraft[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim()) {
      return
    }

    await onSubmit(form)
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="client-form-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-card__header">
          <div>
            <p className="eyebrow">Client record</p>
            <h3 id="client-form-title">{title}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field">
              <span>Client name</span>
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
            </label>

            <label className="field">
              <span>Industry</span>
              <input value={form.industry} onChange={(event) => updateField('industry', event.target.value)} />
            </label>

            <label className="field">
              <span>Sector</span>
              <input value={form.sector} onChange={(event) => updateField('sector', event.target.value)} />
            </label>

            <label className="field">
              <span>Audit type</span>
              <input value={form.auditType} onChange={(event) => updateField('auditType', event.target.value)} />
            </label>

            <label className="field">
              <span>Partner</span>
              <input value={form.partnerName} onChange={(event) => updateField('partnerName', event.target.value)} />
            </label>

            <label className="field">
              <span>Manager</span>
              <input value={form.managerName} onChange={(event) => updateField('managerName', event.target.value)} />
            </label>

            <label className="field">
              <span>Status</span>
              <select value={form.status} onChange={(event) => updateField('status', event.target.value as ClientEntity['status'])}>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>

            <label className="field field--full">
              <span>Team members</span>
              <textarea
                value={form.teamMembers}
                onChange={(event) => updateField('teamMembers', event.target.value)}
                placeholder="Separate members with commas or new lines"
                rows={3}
              />
            </label>

            <label className="field field--full">
              <span>Plant locations</span>
              <textarea
                value={form.plantLocations}
                onChange={(event) => updateField('plantLocations', event.target.value)}
                placeholder="Separate locations with commas or new lines"
                rows={3}
              />
            </label>

            <label className="field field--full">
              <span>Remarks</span>
              <textarea value={form.remarks} onChange={(event) => updateField('remarks', event.target.value)} rows={4} />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {mode === 'edit' ? 'Save changes' : 'Create client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
