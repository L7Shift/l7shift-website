'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug } from '@/lib/portal-utils'
import { getClientConfig } from '@/lib/client-portal-config'

interface BugNote {
  author: string
  content: string
  created_at: string
}

interface BugReport {
  id: string
  project_id: string
  bug_number: string
  title: string
  description: string
  url: string | null
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'reported' | 'triaged' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix'
  reported_by: string
  screenshot_paths: string[] | null
  ai_analysis: {
    root_causes?: string[]
    affected_areas?: string[]
    estimated_effort?: string
    recommended_priority?: string
  } | null
  task_id: string | null
  resolution_notes: string | null
  notes: BugNote[]
  created_at: string
  updated_at: string
  resolved_at: string | null
}

type FilterType = 'all' | 'reported' | 'in_progress' | 'resolved'

const severityColors: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', border: 'rgba(239,68,68,0.4)' },
  high: { bg: 'rgba(249,115,22,0.15)', text: '#F97316', border: 'rgba(249,115,22,0.4)' },
  medium: { bg: 'rgba(234,179,8,0.15)', text: '#EAB308', border: 'rgba(234,179,8,0.4)' },
  low: { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF', border: 'rgba(156,163,175,0.4)' },
}

const statusLabels: Record<string, string> = {
  reported: 'Reported',
  triaged: 'Triaged',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  wont_fix: "Won't Fix",
}

const statusColors: Record<string, { bg: string; text: string }> = {
  reported: { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
  triaged: { bg: 'rgba(168,85,247,0.15)', text: '#A855F7' },
  in_progress: { bg: 'rgba(234,179,8,0.15)', text: '#EAB308' },
  resolved: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  closed: { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF' },
  wont_fix: { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF' },
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

// ─── Bug Submit Modal ───────────────────────────────────────
function BugSubmitModal({
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
  const [url, setUrl] = useState('')
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium')
  const [screenshots, setScreenshots] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setScreenshots(prev => [...prev, ...files])
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (ev) => setPreviews(prev => [...prev, ev.target?.result as string])
        reader.readAsDataURL(file)
      } else {
        setPreviews(prev => [...prev, ''])
      }
    })
  }

  function removeScreenshot(index: number) {
    setScreenshots(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) return
    setSubmitting(true)

    try {
      // Upload screenshots first
      const uploadedPaths: string[] = []
      for (const file of screenshots) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)
        formData.append('category', 'bugs')
        formData.append('description', `Bug screenshot: ${title}`)
        const uploadRes = await fetch('/api/assets', { method: 'POST', body: formData })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          uploadedPaths.push(uploadData.file?.path || file.name)
        }
      }

      const res = await fetch('/api/client/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title: title.trim(),
          description: description.trim(),
          url: url.trim() || null,
          severity,
          clientName,
          screenshotPaths: uploadedPaths.length > 0 ? uploadedPaths : null,
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
      console.error('Error submitting bug:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const severityOptions: Array<{ value: 'low' | 'medium' | 'high' | 'critical'; label: string }> = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
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
            <div style={{ fontSize: 48, marginBottom: 12 }}>🐛</div>
            <h3 style={{ color: '#FAFAFA', fontSize: 18, margin: '0 0 8px' }}>Bug Reported!</h3>
            <p style={{ color: '#888', fontSize: 13 }}>We&apos;ll investigate and update you on progress.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ color: '#FAFAFA', fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>Report a Bug</h3>
                <p style={{ color: '#888', fontSize: 13, margin: 0 }}>Tell us what&apos;s broken and we&apos;ll fix it</p>
              </div>
              <button onClick={onClose} style={{
                background: 'none', border: 'none', color: '#666', fontSize: 20, cursor: 'pointer', padding: 4,
              }}>x</button>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>
                What&apos;s the issue? *
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Checkout page not loading on mobile"
                style={{
                  width: '100%', padding: 12, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FAFAFA',
                  fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* URL */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 }}>
                Page URL where it happens
              </label>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://yoursite.com/broken-page"
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
                Describe the issue *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What happened? What did you expect to happen? Steps to reproduce..."
                style={{
                  width: '100%', minHeight: 100, padding: 12, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FAFAFA',
                  fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Severity */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>
                Severity
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {severityOptions.map(opt => {
                  const sc = severityColors[opt.value]
                  const isActive = severity === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSeverity(opt.value)}
                      style={{
                        padding: '8px 16px',
                        background: isActive ? sc.bg : 'transparent',
                        border: `1px solid ${isActive ? sc.border : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8,
                        color: isActive ? sc.text : '#666',
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

            {/* Screenshots / attachments */}
            <div style={{ marginBottom: 20 }}>
              <input ref={fileInputRef} type="file" accept="image/*,.pdf,.zip,.svg,.ai,.psd,.eps" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '2px dashed rgba(255,255,255,0.12)',
                  borderRadius: 10, color: '#888', fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>📎</span>
                Add screenshots or files
              </button>
              {previews.length > 0 && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: 8, marginTop: 10,
                }}>
                  {previews.map((preview, i) => {
                    const file = screenshots[i]
                    return (
                      <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                        {preview ? (
                          <img src={preview} alt={`Screenshot ${i + 1}`} style={{
                            width: '100%', height: 60, objectFit: 'cover', display: 'block',
                          }} />
                        ) : (
                          <div style={{
                            width: '100%', height: 60,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 1,
                            fontSize: 9, color: '#888', padding: 2, boxSizing: 'border-box',
                          }}>
                            <span style={{ fontSize: 16 }}>📄</span>
                            <span style={{
                              maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>{file?.name}</span>
                          </div>
                        )}
                        <button onClick={() => removeScreenshot(i)} style={{
                          position: 'absolute', top: 2, right: 2, width: 18, height: 18,
                          background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                          color: 'white', fontSize: 10, cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>x</button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !description.trim()}
              style={{
                width: '100%', padding: '14px 24px',
                background: submitting || !title.trim() || !description.trim()
                  ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${primaryColor}, #FF00AA)`,
                border: 'none', borderRadius: 10, color: '#fff', fontSize: 14,
                fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Bug Report'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Inline Comment Thread ──────────────────────────────────
function CommentThread({
  bug,
  clientName,
  reportedBy,
  primaryColor,
  onCommentAdded,
}: {
  bug: BugReport
  clientName: string
  reportedBy: string
  primaryColor: string
  onCommentAdded: () => void
}) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const threadEndRef = useRef<HTMLDivElement>(null)

  function isClientNote(author: string): boolean {
    const authorLower = author.toLowerCase()
    const clientLower = clientName.toLowerCase()
    const reporterLower = reportedBy.toLowerCase()
    return authorLower === clientLower || authorLower === reporterLower || authorLower === 'client'
  }

  async function handleSend() {
    if (!content.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/client/bugs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bugId: bug.id,
          note: { author: clientName, content: content.trim() },
        }),
      })
      if (res.ok) {
        setContent('')
        onCommentAdded()
      }
    } catch (err) {
      console.error('Error sending comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bug.notes])

  const notes = bug.notes || []

  return (
    <div style={{ margin: '12px 0 0' }}>
      <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginBottom: 10 }}>
        Conversation {notes.length > 0 && `(${notes.length})`}
      </div>

      {/* Thread messages */}
      {notes.length > 0 ? (
        <div style={{
          maxHeight: 320, overflowY: 'auto', marginBottom: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
          paddingRight: 4,
        }}>
          {notes.map((note, i) => {
            const fromClient = isClientNote(note.author)
            return (
              <div
                key={i}
                style={{
                  maxWidth: '85%',
                  alignSelf: fromClient ? 'flex-start' : 'flex-end',
                }}
              >
                <div style={{
                  padding: '10px 14px',
                  background: fromClient
                    ? 'rgba(168,85,247,0.12)'
                    : 'rgba(34,211,238,0.10)',
                  border: `1px solid ${fromClient ? 'rgba(168,85,247,0.25)' : 'rgba(34,211,238,0.20)'}`,
                  borderRadius: fromClient ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: 12, marginBottom: 4,
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: fromClient ? '#A855F7' : '#22D3EE',
                    }}>
                      {note.author}
                    </span>
                    <span style={{ fontSize: 10, color: '#555', flexShrink: 0 }}>
                      {formatDate(note.created_at)}
                    </span>
                  </div>
                  <p style={{
                    margin: 0, fontSize: 13, color: '#DDD', lineHeight: 1.5,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {note.content}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={threadEndRef} />
        </div>
      ) : (
        <div style={{
          padding: '16px 0', textAlign: 'center',
          color: '#555', fontSize: 12, marginBottom: 12,
        }}>
          No comments yet. Start the conversation below.
        </div>
      )}

      {/* Input area */}
      <div
        style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
        }}
        onClick={e => e.stopPropagation()}
      >
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a comment..."
          style={{
            flex: 1, padding: '10px 14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, color: '#FAFAFA', fontSize: 13,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSend}
          disabled={submitting || !content.trim()}
          style={{
            padding: '10px 18px',
            background: submitting || !content.trim()
              ? 'rgba(255,255,255,0.08)'
              : primaryColor,
            border: 'none', borderRadius: 10,
            color: submitting || !content.trim() ? '#555' : '#0A0A0A',
            fontSize: 13, fontWeight: 600,
            cursor: submitting || !content.trim() ? 'default' : 'pointer',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          {submitting ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function BugsPage() {
  const params = useParams()
  const clientSlug = params.clientSlug as string
  const config = getClientConfig(clientSlug)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [bugs, setBugs] = useState<BugReport[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [expandedBug, setExpandedBug] = useState<string | null>(null)
  const [userName, setUserName] = useState('Client')

  useEffect(() => {
    const name = getCookie('l7_user_name')
    if (name) setUserName(decodeURIComponent(name))
  }, [])

  useEffect(() => { loadBugs() }, [clientSlug])

  async function loadBugs() {
    setLoading(true)
    setError(null)
    try {
      const projectData = await getProjectBySlug(clientSlug)
      if (!projectData) { setError('Project not found'); setLoading(false); return }
      setProjectId(projectData.project.id)
      const res = await fetch(`/api/client/bugs?projectId=${projectData.project.id}`)
      const data = await res.json()
      setBugs(data.bugs || [])
    } catch (err) {
      console.error('Error loading bugs:', err)
      setError('Failed to load bugs')
    } finally {
      setLoading(false)
    }
  }

  const filteredBugs = bugs.filter(b => {
    if (filter === 'all') return b.status !== 'resolved' && b.status !== 'closed' && b.status !== 'wont_fix'
    if (filter === 'reported') return b.status === 'reported'
    if (filter === 'in_progress') return b.status === 'triaged' || b.status === 'in_progress'
    if (filter === 'resolved') return b.status === 'resolved' || b.status === 'closed' || b.status === 'wont_fix'
    return true
  })

  const openCount = bugs.filter(b => b.status !== 'resolved' && b.status !== 'closed' && b.status !== 'wont_fix').length

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: config.primaryColor, borderRadius: '50%',
          margin: '0 auto 16px', animation: 'spin 1s linear infinite',
        }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#888', fontSize: 14 }}>Loading bugs...</p>
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
      {/* Modals */}
      {showSubmitForm && projectId && (
        <BugSubmitModal
          projectId={projectId}
          clientName={userName}
          primaryColor={config.primaryColor}
          onClose={() => setShowSubmitForm(false)}
          onSubmitted={() => loadBugs()}
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
            Bug Reports
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            Report issues and track their resolution
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {openCount > 0 && (
            <div style={{
              padding: '10px 16px', background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 16 }}>🐛</span>
              <span style={{ color: '#EF4444', fontSize: 13, fontWeight: 600 }}>
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
            + Report Bug
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {([
          { key: 'all' as FilterType, label: 'Active' },
          { key: 'reported' as FilterType, label: 'Reported' },
          { key: 'in_progress' as FilterType, label: 'In Progress' },
          { key: 'resolved' as FilterType, label: 'Shipped' },
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

      {/* Bug List */}
      {filteredBugs.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#666' }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>
            {bugs.length === 0 ? '🎉' : '📭'}
          </span>
          <p style={{ fontSize: 15 }}>
            {bugs.length === 0 ? 'No bugs reported yet' : 'No bugs match this filter'}
          </p>
          {bugs.length === 0 && (
            <p style={{ fontSize: 13, color: '#555' }}>
              Found something broken? Click &quot;Report Bug&quot; to let us know.
            </p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredBugs.map(bug => {
            const sc = severityColors[bug.severity]
            const stc = statusColors[bug.status]
            const isExpanded = expandedBug === bug.id

            return (
              <div
                key={bug.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: bug.severity === 'critical'
                    ? '1px solid rgba(239,68,68,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, overflow: 'hidden',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Main row */}
                <div
                  onClick={() => setExpandedBug(isExpanded ? null : bug.id)}
                  style={{ padding: '16px 20px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        {/* Bug number badge */}
                        <span style={{
                          padding: '3px 8px', background: `${config.primaryColor}18`,
                          border: `1px solid ${config.primaryColor}33`, borderRadius: 4,
                          color: config.primaryColor, fontSize: 11, fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.02em',
                        }}>
                          {bug.bug_number}
                        </span>
                        {/* Severity */}
                        <span style={{
                          padding: '3px 8px', background: sc.bg, border: `1px solid ${sc.border}`,
                          borderRadius: 4, color: sc.text, fontSize: 10, fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          {bug.severity}
                        </span>
                        {/* Status */}
                        <span style={{
                          padding: '3px 8px', background: stc.bg, borderRadius: 4,
                          color: stc.text, fontSize: 10, fontWeight: 600,
                        }}>
                          {statusLabels[bug.status]}
                        </span>
                      </div>
                      <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#FAFAFA' }}>
                        {bug.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: 13, color: '#777', lineHeight: 1.4 }}>
                        {bug.description.length > 120 && !isExpanded
                          ? bug.description.substring(0, 120) + '...'
                          : bug.description}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: '#555' }}>{formatDate(bug.created_at)}</span>
                      {bug.notes && bug.notes.length > 0 && (
                        <div style={{ marginTop: 4, fontSize: 11, color: '#888' }}>
                          💬 {bug.notes.length} note{bug.notes.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{
                    padding: '0 20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    {/* URL */}
                    {bug.url && (
                      <div style={{ padding: '12px 0 8px' }}>
                        <span style={{ fontSize: 11, color: '#666', marginRight: 8 }}>URL:</span>
                        <a
                          href={bug.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: config.primaryColor, fontSize: 13, textDecoration: 'none' }}
                        >
                          {bug.url}
                        </a>
                      </div>
                    )}

                    {/* Resolution notes */}
                    {bug.resolution_notes && (
                      <div style={{
                        margin: '8px 0', padding: 12, background: 'rgba(34,197,94,0.08)',
                        border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8,
                      }}>
                        <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, marginBottom: 4 }}>Resolution</div>
                        <p style={{ margin: 0, fontSize: 13, color: '#CCC' }}>{bug.resolution_notes}</p>
                      </div>
                    )}

                    {/* Comment thread */}
                    <CommentThread
                      bug={bug}
                      clientName={userName}
                      reportedBy={bug.reported_by}
                      primaryColor={config.primaryColor}
                      onCommentAdded={() => loadBugs()}
                    />
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
