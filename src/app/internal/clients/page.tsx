'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Client as DbClient } from '@/lib/database.types'

interface ClientWithMetrics extends DbClient {
  project_count: number
}

type ClientStatus = 'active' | 'completed' | 'prospect' | 'churned'

const statusConfig: Record<ClientStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: 'Active', color: '#BFFF00', bgColor: 'rgba(191, 255, 0, 0.1)' },
  completed: { label: 'Completed', color: '#00F0FF', bgColor: 'rgba(0, 240, 255, 0.1)' },
  prospect: { label: 'Prospect', color: '#FF00AA', bgColor: 'rgba(255, 0, 170, 0.1)' },
  churned: { label: 'Churned', color: '#888', bgColor: 'rgba(136, 136, 136, 0.1)' },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function ClientsPage() {
  const [filter, setFilter] = useState<'all' | ClientStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [clients, setClients] = useState<ClientWithMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddClientModal, setShowAddClientModal] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      const res = await fetch('/api/clients')
      if (!res.ok) throw new Error('Failed to fetch clients')
      const data = await res.json()

      // Add project_count if not already included
      const clientsWithMetrics: ClientWithMetrics[] = (data.data || data || []).map((client: DbClient & { project_count?: number }) => ({
        ...client,
        project_count: client.project_count || 0,
      }))

      setClients(clientsWithMetrics)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter((client) => {
    if (filter !== 'all' && client.status !== filter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        client.name.toLowerCase().includes(query) ||
        client.company.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
      )
    }
    return true
  })

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === 'active').length,
    totalValue: clients.reduce((sum, c) => sum + (c.total_value || 0), 0),
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ color: '#888' }}>Loading clients...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: '#FAFAFA',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            Clients
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            Manage client relationships and projects
          </p>
        </div>

        <button
          onClick={() => setShowAddClientModal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
            color: '#0A0A0A',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>+</span>
          Add Client
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            padding: 20,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Clients
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#FAFAFA' }}>{stats.total}</div>
        </div>

        <div
          style={{
            padding: 20,
            background: 'rgba(191, 255, 0, 0.05)',
            border: '1px solid rgba(191, 255, 0, 0.2)',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 11, color: '#BFFF00', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Clients
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#BFFF00' }}>{stats.active}</div>
        </div>

        <div
          style={{
            padding: 20,
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 11, color: '#00F0FF', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Revenue
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#00F0FF' }}>{formatCurrency(stats.totalValue)}</div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Status Filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'active', 'prospect', 'completed', 'churned'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                background: filter === f ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                border: filter === f ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
                borderRadius: 6,
                color: filter === f ? '#00F0FF' : '#888',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 6,
            color: '#FAFAFA',
            fontSize: 13,
            width: 250,
          }}
        />
      </div>

      {/* Clients Table */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
            gap: 16,
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: 11,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <span>Client</span>
          <span>Status</span>
          <span>Projects</span>
          <span>Last Active</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {filteredClients.map((client) => (
          <div
            key={client.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
              gap: 16,
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              alignItems: 'center',
              transition: 'background 0.2s ease',
            }}
            className="client-row"
          >
            {/* Client Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#0A0A0A',
                }}
              >
                {client.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>{client.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{client.company}</div>
                <div style={{ fontSize: 11, color: '#666' }}>{client.email}</div>
              </div>
            </div>

            {/* Status */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 10px',
                  background: statusConfig[client.status].bgColor,
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: statusConfig[client.status].color,
                }}
              >
                {statusConfig[client.status].label}
              </div>
            </div>

            {/* Projects */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
                {client.project_count} project{client.project_count !== 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 12, color: '#00F0FF' }}>
                {formatCurrency(client.total_value || 0)}
              </div>
            </div>

            {/* Last Active */}
            <div style={{ fontSize: 13, color: '#888' }}>
              {formatDate(client.last_active)}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <Link
                href={`/portal/${client.company.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#FAFAFA',
                  fontSize: 11,
                  fontWeight: 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                Portal
              </Link>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              color: '#666',
            }}
          >
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>👥</span>
            <p style={{ fontSize: 15, margin: 0 }}>No clients found</p>
            <p style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
              {clients.length === 0 ? 'Add your first client to get started' : 'Try adjusting your filters'}
            </p>
            {clients.length === 0 && (
              <button
                onClick={() => setShowAddClientModal(true)}
                style={{
                  marginTop: 16,
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                  color: '#0A0A0A',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Add Client
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <AddClientModal
          onClose={() => setShowAddClientModal(false)}
          onSuccess={() => {
            setShowAddClientModal(false)
            fetchClients()
          }}
        />
      )}

      <style jsx>{`
        .client-row:hover {
          background: rgba(0, 240, 255, 0.03) !important;
        }
      `}</style>
    </div>
  )
}

// Add Client Modal Component
function AddClientModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<ClientStatus>('prospect')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !company || !email) return

    setSaving(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          email,
          phone: phone || null,
          status,
          total_value: 0,
          joined_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
        }),
      })

      if (!res.ok) throw new Error('Failed to create client')
      onSuccess()
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Failed to create client')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1A1A1A',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          padding: 32,
          width: '100%',
          maxWidth: 480,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 24px', fontSize: 20, color: '#FAFAFA' }}>Add Client</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
              Contact Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#FAFAFA',
                fontSize: 14,
                outline: 'none',
              }}
              placeholder="e.g., John Smith"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
              Company Name *
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#FAFAFA',
                fontSize: 14,
                outline: 'none',
              }}
              placeholder="e.g., Acme Corp"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#FAFAFA',
                fontSize: 14,
                outline: 'none',
              }}
              placeholder="e.g., john@acme.com"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#FAFAFA',
                fontSize: 14,
                outline: 'none',
              }}
              placeholder="e.g., (704) 555-0123"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ClientStatus)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#FAFAFA',
                fontSize: 14,
                outline: 'none',
              }}
            >
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="churned">Churned</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 8,
                color: '#888',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name || !company || !email}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                border: 'none',
                borderRadius: 8,
                color: '#0A0A0A',
                fontSize: 14,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving || !name || !company || !email ? 0.5 : 1,
              }}
            >
              {saving ? 'Creating...' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
