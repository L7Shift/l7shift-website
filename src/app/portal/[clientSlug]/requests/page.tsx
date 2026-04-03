'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug } from '@/lib/portal-utils'
import { getClientConfig } from '@/lib/client-portal-config'

interface ClientRequest {
  id: string
  project_id: string
  title: string
  description: string | null
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'open' | 'in_review' | 'accepted' | 'in_progress' | 'completed' | 'declined' | 'withdrawn'
  requested_by: string
  requested_by_type: string
  attachments: string[]
  response_notes: string | null
  responded_at: string | null
  created_at: string
  updated_at: string
}

type FilterType = 'all' | 'open' | 'in_progress' | 'completed'

const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
  urgent: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', border: 'rgba(239,68,68,0.4)' },
  high: { bg: 'rgba(249,115,22,0.15)', text: '#F97316', border: 'rgba(249,115,22,0.4)' },
  normal: { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6', border: 'rgba(59,130,246,0.4)' },
  low: { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF', border: 'rgba(156,163,175,0.4)' },
}

const statusLabels: Record<string, string> = {
  open: 'Open',
  in_review: 'In Review',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
}

const statusColors: Record<string, { bg: string; text: string }> = {
  open: { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
  in_review: { bg: 'rgba(168,85,247,0.15)', text: '#A855F7' },
  accepted: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  in_progress: { bg: 'rgba(234,179,8,0.15)', text: '#EAB308' },
  completed: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  declined: { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF' },
  withdrawn: { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF' },
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

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

// ─── Request Submit Modal ─────────────────────────────────────
function RequestSubmitModal({
  projectId,
  clientName,
  primaryColor,
  onClose,
  onSubmitted,
}: {
  projectId: string
  clientName: string
  primaryColor: string
  onClose: () => void
  onSubmitted: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit() {
    if (!title.trim()) return
    setSubmitting(true)

    try {
      // Upload files first
      const uploadedPaths: string[] = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)
        formData.append('category', 'request')
        const uploadRes = await fetch('/api/assets', { method: 'POST', body: formData })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          uploadedPaths.push(uploadData.file?.path || file.name)
        }
      }

      const res = await fetch('/api/client/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title: title.trim(),
          description: description.trim() || null,
          priority,
          clientName,
          attachments: uploadedPaths,
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
      console.error('Error submitting request:', err)
    } finally {
      setSubmitting(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const priorityOptions: Array<{ value: 'low' | 'normal' | 'high' | 'urgent'; label: string }> = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 560,
        background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: 28, maxHeight: '90vh', overflowY: 'auto',
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
            <h3 style={{ color: '#FAFAFA', fontSize: 18, margin: '0 0 8px' }}>Request Submitted!</h3>
            <p style={{ color: '#888', fontSize: 13 }}>We&apos;ll review your request and follow up soon.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ color: '#FAFAFA', fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>Submit a Request</h3>
                <p style={{ color: '#888', fontSize: 13, margin: 0 }}>Feature ideas, enhancements, or changes you&apos;d like to see</p>
              </div>
              <button onClick={onClose} style={{
                background: 'none', border: 'none', color: '#666', fontSize: 20, cursor: 'pointer', padding: 4,
              }}>x</button>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>
                What would you like? *
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Add a way to track order status"
                style={{
                  width: '100%', padding: 12, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FAFAFA',
                  fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>
                Tell us more (optional)
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what you're looking for, why it would help, or how you'd like it to work..."
                style={{
                  width: '100%', minHeight: 100, padding: 12, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FAFAFA',
                  fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Priority */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>
                How important is this?
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {priorityOptions.map(opt => {
                  const pc = priorityColors[opt.value]
                  const isActive = priority === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setPriority(opt.value)}
                      style={{
                        padding: '8px 16px',
                        background: isActive ? pc.bg : 'transparent',
                        border: `1px solid ${isActive ? pc.border : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8,
                        color: isActive ? pc.text : '#666',
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* File Upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>
                Attachments (optional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  borderRadius: 10,
                  color: '#888',
                  fontSize: 13,
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>📎</span>
                Upload screenshots, mockups, or documents
              </button>
              {files.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {files.map((file, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 10px', background: 'rgba(255,255,255,0.05)',
                      borderRadius: 6, fontSize: 12,
                    }}>
                      <span style={{ color: '#CCC' }}>{file.name}</span>
                      <button
                        onClick={() => removeFile(i)}
                        style={{
                          background: 'none', border: 'none', color: '#666',
                          cursor: 'pointer', fontSize: 14, padding: '0 4px',
                        }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !title.trim()}
              style={{
                width: '100%', padding: '14px 24px',
                background: submitting || !title.trim()
                  ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${primaryColor}, #FF00AA)`,
                border: 'none', borderRadius: 10, color: '#fff', fontSize: 14,
                fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function RequestsPage() {
  const params = useParams()
  const clientSlug = params.clientSlug as string
  const config = getClientConfig(clientSlug)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [requests, setRequests] = useState<ClientRequest[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [userName, setUserName] = useState('Client')

  useEffect(() => {
    const name = getCookie('l7_user_name')
    if (name) setUserName(decodeURIComponent(name))
  }, [])

  useEffect(() => { loadRequests() }, [clientSlug])

  async function loadRequests() {
    setLoading(true)
    setError(null)
    try {
      const projectData = await getProjectBySlug(clientSlug)
      if (!projectData) { setError('Project not found'); setLoading(false); return }
      setProjectId(projectData.project.id)
      const res = await fetch(`/api/client/request?projectId=${projectData.project.id}`)
      const data = await res.json()
      setRequests(data.requests || [])
    } catch (err) {
      console.error('Error loading requests:', err)
      setError('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true
    if (filter === 'open') return r.status === 'open'
    if (filter === 'in_progress') return r.status === 'in_review' || r.status === 'accepted' || r.status === 'in_progress'
    if (filter === 'completed') return r.status === 'completed' || r.status === 'declined'
    return true
  })

  const openCount = requests.filter(r => r.status === 'open').length

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: config.primaryColor, borderRadius: '50%',
          margin: '0 auto 16px', animation: 'spin 1s linear infinite',
        }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#888', fontSize: 14 }}>Loading requests...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <h2 style={{ color: '#FAFAFA', fontSize: 20, marginBottom: 8 }}>{error}</h2>
        <Link href={`/portal/${clientSlug}`} style={{ color: config.primaryColor, textDecoration: 'none', fontSize: 14 }}>
          Return to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Modal */}
      {showSubmitForm && projectId && (
        <RequestSubmitModal
          projectId={projectId}
          clientName={userName}
          primaryColor={config.primaryColor}
          onClose={() => setShowSubmitForm(false)}
          onSubmitted={() => loadRequests()}
        />
      )}

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 32, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 28, fontWeight: 700, color: '#FAFAFA',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
            Requests
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            Submit feature ideas, enhancements, or changes
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {openCount > 0 && (
            <div style={{
              padding: '10px 16px', background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ color: '#3B82F6', fontSize: 13, fontWeight: 600 }}>
                {openCount} open
              </span>
            </div>
          )}
          <button
            onClick={() => setShowSubmitForm(true)}
            style={{
              padding: '10px 20px',
              background: `linear-gradient(135deg, ${config.primaryColor}, #FF00AA)`,
              border: 'none', borderRadius: 8, color: '#0A0A0A',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            + New Request
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {([
          { key: 'all' as FilterType, label: 'All' },
          { key: 'open' as FilterType, label: 'Open' },
          { key: 'in_progress' as FilterType, label: 'In Progress' },
          { key: 'completed' as FilterType, label: 'Completed' },
        ]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 16px',
              background: filter === f.key ? `${config.primaryColor}18` : 'transparent',
              border: `1px solid ${filter === f.key ? `${config.primaryColor}44` : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 6, color: filter === f.key ? config.primaryColor : '#888',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#666' }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>
            {requests.length === 0 ? '💡' : '📭'}
          </span>
          <p style={{ fontSize: 15 }}>
            {requests.length === 0 ? 'No requests yet' : 'No requests match this filter'}
          </p>
          {requests.length === 0 && (
            <p style={{ fontSize: 13, color: '#555' }}>
              Have an idea or enhancement? Click &quot;New Request&quot; to let us know.
            </p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredRequests.map(request => {
            const pc = priorityColors[request.priority]
            const stc = statusColors[request.status]
            const isExpanded = expandedRequest === request.id

            return (
              <div
                key={request.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: request.priority === 'urgent'
                    ? '1px solid rgba(239,68,68,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, overflow: 'hidden',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Main row */}
                <div
                  onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                  style={{ padding: '16px 20px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        {/* Priority badge */}
                        <span style={{
                          padding: '3px 8px', background: pc.bg, border: `1px solid ${pc.border}`,
                          borderRadius: 4, color: pc.text, fontSize: 10, fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          {request.priority}
                        </span>
                        {/* Status */}
                        <span style={{
                          padding: '3px 8px', background: stc.bg, borderRadius: 4,
                          color: stc.text, fontSize: 10, fontWeight: 600,
                        }}>
                          {statusLabels[request.status]}
                        </span>
                      </div>
                      <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#FAFAFA' }}>
                        {request.title}
                      </h3>
                      {request.description && (
                        <p style={{ margin: 0, fontSize: 13, color: '#777', lineHeight: 1.4 }}>
                          {request.description.length > 120 && !isExpanded
                            ? request.description.substring(0, 120) + '...'
                            : request.description}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: '#555' }}>{formatDate(request.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{
                    padding: '0 20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    {/* Full description */}
                    {request.description && request.description.length > 120 && (
                      <div style={{ padding: '12px 0' }}>
                        <p style={{ margin: 0, fontSize: 13, color: '#CCC', lineHeight: 1.5 }}>
                          {request.description}
                        </p>
                      </div>
                    )}

                    {/* Response notes */}
                    {request.response_notes && (
                      <div style={{
                        margin: '8px 0', padding: 12, background: 'rgba(34,197,94,0.08)',
                        border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>Response from L7 Shift</span>
                          {request.responded_at && (
                            <span style={{ fontSize: 10, color: '#555' }}>{formatDate(request.responded_at)}</span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: '#CCC', lineHeight: 1.4 }}>{request.response_notes}</p>
                      </div>
                    )}

                    {/* Attachments */}
                    {request.attachments && request.attachments.length > 0 && (
                      <div style={{ margin: '8px 0' }}>
                        <span style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>Attachments:</span>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                          {request.attachments.map((path, i) => (
                            <span key={i} style={{
                              padding: '4px 8px', background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
                              fontSize: 11, color: '#AAA',
                            }}>
                              📎 {path.split('/').pop()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submitted by + actions */}
                    <div style={{ paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#555' }}>
                        Submitted by {request.requested_by} on {new Date(request.created_at).toLocaleDateString()}
                      </span>
                      {request.status === 'open' && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            if (!confirm('Withdraw this request? This cannot be undone.')) return
                            try {
                              const res = await fetch('/api/client/request', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ requestId: request.id, status: 'withdrawn' }),
                              })
                              if (res.ok) loadRequests()
                            } catch (err) {
                              console.error('Error withdrawing request:', err)
                            }
                          }}
                          style={{
                            padding: '6px 12px', background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6,
                            color: '#EF4444', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                          }}
                        >
                          Withdraw Request
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
