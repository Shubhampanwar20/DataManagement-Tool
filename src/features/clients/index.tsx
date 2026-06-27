import { useEffect, useMemo, useState } from 'react'
import { FeatureLayout } from '../../layouts/FeatureLayout'
import { db } from '../../database/db'
import { useDatabase } from '../../hooks/useDatabase'
import { useNotification } from '../../hooks/useNotification'
import type { ClientEntity } from '../../types'
import { ClientFormModal, type ClientDraft } from './ClientFormModal'
import './clients.css'

const createDraftFromClient = (client: ClientEntity): ClientDraft => ({
  name: client.name,
  industry: client.industry,
  sector: client.sector,
  auditType: client.auditType ?? '',
  partnerName: client.partnerName ?? '',
  managerName: client.managerName ?? '',
  teamMembers: client.teamMembers?.map((member) => member.name).join(', ') ?? '',
  plantLocations: client.plantLocations?.join(', ') ?? '',
  status: client.status,
  remarks: client.remarks ?? '',
})

const parseList = (value: string) =>
  value
    .split(/\n|,/) 
    .map((item) => item.trim())
    .filter(Boolean)

const ClientsPage = () => {
  const { dbReady } = useDatabase()
  const { notify } = useNotification()
  const [clients, setClients] = useState<ClientEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ClientEntity['status']>('all')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [sectorFilter, setSectorFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientEntity | null>(null)

  useEffect(() => {
    const refreshClients = async () => {
      setLoading(true)
      const records = await db.clients.orderBy('updatedAt').reverse().toArray()
      setClients(records as ClientEntity[])
      setLoading(false)
    }

    void refreshClients()
  }, [])

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return clients.filter((client) => {
      const searchableText = `${client.name} ${client.industry} ${client.sector} ${client.auditType ?? ''}`.toLowerCase()
      const matchesSearch = normalizedSearch.length === 0 || searchableText.includes(normalizedSearch)
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter
      const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter
      const matchesSector = sectorFilter === 'all' || client.sector === sectorFilter

      return matchesSearch && matchesStatus && matchesIndustry && matchesSector
    })
  }, [clients, industryFilter, search, sectorFilter, statusFilter])

  const stats = useMemo(() => {
    const activeCount = clients.filter((client) => client.status === 'Active').length
    const pendingCount = clients.filter((client) => client.status === 'Pending').length
    const inactiveCount = clients.filter((client) => client.status === 'Inactive').length

    return [
      { label: 'Total clients', value: clients.length },
      { label: 'Active', value: activeCount },
      { label: 'Pending', value: pendingCount },
      { label: 'Inactive', value: inactiveCount },
    ]
  }, [clients])

  const industryOptions = useMemo(() => Array.from(new Set(clients.map((client) => client.industry).filter(Boolean))), [clients])
  const sectorOptions = useMemo(() => Array.from(new Set(clients.map((client) => client.sector).filter(Boolean))), [clients])

  const openCreateModal = () => {
    setEditingClient(null)
    setIsFormOpen(true)
  }

  const openEditModal = (client: ClientEntity) => {
    setEditingClient(client)
    setIsFormOpen(true)
  }

  const handleSubmit = async (draft: ClientDraft) => {
    const now = new Date().toISOString()
    const payload: ClientEntity = {
      id: editingClient?.id ?? crypto.randomUUID(),
      name: draft.name.trim(),
      industry: draft.industry.trim(),
      sector: draft.sector.trim(),
      auditType: draft.auditType.trim() || undefined,
      partnerName: draft.partnerName.trim() || undefined,
      managerName: draft.managerName.trim() || undefined,
      teamMembers: parseList(draft.teamMembers).map((name, index) => ({
        id: `${Date.now()}-${index}`,
        name,
        email: '',
        role: 'Team Member',
      })),
      plantLocations: parseList(draft.plantLocations),
      status: draft.status,
      remarks: draft.remarks.trim() || undefined,
      createdAt: editingClient?.createdAt ?? now,
      updatedAt: now,
    }

    await db.clients.put(payload)
    setClients((current) => {
      const existingIndex = current.findIndex((item) => item.id === payload.id)

      if (existingIndex >= 0) {
        const next = [...current]
        next[existingIndex] = payload
        return next.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      }

      return [payload, ...current].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    })

    notify(editingClient ? 'Client updated successfully.' : 'Client created successfully.', 'success')
    setIsFormOpen(false)
    setEditingClient(null)
  }

  const handleDelete = async (clientId: string) => {
    const confirmed = window.confirm('Delete this client record? This action cannot be undone.')

    if (!confirmed) {
      return
    }

    await db.clients.delete(clientId)
    setClients((current) => current.filter((client) => client.id !== clientId))
    notify('Client deleted successfully.', 'warning')
  }

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setIndustryFilter('all')
    setSectorFilter('all')
  }

  if (!dbReady) {
    return (
      <FeatureLayout title="Client management" description="Maintain your client portfolio and prepare it for future engagements.">
        <div className="client-panel empty-state">Opening your offline database…</div>
      </FeatureLayout>
    )
  }

  return (
    <FeatureLayout title="Client management" description="Maintain your client portfolio and prepare it for future engagements.">
      <div className="client-shell">
        <section className="client-panel client-toolbar">
          <div className="client-toolbar__search">
            <label htmlFor="client-search">Search clients</label>
            <input
              id="client-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by client, industry, sector, or audit type"
            />
          </div>

          <div className="client-toolbar__filter">
            <label htmlFor="client-status">Status</label>
            <select id="client-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | ClientEntity['status'])}>
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="client-toolbar__filter">
            <label htmlFor="client-industry">Industry</label>
            <select id="client-industry" value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)}>
              <option value="all">All industries</option>
              {industryOptions.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="client-toolbar__filter">
            <label htmlFor="client-sector">Sector</label>
            <select id="client-sector" value={sectorFilter} onChange={(event) => setSectorFilter(event.target.value)}>
              <option value="all">All sectors</option>
              {sectorOptions.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div className="client-toolbar__actions">
            <button type="button" className="secondary-button" onClick={resetFilters}>
              Reset
            </button>
            <button type="button" className="primary-button" onClick={openCreateModal}>
              Add client
            </button>
          </div>
        </section>

        <section className="client-stats">
          {stats.map((stat) => (
            <article key={stat.label} className="client-stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="client-panel">
          {loading ? (
            <div className="empty-state">Loading clients from your local database…</div>
          ) : filteredClients.length === 0 ? (
            <div className="empty-state">No clients match the current search and filters. Try broadening your criteria or add a new client.</div>
          ) : (
            <div className="client-list">
              {filteredClients.map((client) => (
                <article key={client.id} className="client-card">
                  <div className="client-card__header">
                    <div className="client-card__title">
                      <h3>{client.name}</h3>
                      <div className="client-card__meta">
                        {client.industry || 'Industry pending'} • {client.sector || 'Sector pending'}
                      </div>
                    </div>
                    <span className={`status-pill status-pill--${client.status.toLowerCase()}`}>{client.status}</span>
                  </div>

                  <div className="client-card__body">
                    <p>
                      <strong>Audit type</strong>
                      <br />
                      {client.auditType || '—'}
                    </p>
                    <p>
                      <strong>Partner</strong>
                      <br />
                      {client.partnerName || '—'}
                    </p>
                    <p>
                      <strong>Manager</strong>
                      <br />
                      {client.managerName || '—'}
                    </p>
                    <p>
                      <strong>Team members</strong>
                      <br />
                      {client.teamMembers?.map((member) => member.name).filter(Boolean).join(', ') || '—'}
                    </p>
                    <p>
                      <strong>Locations</strong>
                      <br />
                      {client.plantLocations?.join(', ') || '—'}
                    </p>
                    <p>
                      <strong>Remarks</strong>
                      <br />
                      {client.remarks || '—'}
                    </p>
                  </div>

                  <div className="client-card__footer">
                    <button type="button" onClick={() => openEditModal(client)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => void handleDelete(client.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <ClientFormModal
        isOpen={isFormOpen}
        mode={editingClient ? 'edit' : 'create'}
        initialValue={editingClient ? createDraftFromClient(editingClient) : undefined}
        onClose={() => {
          setIsFormOpen(false)
          setEditingClient(null)
        }}
        onSubmit={(draft) => void handleSubmit(draft)}
      />
    </FeatureLayout>
  )
}

export default ClientsPage
