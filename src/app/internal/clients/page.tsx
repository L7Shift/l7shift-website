'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StatusPill } from '@/components/dashboard'

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone?: string
  status: 'active' | 'completed' | 'prospect' | 'churned'
  projectCount: number
  totalValue: number
  joinedAt: Date
  lastActive: Date
  avatar?: string
}

// Mock clients data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Eric Johnson',
    company: 'Scat Pack CLT',
    email: 'eric@scatpackclt.com',
    phone: '(704) 555-0123',
    status: 'active',
    projectCount: 1,
    totalValue: 5000,
    joinedAt: new Date('2026-01-01'),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '2',
    name: 'Jazz',
    company: 'Pretty Paid Closet',
    email: 'jazz@prettypaidcloset.com',
    status: 'active',
    projectCount: 1,
    totalValue: 4500,
    joinedAt: new Date('2026-01-20'),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '3',
    name: 'Nicole Walker',
    company: 'Stitchwichs',
    email: 'nicole@stitchwichs.com',
    phone: '(704) 555-0456',
    status: 'prospect',
    projectCount: 1,
    totalValue: 3500,
    joinedAt: new Date('2026-01-15'),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
]

const statusConfig: Record<Client['status'], { label: string; color: string; bgColor: string }> = {
  active: { label: 'Active', color: '#BFFF00', bgColor: 'rgba(191, 255, 0, 0.1)' },
  completed: { label: 'Completed', color: '#00F0FF', bgColor: 'rgba(0, 240, 255, 0.1)' },
  prospect: { label: 'Prospect', color: '#FF00AA', bgColor: 'rgba(255, 0, 170, 0.1)' },
  churned: { label: 'Churned', color: '#888', bgColor: 'rgba(136, 136, 136, 0.1)' },
}

function formatDate(date: Date): string {
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
  const [filter, setFilter] = useState<'all' | Client['status']>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredClients = mockClients.filter((client) => {
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
    total: mockClients.length,
    active: mockClients.filter((c) => c.status === 'active').length,
    totalValue: mockClients.reduce((sum, c) => sum + c.totalValue, 0),
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
                {client.projectCount} project{client.projectCount !== 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 12, color: '#00F0FF' }}>
                {formatCurrency(client.totalValue)}
              </div>
            </div>

            {/* Last Active */}
            <div style={{ fontSize: 13, color: '#888' }}>
              {formatDate(client.lastActive)}
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
              Try adjusting your filters or add a new client
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .client-row:hover {
          background: rgba(0, 240, 255, 0.03) !important;
        }
      `}</style>
    </div>
  )
}
