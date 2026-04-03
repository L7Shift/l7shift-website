'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug } from '@/lib/portal-utils'
import { getClientConfig } from '@/lib/client-portal-config'
import { computeWordDiff, stripHtml } from '@/lib/diff'
import type { PlanDocument } from '@/lib/database.types'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'
type ViewMode = 'redline' | 'edit'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function PlanReviewPage() {
  const params = useParams()
  const clientSlug = params.clientSlug as string
  const config = getClientConfig(clientSlug)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [planDoc, setPlanDoc] = useState<PlanDocument | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('redline')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [editContent, setEditContent] = useState('')
  const [userName, setUserName] = useState('Client')

  const editorRef = useRef<HTMLDivElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const name = getCookie('l7_user_name')
    if (name) setUserName(decodeURIComponent(name))
    loadPlan()
  }, [clientSlug])

  // Warn on unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [saveStatus])

  async function loadPlan() {
    setLoading(true)
    setError(null)

    try {
      const projectData = await getProjectBySlug(clientSlug)
      if (!projectData) {
        setError('Project not found')
        setLoading(false)
        return
      }

      const res = await fetch(`/api/plan?project_id=${projectData.project.id}`)
      const json = await res.json()

      if (!json.success || !json.data || json.data.length === 0) {
        setError('No build plan available yet. Check back soon.')
        setLoading(false)
        return
      }

      const doc = json.data[0] as PlanDocument
      setPlanDoc(doc)
      setEditContent(doc.current_content)
    } catch (err) {
      console.error('Error loading plan:', err)
      setError('Failed to load build plan')
    } finally {
      setLoading(false)
    }
  }

  const savePlan = useCallback(async (content: string) => {
    if (!planDoc) return

    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/plan/${planDoc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_content: content,
          last_edited_by: userName,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setPlanDoc(json.data)
        }
        setSaveStatus('saved')
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    }
  }, [planDoc, userName])

  function handleInput() {
    if (!editorRef.current) return
    const newContent = editorRef.current.innerHTML
    setEditContent(newContent)
    setSaveStatus('unsaved')

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => savePlan(newContent), 2500)
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  function toggleMode(mode: ViewMode) {
    if (viewMode === 'edit' && mode === 'redline') {
      // Switching from edit to redline — capture current content
      if (editorRef.current) {
        const content = editorRef.current.innerHTML
        setEditContent(content)
        // Force save before switching
        if (saveStatus === 'unsaved') {
          savePlan(content)
        }
      }
    }
    setViewMode(mode)
  }

  async function submitForApproval() {
    if (!planDoc) return
    setSaveStatus('saving')

    // Save any pending edits first
    if (editorRef.current && viewMode === 'edit') {
      await savePlan(editorRef.current.innerHTML)
    }

    try {
      const res = await fetch(`/api/plan/${planDoc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          last_edited_by: userName,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        setPlanDoc(json.data)
        setSaveStatus('saved')
      }
    } catch {
      setSaveStatus('error')
    }
  }

  // Render the diff between original and current
  function renderRedline(): string {
    if (!planDoc) return ''

    const originalText = stripHtml(planDoc.original_content)
    const currentText = stripHtml(editContent || planDoc.current_content)

    if (originalText === currentText) {
      return planDoc.current_content
    }

    const segments = computeWordDiff(originalText, currentText)
    return segments.map(seg => {
      const escaped = seg.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')

      if (seg.type === 'insert') {
        return `<ins style="background:rgba(191,255,0,0.15);color:#BFFF00;text-decoration:none;padding:1px 4px;border-radius:3px;border-bottom:2px solid rgba(191,255,0,0.4)">${escaped}</ins>`
      }
      if (seg.type === 'delete') {
        return `<del style="background:rgba(239,68,68,0.1);color:#EF4444;text-decoration:line-through;padding:1px 4px;border-radius:3px;opacity:0.7">${escaped}</del>`
      }
      return escaped
    }).join('')
  }

  const hasChanges = planDoc ? stripHtml(planDoc.original_content) !== stripHtml(editContent || planDoc.current_content) : false

  // Save status indicator
  const statusConfig: Record<SaveStatus, { color: string; text: string }> = {
    saved: { color: '#666', text: 'Saved' },
    saving: { color: config.primaryColor, text: 'Saving...' },
    unsaved: { color: '#F59E0B', text: 'Unsaved changes' },
    error: { color: '#EF4444', text: 'Save failed' },
  }

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
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#888', fontSize: 14 }}>Loading build plan...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
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

  if (!planDoc) return null

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .plan-editor:focus { outline: none; }
        .plan-editor h1 { color: #FAFAFA; font-size: 26px; font-weight: 700; margin: 32px 0 16px; letter-spacing: -0.02em; }
        .plan-editor h2 {
          color: ${config.primaryColor};
          font-size: 18px;
          font-weight: 600;
          margin: 36px 0 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid ${config.primaryColor}20;
          letter-spacing: -0.01em;
        }
        .plan-editor h3 { color: #EAEAEA; font-size: 15px; font-weight: 600; margin: 24px 0 10px; }
        .plan-editor p { margin: 10px 0; line-height: 1.8; color: #BBB; }
        .plan-editor ul, .plan-editor ol { padding-left: 24px; margin: 12px 0; }
        .plan-editor li { margin: 6px 0; line-height: 1.7; color: #BBB; }
        .plan-editor li strong { color: #EAEAEA; }
        .plan-editor strong { color: #EAEAEA; }
        .plan-editor em { color: #888; font-style: italic; }
        .plan-editor table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .plan-editor th, .plan-editor td { padding: 10px 14px; border: 1px solid rgba(255,255,255,0.08); text-align: left; font-size: 13px; }
        .plan-editor th { background: ${config.primaryColor}10; color: ${config.primaryColor}; font-weight: 600; letter-spacing: 0.02em; }
        .plan-editor td { color: #AAA; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em' }}>
            {planDoc.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: planDoc.status === 'approved' ? 'rgba(74,222,128,0.12)' : `${config.primaryColor}12`,
              color: planDoc.status === 'approved' ? '#4ADE80' : config.primaryColor,
              border: planDoc.status === 'approved' ? '1px solid rgba(74,222,128,0.25)' : `1px solid ${config.primaryColor}25`,
            }}>
              {planDoc.status === 'approved' ? 'Approved' : 'Awaiting Your Review'}
            </span>
            {hasChanges && (
              <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 500 }}>
                You have edits
              </span>
            )}
          </div>
        </div>

        {/* Save status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
          <div style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: statusConfig[saveStatus].color,
            animation: saveStatus === 'saving' ? 'pulse 1s ease-in-out infinite' : 'none',
            boxShadow: `0 0 6px ${statusConfig[saveStatus].color}40`,
          }} />
          <span style={{ fontSize: 12, color: statusConfig[saveStatus].color, fontWeight: 450 }}>
            {statusConfig[saveStatus].text}
          </span>
        </div>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
        {([
          { key: 'redline' as ViewMode, label: 'Review Changes', icon: '👁' },
          { key: 'edit' as ViewMode, label: 'Edit Plan', icon: '✏️' },
        ]).map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => toggleMode(key)}
            style={{
              padding: '8px 20px',
              background: viewMode === key ? `${config.primaryColor}15` : 'transparent',
              border: viewMode === key ? `1px solid ${config.primaryColor}30` : '1px solid transparent',
              borderRadius: 7,
              color: viewMode === key ? config.primaryColor : '#666',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: viewMode === key ? 600 : 450,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 12 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Instruction bar */}
      {viewMode === 'edit' && (
        <div style={{
          padding: '10px 16px',
          background: `${config.primaryColor}10`,
          border: `1px solid ${config.primaryColor}30`,
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 13,
          color: '#AAA',
        }}>
          Edit directly below. Your changes save automatically. Switch to <strong style={{ color: config.primaryColor }}>Review Changes</strong> to see what you changed.
        </div>
      )}

      {viewMode === 'redline' && hasChanges && (
        <div style={{
          padding: '10px 16px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 13,
          color: '#AAA',
        }}>
          <span style={{ color: '#BFFF00' }}>Green text</span> = your additions. <span style={{ color: '#EF4444', textDecoration: 'line-through' }}>Red strikethrough</span> = removed from original.
        </div>
      )}

      {/* Document Body */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '40px 36px',
        minHeight: '60vh',
        fontSize: 15,
        lineHeight: 1.8,
        color: '#BBB',
        position: 'relative',
      }}>
        {viewMode === 'edit' ? (
          <div
            ref={editorRef}
            className="plan-editor"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onPaste={handlePaste}
            dangerouslySetInnerHTML={{ __html: editContent }}
            style={{
              outline: 'none',
              minHeight: '50vh',
              cursor: 'text',
            }}
          />
        ) : (
          <div
            className="plan-editor"
            dangerouslySetInnerHTML={{ __html: hasChanges ? renderRedline() : planDoc.current_content }}
          />
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 28,
        paddingTop: 24,
        borderTop: `1px solid ${config.primaryColor}10`,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ fontSize: 12, color: '#555' }}>
          {planDoc.last_edited_by && planDoc.last_edited_at && (
            <span>Last edited by <span style={{ color: '#888' }}>{planDoc.last_edited_by}</span> on {formatDate(planDoc.last_edited_at)}</span>
          )}
        </div>

        {planDoc.status !== 'approved' && (
          <button
            onClick={submitForApproval}
            style={{
              padding: '14px 32px',
              background: `linear-gradient(135deg, ${config.primaryColor}, ${config.primaryColor}DD)`,
              border: 'none',
              borderRadius: 10,
              color: '#060608',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              letterSpacing: '0.02em',
              boxShadow: `0 2px 16px ${config.primaryColor}25`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 6px 28px ${config.primaryColor}40`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 2px 16px ${config.primaryColor}25`
            }}
          >
            Approve Plan
          </button>
        )}

        {planDoc.status === 'approved' && (
          <div style={{
            padding: '12px 24px',
            background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: 10,
            color: '#4ADE80',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>&#10003;</span> Plan Approved
          </div>
        )}
      </div>
    </div>
  )
}
