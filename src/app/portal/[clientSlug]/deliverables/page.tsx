'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { StatusPill } from '@/components/dashboard'

// Mock deliverables data
const mockDeliverables = [
  {
    id: '1',
    name: 'Homepage Design v2',
    type: 'design',
    thumbnail: null,
    status: 'in_review' as const,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    version: 2,
    description: 'Updated homepage with new hero section and improved mobile layout',
  },
  {
    id: '2',
    name: 'Brand Style Guide',
    type: 'document',
    thumbnail: null,
    status: 'approved' as const,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    version: 1,
    description: 'Complete brand guidelines including colors, typography, and logo usage',
  },
  {
    id: '3',
    name: 'Customer Portal Prototype',
    type: 'prototype',
    thumbnail: null,
    status: 'approved' as const,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    version: 1,
    description: 'Interactive prototype of the customer-facing portal',
  },
  {
    id: '4',
    name: 'Admin Dashboard Wireframes',
    type: 'design',
    thumbnail: null,
    status: 'pending' as const,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 30),
    version: 1,
    description: 'Low-fidelity wireframes for the admin dashboard',
  },
]

const typeIcons: Record<string, string> = {
  design: '🎨',
  document: '📄',
  prototype: '🔗',
  code: '💻',
}

const typeColors: Record<string, string> = {
  design: '#FF00AA',
  document: '#00F0FF',
  prototype: '#BFFF00',
  code: '#FFAA00',
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

export default function DeliverablesPage() {
  const params = useParams()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  const filteredDeliverables = mockDeliverables.filter((d) => {
    if (filter === 'all') return true
    if (filter === 'pending') return d.status === 'in_review' || d.status === 'pending'
    if (filter === 'approved') return d.status === 'approved'
    return true
  })

  const pendingCount = mockDeliverables.filter(d => d.status === 'in_review' || d.status === 'pending').length

  return (
    <div>
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
            Deliverables
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            Review and approve project deliverables
          </p>
        </div>

        {pendingCount > 0 && (
          <div
            style={{
              padding: '12px 20px',
              background: 'rgba(255, 0, 170, 0.1)',
              border: '1px solid rgba(255, 0, 170, 0.3)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 20 }}>👀</span>
            <span style={{ color: '#FF00AA', fontSize: 14, fontWeight: 600 }}>
              {pendingCount} awaiting your review
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              background: filter === f ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
              border: filter === f ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              color: filter === f ? '#00F0FF' : '#888',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {f === 'pending' ? 'Needs Review' : f}
          </button>
        ))}
      </div>

      {/* Deliverables Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        {filteredDeliverables.map((deliverable) => (
          <div
            key={deliverable.id}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: deliverable.status === 'in_review'
                ? '1px solid rgba(255, 0, 170, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            {/* Thumbnail / Icon Area */}
            <div
              style={{
                height: 140,
                background: `linear-gradient(135deg, ${typeColors[deliverable.type]}22, ${typeColors[deliverable.type]}11)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ fontSize: 48 }}>{typeIcons[deliverable.type]}</span>
            </div>

            {/* Content */}
            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#FAFAFA',
                  }}
                >
                  {deliverable.name}
                </h3>
                <StatusPill
                  status={deliverable.status === 'in_review' ? 'review' : deliverable.status}
                  size="sm"
                />
              </div>

              <p
                style={{
                  margin: '0 0 16px',
                  fontSize: 13,
                  color: '#888',
                  lineHeight: 1.5,
                }}
              >
                {deliverable.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <span style={{ fontSize: 11, color: '#666' }}>
                  v{deliverable.version} • {formatDate(deliverable.uploadedAt)}
                </span>

                {(deliverable.status === 'in_review' || deliverable.status === 'pending') && (
                  <button
                    style={{
                      padding: '6px 14px',
                      background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                      border: 'none',
                      borderRadius: 6,
                      color: '#0A0A0A',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Review →
                  </button>
                )}

                {deliverable.status === 'approved' && (
                  <button
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: 6,
                      color: '#888',
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDeliverables.length === 0 && (
        <div
          style={{
            padding: 60,
            textAlign: 'center',
            color: '#666',
          }}
        >
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📭</span>
          <p style={{ fontSize: 15 }}>No deliverables found</p>
        </div>
      )}
    </div>
  )
}
