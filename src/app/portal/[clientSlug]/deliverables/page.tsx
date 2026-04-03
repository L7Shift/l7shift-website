'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { StatusPill } from '@/components/dashboard'
import {
  getProjectBySlug,
  getProjectDeliverables,
  approveDeliverable,
} from '@/lib/portal-utils'
import { getClientConfig } from '@/lib/client-portal-config'
import type { Deliverable, DeliverableStatus } from '@/lib/database.types'

const typeIcons: Record<string, string> = {
  design: '🎨',
  document: '📄',
  prototype: '🔗',
  code: '💻',
  image: '🖼️',
  video: '🎬',
}

const typeColors: Record<string, string> = {
  design: '#FF00AA',
  document: '#00F0FF',
  prototype: '#BFFF00',
  code: '#FFAA00',
  image: '#FF6B6B',
  video: '#9B59B6',
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

type StatusPillStatus = 'backlog' | 'active' | 'review' | 'shipped' | 'pending' | 'approved' | 'rejected' | 'draft' | 'implemented' | 'on_hold' | 'completed' | 'cancelled'

function getStatusForPill(status: DeliverableStatus): StatusPillStatus {
  if (status === 'in_review') return 'review'
  if (status === 'uploaded') return 'pending'
  return status as StatusPillStatus
}

// Feedback modal with screenshot upload
function FeedbackModal({
  deliverable,
  clientId,
  projectId,
  onClose,
  onSubmitted,
  primaryColor,
}: {
  deliverable: Deliverable
  clientId: string
  projectId: string
  onClose: () => void
  onSubmitted: () => void
  primaryColor: string
}) {
  const [content, setContent] = useState('')
  const [screenshots, setScreenshots] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    setScreenshots(prev => [...prev, ...imageFiles])

    // Generate previews
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreviews(prev => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeScreenshot(index: number) {
    setScreenshots(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    if (!content.trim() && screenshots.length === 0) return

    setSubmitting(true)
    try {
      // Upload screenshots first if any
      const uploadedPaths: string[] = []
      for (const file of screenshots) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)
        formData.append('category', 'feedback')
        formData.append('description', `Feedback on: ${deliverable.name}`)

        const uploadRes = await fetch('/api/assets', { method: 'POST', body: formData })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          uploadedPaths.push(uploadData.file?.path || file.name)
        }
      }

      // Build feedback content with screenshot references
      let feedbackContent = content.trim()
      if (uploadedPaths.length > 0) {
        feedbackContent += `\n\n[Screenshots attached: ${uploadedPaths.length} file(s)]`
        uploadedPaths.forEach((p, i) => {
          feedbackContent += `\n- Screenshot ${i + 1}: ${p}`
        })
      }

      // Submit feedback
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliverable_id: deliverable.id,
          client_id: clientId,
          content: feedbackContent,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onSubmitted()
          onClose()
        }, 1500)
      }
    } catch (err) {
      console.error('Error submitting feedback:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 520,
        background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: 28, maxHeight: '90vh', overflowY: 'auto',
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h3 style={{ color: '#FAFAFA', fontSize: 18, margin: '0 0 8px' }}>Feedback Sent!</h3>
            <p style={{ color: '#888', fontSize: 13 }}>We'll review your feedback and get back to you.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ color: '#FAFAFA', fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>
                  Give Feedback
                </h3>
                <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
                  on: {deliverable.name}
                </p>
              </div>
              <button onClick={onClose} style={{
                background: 'none', border: 'none', color: '#666', fontSize: 20, cursor: 'pointer', padding: 4,
              }}>×</button>
            </div>

            {/* Text feedback */}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What changes would you like? Be specific about what you want different..."
              style={{
                width: '100%', minHeight: 120, padding: 14, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FAFAFA',
                fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />

            {/* Screenshot upload */}
            <div style={{ marginTop: 16 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '2px dashed rgba(255,255,255,0.12)',
                  borderRadius: 10, color: '#888', fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: 18 }}>📸</span>
                Take or upload a screenshot
              </button>
            </div>

            {/* Screenshot previews */}
            {previews.length > 0 && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: 10, marginTop: 12,
              }}>
                {previews.map((preview, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                    <img src={preview} alt={`Screenshot ${i + 1}`} style={{
                      width: '100%', height: 80, objectFit: 'cover', display: 'block',
                    }} />
                    <button onClick={() => removeScreenshot(i)} style={{
                      position: 'absolute', top: 4, right: 4, width: 20, height: 20,
                      background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                      color: 'white', fontSize: 12, cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || (!content.trim() && screenshots.length === 0)}
              style={{
                width: '100%', marginTop: 20, padding: '14px 24px',
                background: submitting || (!content.trim() && screenshots.length === 0)
                  ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${primaryColor}, #FF00AA)`,
                border: 'none', borderRadius: 10, color: '#fff', fontSize: 14,
                fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {submitting ? 'Sending...' : `Send Feedback${screenshots.length > 0 ? ` (${screenshots.length} screenshot${screenshots.length > 1 ? 's' : ''})` : ''}`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function DeliverablesPage() {
  const params = useParams()
  const clientSlug = params.clientSlug as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [clientId, setClientId] = useState<string | null>(null)
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [feedbackTarget, setFeedbackTarget] = useState<Deliverable | null>(null)

  const config = getClientConfig(clientSlug)

  useEffect(() => {
    loadData()
  }, [clientSlug])

  async function loadData() {
    setLoading(true)
    setError(null)

    try {
      const projectData = await getProjectBySlug(clientSlug)
      if (!projectData) {
        setError('Project not found')
        setLoading(false)
        return
      }

      setProjectId(projectData.project.id)
      setClientId(projectData.project.client_id)

      const items = await getProjectDeliverables(projectData.project.id)
      setDeliverables(items)
    } catch (err) {
      console.error('Error loading deliverables:', err)
      setError('Failed to load deliverables')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(deliverableId: string) {
    if (!projectId) return

    setApprovingId(deliverableId)
    try {
      const success = await approveDeliverable(deliverableId, 'Client')
      if (success) {
        await loadData()
      }
    } catch (err) {
      console.error('Error approving deliverable:', err)
    } finally {
      setApprovingId(null)
    }
  }

  const filteredDeliverables = deliverables.filter((d) => {
    if (filter === 'all') return true
    if (filter === 'pending') return d.status === 'in_review' || d.status === 'pending'
    if (filter === 'approved') return d.status === 'approved'
    return true
  })

  const pendingCount = deliverables.filter(d => d.status === 'in_review' || d.status === 'pending').length

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: config.primaryColor,
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: '#888', fontSize: 14 }}>Loading deliverables...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <h2 style={{ color: '#FAFAFA', fontSize: 20, marginBottom: 8 }}>{error}</h2>
        <Link
          href={`/portal/${clientSlug}`}
          style={{ color: config.primaryColor, textDecoration: 'none', fontSize: 14 }}
        >
          Return to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Feedback Modal */}
      {feedbackTarget && projectId && clientId && (
        <FeedbackModal
          deliverable={feedbackTarget}
          clientId={clientId}
          projectId={projectId}
          onClose={() => setFeedbackTarget(null)}
          onSubmitted={() => loadData()}
          primaryColor={config.primaryColor}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 12,
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
            Review, approve, or give feedback on project deliverables
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
          flexWrap: 'wrap',
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
      {filteredDeliverables.length === 0 ? (
        <div
          style={{
            padding: 60,
            textAlign: 'center',
            color: '#666',
          }}
        >
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📭</span>
          <p style={{ fontSize: 15 }}>
            {deliverables.length === 0
              ? 'No deliverables yet'
              : 'No deliverables found for this filter'}
          </p>
          {deliverables.length === 0 && (
            <p style={{ fontSize: 13, color: '#555' }}>
              Deliverables will appear here as we complete work on your project.
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {filteredDeliverables.map((deliverable) => {
            const typeColor = typeColors[deliverable.type] || '#888'
            const typeIcon = typeIcons[deliverable.type] || '📁'

            return (
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
                }}
              >
                {/* Thumbnail / Icon Area */}
                <div
                  style={{
                    height: 140,
                    background: deliverable.thumbnail_url
                      ? `url(${deliverable.thumbnail_url}) center/cover`
                      : `linear-gradient(135deg, ${typeColor}22, ${typeColor}11)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {!deliverable.thumbnail_url && (
                    <span style={{ fontSize: 48 }}>{typeIcon}</span>
                  )}
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
                      status={getStatusForPill(deliverable.status)}
                      size="sm"
                    />
                  </div>

                  {deliverable.description && (
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
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: 12,
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#666' }}>
                      v{deliverable.version} • {formatDate(deliverable.uploaded_at)}
                    </span>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Feedback button */}
                      <button
                        onClick={() => setFeedbackTarget(deliverable)}
                        style={{
                          padding: '6px 14px',
                          background: 'rgba(255, 170, 0, 0.1)',
                          border: '1px solid rgba(255, 170, 0, 0.3)',
                          borderRadius: 6,
                          color: '#FFAA00',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        💬 Feedback
                      </button>

                      {deliverable.url && (
                        <a
                          href={deliverable.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '6px 14px',
                            background: `${typeColor}22`,
                            border: `1px solid ${typeColor}44`,
                            borderRadius: 6,
                            color: typeColor,
                            fontSize: 11,
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          Download
                        </a>
                      )}

                      {(deliverable.status === 'in_review' || deliverable.status === 'pending') && (
                        <button
                          onClick={() => handleApprove(deliverable.id)}
                          disabled={approvingId === deliverable.id}
                          style={{
                            padding: '6px 14px',
                            background: approvingId === deliverable.id
                              ? 'rgba(0, 240, 255, 0.3)'
                              : 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                            border: 'none',
                            borderRadius: 6,
                            color: '#0A0A0A',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: approvingId === deliverable.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {approvingId === deliverable.id ? 'Approving...' : 'Approve'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
